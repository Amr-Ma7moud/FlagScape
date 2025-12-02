import { embedHTML } from "../util/utils.js"

// Map continent IDs to SVG file names
const continentMaps = {
  'NA': 'north-america.svg',
  'SA': 'world.svg', // South America - using world map as fallback
  'EU': 'europe.svg',
  'AS': 'world.svg', // Asia - using world map as fallback
  'AF': 'africa.svg',
  'AU': 'australia.svg'
};

// Map game IDs to page URLs
const gamePages = {
  'GF': 'guessTheFlag.html',
  'ME': 'index.html', // Memory game - placeholder
  'FP': 'index.html'  // Flag Puzzle - placeholder
};

function displayMap( mapUri = "world.svg" ){
  fetch(`assets/${mapUri}`)
    .then(res => res.text())
    .then(svgData => {
      const mapContainer = document.getElementById('map-container');
      mapContainer.innerHTML = svgData;

      // Select paths within the map container specifically
      const countryPaths = mapContainer.querySelectorAll('path[title]');
      console.log(`Found ${countryPaths.length} countries`);
      
      countryPaths.forEach(country => {
        country.style.cursor = 'pointer';
        country.addEventListener('click', (e) => {
          const name = country.getAttribute('title') || 'Unknown';
          alert(`You clicked on ${name}`);
        });
      });
    })
    .catch(err => console.error('Failed to load map', err));
}

function setupNavigationListeners() {
  // Handle continent navigation
  const continentContainer = document.getElementById("continents");
  if (continentContainer) {
    const continentItems = continentContainer.querySelectorAll('button[id]');
    console.log(`Found ${continentItems.length} continent buttons`);
    continentItems.forEach(continent => {
      continent.addEventListener('click', (e) => {
        const continentId = continent.id;
        const mapFile = continentMaps[continentId];
        if (mapFile) {
          console.log(`Loading map for ${continent.textContent}: ${mapFile}`);
          displayMap(mapFile);
        }
      });
    });
  }
  
  // Handle game navigation
  const gamesContainer = document.getElementById("games");
  if (gamesContainer) {
    const gameItems = gamesContainer.parentElement.querySelectorAll('button[id]');
    console.log(`Found ${gameItems.length} game buttons`);
    gameItems.forEach(game => {
      game.addEventListener('click', (e) => {
        const gameId = game.id;
        const gamePage = gamePages[gameId];
        if (gamePage) {
          console.log(`Navigating to ${game.textContent}: ${gamePage}`);
          window.location.href = gamePage;
        }
      });
    });
  }
}

// Load all HTML components and wait for them to finish
async function initializePage() {
  await embedHTML("head", "/htmlUtil/head.html");
  await embedHTML("header", "/htmlUtil/header.html");
  await embedHTML("sideBar", "/htmlUtil/sideBar.html");
  await embedHTML("map", "/htmlUtil/map.html");
  await embedHTML("fab", "/htmlUtil/fab.html");
  
  // Now that sidebar is loaded, set up event listeners
  setupNavigationListeners();
  
  // Add Hekal span after fab is loaded as something weird happens here his nae doesn't render at the screen
  document.getElementById("hekal").appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  // Display the world map initially
  displayMap();
}

// Initialize the page
initializePage();
