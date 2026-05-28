import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import Preferences from './components/Preferences';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [units, setUnits] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    const savedUnits = localStorage.getItem('weatherUnits');
    const savedCity = localStorage.getItem('lastCity');

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedUnits) setUnits(savedUnits);
    if (savedCity) {
      setCity(savedCity);
      fetchWeatherData(savedCity, savedUnits || 'metric');
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weatherUnits', units);
  }, [units]);

  const fetchWeatherData = async (searchCity, searchUnits = units) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch current weather
      const weatherResponse = await axios.get('/api/weather', {
        params: {
          city: searchCity,
          units: searchUnits
        }
      });

      setWeather(weatherResponse.data);
      localStorage.setItem('lastCity', searchCity);

      // Fetch forecast
      const forecastResponse = await axios.get('/api/forecast', {
        params: {
          city: searchCity,
          units: searchUnits
        }
      });

      setForecast(forecastResponse.data);
      setCity(searchCity);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const handleAddFavorite = () => {
    if (weather && !favorites.includes(weather.city)) {
      setFavorites([...favorites, weather.city]);
    }
  };

  const handleRemoveFavorite = (favCity) => {
    setFavorites(favorites.filter(fav => fav !== favCity));
  };

  const handleSelectFavorite = (favCity) => {
    fetchWeatherData(favCity);
  };

  const handleToggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    if (weather) {
      fetchWeatherData(weather.city, newUnits);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>🌤️ Weather Dashboard</h1>
          <p>Get real-time weather updates for any location</p>
        </header>

        {/* Search Bar */}
        <div className="card">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
            <button
              type="button"
              className="units-btn"
              onClick={handleToggleUnits}
              title="Toggle temperature units"
            >
              °{units === 'metric' ? 'C' : 'F'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && <div className="error">{error}</div>}

        {/* Loading */}
        {loading && <div className="loading">Loading weather data...</div>}

        {/* Weather Data */}
        {weather && (
          <>
            <Weather
              data={weather}
              onAddFavorite={handleAddFavorite}
              isFavorite={favorites.includes(weather.city)}
            />
            {forecast && <Forecast data={forecast} />}
          </>
        )}

        {/* Preferences & Favorites */}
        {favorites.length > 0 && (
          <Preferences
            favorites={favorites}
            onSelectFavorite={handleSelectFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        )}

        {/* Welcome Message */}
        {!weather && !loading && (
          <div className="card welcome">
            <h2>Welcome to Weather Dashboard</h2>
            <p>Search for a city to get started with real-time weather information.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
