from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from datetime import datetime
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenWeatherMap API configuration
API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = 'https://api.openweathermap.org/data/2.5'

if not API_KEY:
    logger.error('OPENWEATHER_API_KEY not found in environment variables')

# Cache for weather data (simple in-memory cache)
weather_cache = {}

def is_cache_valid(city, cache_time=600):  # 10 minutes
    """Check if cached data is still valid"""
    if city not in weather_cache:
        return False
    return (datetime.now() - weather_cache[city]['timestamp']).seconds < cache_time

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Fetch current weather for a city"""
    try:
        city = request.args.get('city', '').strip()
        units = request.args.get('units', 'metric')  # metric for Celsius, imperial for Fahrenheit
        
        if not city:
            return jsonify({'error': 'City parameter is required'}), 400
        
        # Check cache
        cache_key = f"{city}_{units}"
        if is_cache_valid(cache_key):
            logger.info(f"Returning cached data for {city}")
            return jsonify(weather_cache[cache_key]['data']), 200
        
        # Fetch from OpenWeatherMap API
        params = {
            'q': city,
            'appid': API_KEY,
            'units': units
        }
        
        response = requests.get(f'{BASE_URL}/weather', params=params, timeout=10)
        
        if response.status_code == 404:
            return jsonify({'error': f'City "{city}" not found'}), 404
        elif response.status_code == 401:
            return jsonify({'error': 'Invalid API key'}), 401
        elif response.status_code != 200:
            return jsonify({'error': 'Error fetching weather data'}), response.status_code
        
        data = response.json()
        
        # Extract relevant data
        weather_data = {
            'city': data['name'],
            'country': data['sys'].get('country', ''),
            'temperature': round(data['main']['temp'], 1),
            'feels_like': round(data['main']['feels_like'], 1),
            'temp_min': round(data['main']['temp_min'], 1),
            'temp_max': round(data['main']['temp_max'], 1),
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'description': data['weather'][0]['description'].capitalize(),
            'icon': data['weather'][0]['icon'],
            'wind_speed': round(data['wind']['speed'], 1),
            'wind_deg': data['wind'].get('deg', 0),
            'clouds': data['clouds']['all'],
            'timestamp': datetime.now().isoformat(),
            'units': units
        }
        
        # Cache the result
        weather_cache[cache_key] = {
            'data': weather_data,
            'timestamp': datetime.now()
        }
        
        logger.info(f"Successfully fetched weather for {city}")
        return jsonify(weather_data), 200
    
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout. Please try again.'}), 504
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Connection error. Please check your internet connection.'}), 503
    except Exception as e:
        logger.error(f"Error fetching weather: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    """Fetch 5-day weather forecast for a city"""
    try:
        city = request.args.get('city', '').strip()
        units = request.args.get('units', 'metric')
        
        if not city:
            return jsonify({'error': 'City parameter is required'}), 400
        
        # Check cache
        cache_key = f"forecast_{city}_{units}"
        if is_cache_valid(cache_key):
            logger.info(f"Returning cached forecast for {city}")
            return jsonify(weather_cache[cache_key]['data']), 200
        
        # Fetch from OpenWeatherMap API
        params = {
            'q': city,
            'appid': API_KEY,
            'units': units
        }
        
        response = requests.get(f'{BASE_URL}/forecast', params=params, timeout=10)
        
        if response.status_code == 404:
            return jsonify({'error': f'City "{city}" not found'}), 404
        elif response.status_code != 200:
            return jsonify({'error': 'Error fetching forecast data'}), response.status_code
        
        data = response.json()
        
        # Extract forecast data (one entry per day at noon)
        forecast_list = []
        daily_forecasts = {}
        
        for item in data['list']:
            date = item['dt_txt'].split()[0]
            
            # Keep only one forecast per day (around noon)
            if date not in daily_forecasts or '12:' in item['dt_txt']:
                daily_forecasts[date] = {
                    'date': date,
                    'temp_max': round(item['main']['temp_max'], 1),
                    'temp_min': round(item['main']['temp_min'], 1),
                    'description': item['weather'][0]['description'].capitalize(),
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': round(item['wind']['speed'], 1)
                }
        
        # Convert to list and sort by date
        forecast_list = sorted(daily_forecasts.values(), key=lambda x: x['date'])[:5]
        
        forecast_data = {
            'city': data['city']['name'],
            'country': data['city']['country'],
            'forecast': forecast_list,
            'units': units,
            'timestamp': datetime.now().isoformat()
        }
        
        # Cache the result
        weather_cache[cache_key] = {
            'data': forecast_data,
            'timestamp': datetime.now()
        }
        
        logger.info(f"Successfully fetched forecast for {city}")
        return jsonify(forecast_data), 200
    
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout. Please try again.'}), 504
    except Exception as e:
        logger.error(f"Error fetching forecast: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'api_key_configured': bool(API_KEY),
        'timestamp': datetime.now().isoformat()
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
