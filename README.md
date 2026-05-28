# Weather Dashboard

A full-stack weather application built with React (frontend) and Python Flask (backend). Displays current weather, forecasts, and temperature data with user preference persistence.

## Features

- ✅ Current weather display for any location
- ✅ 5-day weather forecast
- ✅ Temperature in Celsius/Fahrenheit
- ✅ Save favorite locations
- ✅ Persistent user preferences (localStorage)
- ✅ Real-time weather data from OpenWeatherMap API
- ✅ Responsive design

## Tech Stack

**Frontend:**
- React 18
- Axios (HTTP client)
- CSS3 (responsive design)

**Backend:**
- Python 3.9+
- Flask (web framework)
- Flask-CORS (cross-origin support)
- Requests library (API calls)

**API:**
- OpenWeatherMap (free tier)

## Project Structure

```
weather-dashboard/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Weather.jsx
│   │   │   ├── Forecast.jsx
│   │   │   └── Preferences.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   └── public/
├── backend/               # Python Flask API
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/happinessmarcus2024-hue/Weather-dashboard-.git
   cd Weather-dashboard-
   ```

2. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Get OpenWeatherMap API key:**
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Copy your free API key
   - Create `.env` file:
     ```
     OPENWEATHER_API_KEY=your_api_key_here
     FLASK_ENV=development
     ```

5. **Run backend:**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   App runs on `http://localhost:3000`

## API Endpoints

### Get Current Weather
```
GET /api/weather?city=London&units=metric
```

Response:
```json
{
  "city": "London",
  "temperature": 15,
  "humidity": 72,
  "description": "Partly cloudy",
  "wind_speed": 12,
  "pressure": 1013
}
```

### Get Forecast
```
GET /api/forecast?city=London&units=metric
```

Response:
```json
{
  "forecast": [
    {
      "date": "2024-05-29",
      "temp_max": 18,
      "temp_min": 12,
      "description": "Rainy"
    }
  ]
}
```

## Usage

1. Enter a city name in the search bar
2. View current weather conditions
3. Check 5-day forecast
4. Toggle temperature units (°C / °F)
5. Save favorite locations (stored in browser)
6. Click favorites to quickly view weather

## Deployment

### Deploy Backend (Heroku)

```bash
cd backend
heroku create your-app-name
git push heroku main
heroku config:set OPENWEATHER_API_KEY=your_key
```

### Deploy Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

## PM Portfolio Notes

This project demonstrates:
- **User-centric design:** Simple, intuitive interface
- **Feature prioritization:** MVP with expandable features
- **Data persistence:** Local storage for preferences
- **API integration:** Third-party service integration
- **Responsive design:** Works on desktop and mobile
- **Error handling:** Graceful fallbacks for API failures

## Future Enhancements

- [ ] Geolocation support
- [ ] Weather alerts/notifications
- [ ] Historical weather data
- [ ] Air quality index
- [ ] Multiple language support
- [ ] Dark mode
- [ ] User authentication
- [ ] Weather maps visualization

## License

MIT
