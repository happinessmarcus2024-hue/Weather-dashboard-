import React from 'react';
import './Weather.css';

function Weather({ data, onAddFavorite, isFavorite }) {
  const getWeatherEmoji = (icon) => {
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '🌥️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return iconMap[icon] || '🌤️';
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const unitSymbol = data.units === 'metric' ? '°C' : '°F';
  const speedUnit = data.units === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="weather-card card">
      <div className="weather-header">
        <div className="weather-title">
          <h2>{data.city}, {data.country}</h2>
          <p className="timestamp">Last updated: {new Date(data.timestamp).toLocaleTimeString()}</p>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={onAddFavorite}
          title={isFavorite ? 'Added to favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherEmoji(data.icon)}
        </div>
        <div className="weather-info">
          <div className="temperature">
            {data.temperature}{unitSymbol}
          </div>
          <div className="description">
            {data.description}
          </div>
          <div className="feels-like">
            Feels like {data.feels_like}{unitSymbol}
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="label">Temperature Range</span>
          <span className="value">{data.temp_min}{unitSymbol} - {data.temp_max}{unitSymbol}</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity</span>
          <span className="value">{data.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">Pressure</span>
          <span className="value">{data.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Speed</span>
          <span className="value">{data.wind_speed} {speedUnit}</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Direction</span>
          <span className="value">{getWindDirection(data.wind_deg)} ({data.wind_deg}°)</span>
        </div>
        <div className="detail-item">
          <span className="label">Cloud Coverage</span>
          <span className="value">{data.clouds}%</span>
        </div>
      </div>
    </div>
  );
}

export default Weather;
