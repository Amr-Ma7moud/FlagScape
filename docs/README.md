# 🌍 FlagScape

An interactive geography learning platform built with Vanilla JavaScript, CSS, and HTML for the Network & Web Programming Course Project.

## ✨ Features

### 🗺️ Interactive Maps
- **World Map** - Explore all countries globally
- **Continent Maps** - Focus on specific regions (North America, South America, Europe, Asia, Africa, Australia)
- **Interactive SVG** - Click on any country to see detailed information
- **Responsive Design** - Mobile-friendly with hamburger menu

### 🎮 Three Engaging Games

1. **🏳️ Guess The Flag** - 6 game modes
   - Hybrid Timer (per-question + reserve pool)
   - Speed Run (120s global timer)
   - Sudden Death (one mistake = game over)
   - Typing Mode (with autocomplete)
   - Blitz Mode (7s per question)
   - Marathon (20 questions)

2. **🏛️ Capital Challenge**
   - 30-second timer with bonuses/penalties
   - Progressive level system
   - Score multipliers

3. **⚡ Speed Quiz**
   - 60-second mixed geography questions
   - Combo system for consecutive correct answers
   - Multiple question types (flags, capitals, regions, population, languages)

### 📊 Country Information
- Country flags and details
- Population, capital, region information
- Interactive modal dialogs
- Smooth animations and transitions

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modular stylesheets (base, sidebar, navigation, map, modal, components, responsive)
- **Vanilla JavaScript (ES6+)** - No frameworks, modern JS features
- **REST Countries API** - Real-time country data
- **SVG Maps** - Interactive scalable vector graphics

## 📁 Project Structure

```
FlagScape/
├── index.html              # Main page
├── guessTheFlag.html       # Guess the flag game
├── capitalChallenge.html   # Capital challenge game
├── speedQuiz.html          # Speed quiz game
├── css/
│   ├── base.css           # Base styles & reset
│   ├── sidebar.css        # Sidebar & hamburger menu
│   ├── navigation.css     # Navigation items
│   ├── map.css            # Map container & SVG
│   ├── modal.css          # Country modal dialog
│   ├── country-details.css # Country details page
│   ├── components.css     # Reusable components
│   ├── games.css          # Game-specific styles
│   └── responsive.css     # Media queries
├── js/
│   ├── index.js           # Main page logic
│   ├── guessTheFlag.js    # Guess the flag game
│   ├── capitalChallenge.js # Capital challenge game
│   ├── speedQuiz.js       # Speed quiz game
│   ├── countryModal.js    # Modal functionality
│   └── sideBar.js         # Navigation logic
├── htmlUtil/              # Reusable HTML components
├── assets/                # SVG maps & images
└── util/                  # Utility functions

```

## 🚀 Deployment to GitHub Pages

The site is **ready for GitHub Pages deployment**! All paths have been fixed to work with GitHub's hosting.

### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for GitHub Pages deployment"
   git push origin master
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select branch: **master** (or **main**)
   - Select folder: **/ (root)**
   - Click **Save**

3. **Access Your Site**
   - Your site will be available at: `https://amr-ma7moud.github.io/FlagScape/`
   - Wait 1-2 minutes for the initial deployment

### ✅ Deployment Checklist

- [x] All paths are relative (no leading slashes)
- [x] CSS files properly modularized
- [x] JavaScript uses ES6 modules
- [x] Images and assets in correct directories
- [x] Responsive design tested
- [x] API calls to REST Countries (external, will work from anywhere)
- [x] No server-side dependencies

## 🎯 How to Use Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amr-Ma7moud/FlagScape.git
   cd FlagScape
   ```

2. **Run with a local server** (required for ES6 modules)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx serve
   
   # Or using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8000`

## 👥 Contributors

- **3mk Amr** - Developer
- **3mk Hekal** - Developer

## 📄 License

This project is created for educational purposes as part of the Network & Web Programming Course.

---

**Note**: All country data is fetched from the [REST Countries API](https://restcountries.com/) in real-time.
