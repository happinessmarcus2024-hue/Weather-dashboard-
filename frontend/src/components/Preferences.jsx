import React from 'react';
import './Preferences.css';

function Preferences({ favorites, onSelectFavorite, onRemoveFavorite }) {
  return (
    <div className="preferences-card card">
      <h3>⭐ Favorite Locations</h3>
      <div className="favorites-list">
        {favorites.map((city, index) => (
          <div key={index} className="favorite-item">
            <button
              className="favorite-name"
              onClick={() => onSelectFavorite(city)}
            >
              {city}
            </button>
            <button
              className="remove-btn"
              onClick={() => onRemoveFavorite(city)}
              title="Remove from favorites"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Preferences;
