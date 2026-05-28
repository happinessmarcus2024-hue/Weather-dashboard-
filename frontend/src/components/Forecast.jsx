import React from 'react';
import './Forecast.css';

function Forecast({ data }) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const unitSymbol = data.units === 'metric' ? '°C' : '°F';
  const speedUnit = data.units === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="forecast-card card">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {data.forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-date">{formatDate(day.date)}</div>
            <div className="forecast-icon">{getWeatherEmoji(day.icon)}</div>
            <div className="forecast-description">{day.description}</div>
            <div className="forecast-temps">
              <span className="temp-max">{day.temp_max}{unitSymbol}</span>
              <span className="temp-min">{day.temp_min}{unitSymbol}</span>
            </div>
            <div className="forecast-details">
              <div className="forecast-detail">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{day.humidity}%</span>
              </div>
              <div className="forecast-detail">
                <span className="detail-label">Wind</span>
                <span className="detail-value">{day.wind_speed} {speedUnit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
