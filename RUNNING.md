# 🗺️ FlagScape - Running the Application

This guide explains how to run FlagScape with the integrated Python backend.

## 🚀 Quick Start

### 1. Start the Backend Server

The backend is a Flask server that provides country data locally instead of relying on the public REST Countries API.

```bash
cd backend
./start.sh
```

The `start.sh` script will automatically:
- Create a virtual environment (if it doesn't exist)
- Install all required dependencies
- Seed the database with country data from the REST Countries API
- Start the Flask server on `http://localhost:5000`

**Alternative Manual Start:**

```bash
cd backend

# Activate the virtual environment
source venv/bin/activate

# Run the Flask server
python app.py
```

### 2. Access the Frontend

Once the backend is running, you have two options:

#### Option A: Using a Local Web Server (Recommended)

Use a simple HTTP server to serve the frontend files:

```bash
# Using Python 3
python3 -m http.server 8080

# Or using Python 2
python -m SimpleHTTPServer 8080

# Or using Node.js (if installed)
npx http-server -p 8080
```

Then open your browser to: `http://localhost:8080`

#### Option B: Direct File Access

You can also open `index.html` directly in your browser, but using a local server is recommended for better compatibility with JavaScript modules.

## 📁 Project Structure

```
FlagScape/
├── backend/
│   ├── app.py                 # Flask application
│   ├── start.sh              # Startup script
│   ├── requirements.txt      # Python dependencies
│   ├── data/
│   │   └── countries.json    # Local country data (created by seed script)
│   └── scripts/
│       └── seed.py           # Database seeding script
├── js/                       # Frontend JavaScript files
├── css/                      # Stylesheets
├── htmlUtil/                 # Reusable HTML components
├── assets/                   # Images and SVG maps
└── *.html                    # HTML pages
```

## 🎮 Features

The application includes several interactive games and features:

1. **Interactive World Map** - Click on countries to see details
2. **Guess the Flag** - Multiple game modes:
   - ⚡ Hybrid Timer
   - 🏃 Speed Run
   - 💀 Sudden Death
   - ⌨️ Type It!
   - ⚡💨 Blitz Mode
   - 🏅 Marathon
3. **Capital Challenge** - Test your knowledge of world capitals
4. **Speed Quiz** - Fast-paced mixed questions about countries
5. **Country Details** - Comprehensive information about each country

## 🔧 Backend API Endpoints

The Flask backend provides the following endpoints that mimic the REST Countries API:

- `GET /v3.1/all` - Get all countries
  - Query parameter: `?fields=name,capital,etc` - Filter specific fields
- `GET /v3.1/name/<country_name>` - Search countries by name
  - Query parameter: `?fullText=true` - Exact match only

## 📦 Requirements

### Backend
- Python 3.x
- Flask
- Flask-CORS
- Requests

### Frontend
- Modern web browser with JavaScript enabled
- (Optional) Local web server for better compatibility

## 🛠️ Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

**Missing dependencies:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Data not loaded:**
```bash
cd backend
source venv/bin/activate
python scripts/seed.py
```

### Frontend Issues

**CORS errors:**
- Make sure the backend is running with Flask-CORS enabled
- Use a local web server instead of opening files directly

**Module import errors:**
- Ensure you're using a local web server (not file://)
- Check that your browser supports ES6 modules

**Countries not loading:**
- Verify the backend is running: `curl http://localhost:5000/v3.1/all`
- Check browser console for error messages
- Ensure the backend returned data successfully

## 🌐 Browser Compatibility

The application works best on modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 Notes

- The backend seeds data from the public REST Countries API on first run
- All game data is served from your local backend for faster performance
- The application works offline after initial data seeding
- Country data includes 250+ countries across all continents
