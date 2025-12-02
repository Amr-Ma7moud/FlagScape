import { embedHTML } from "../util/utils.js"
import { countryModal } from "./countryModal.js"

// Map continent IDs to SVG file names
const continentMaps = {
  'NA': 'north-america.svg',
  'SA': 'south-america.svg', // South America - using world map as fallback
  'EU': 'europe.svg',
  'AS': 'asia.svg', // Asia - using world map as fallback
  'AF': 'africa.svg',
  'AU': 'australia.svg'
};

// Map game IDs to page URLs
const gamePages = {
  'GF': 'guessTheFlag.html',
  'ME': 'index.html', // Memory game - placeholder
  'FP': 'index.html'  // Flag Puzzle - placeholder
};

function displayMap( mapUri = "world.svg", continentName = "World" ){
  // Update legend
  const legend = document.querySelector('.map-container legend');
  if (legend) {
    legend.textContent = `${continentName} Map`;
  }

  // Remove selected class from all navigation buttons
  document.querySelectorAll('.world-map-btn, details button').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Add selected class to the appropriate button
  if (continentName === 'World') {
    const worldBtn = document.getElementById('world-map');
    if (worldBtn) worldBtn.classList.add('selected');
  } else {
    // Find and select the continent button
    const continentBtns = document.querySelectorAll('details button[id]');
    continentBtns.forEach(btn => {
      if (btn.textContent.trim() === continentName) {
        btn.classList.add('selected');
      }
    });
  }

  fetch(`assets/${mapUri}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Map not found');
      }
      return res.text();
    })
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
          if (name !== 'Unknown') {
            countryModal.open(name);
          }
        });
      });
    })
    .catch(err => {
      console.error('Failed to load map', err);
      const mapContainer = document.getElementById('map-container');
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; min-height: 400px;">
          <div style="text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.9); border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 2em;">🗺️ Map Not Available</h2>
            <p style="color: #555; font-size: 1.2em; margin: 0;">The ${continentName} map is currently not available.</p>
            <p style="color: #777; font-size: 1em; margin-top: 10px;">Please select another continent or view the World map.</p>
          </div>
        </div>
      `;
    });
}

function setupNavigationListeners() {
  // Handle World Map button
  const worldMapBtn = document.getElementById("world-map");
  if (worldMapBtn) {
    worldMapBtn.addEventListener('click', () => {
      console.log('Loading World Map');
      displayMap('world.svg', 'World');
    });
  }

  // Handle continent navigation
  const continentContainer = document.getElementById("continents");
  if (continentContainer) {
    const continentItems = continentContainer.querySelectorAll('button[id]');
    console.log(`Found ${continentItems.length} continent buttons`);
    continentItems.forEach(continent => {
      continent.addEventListener('click', (e) => {
        const continentId = continent.id;
        const mapFile = continentMaps[continentId];
        const continentName = continent.textContent.trim();
        if (mapFile) {
          console.log(`Loading map for ${continentName}: ${mapFile}`);
          displayMap(mapFile, continentName);
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
  
  // Load country modal
  const modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
  await embedHTML(modalContainer.id = 'modal-root', "/htmlUtil/countryModal.html");
  await countryModal.init();
  
  // Now that sidebar is loaded, set up event listeners
  setupNavigationListeners();
  
  // Add Hekal span after fab is loaded as something weird happens here his nae doesn't render at the screen
  document.getElementById("hekal").appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  // Display the world map initially
  displayMap('world.svg', 'World');
}

// Initialize the page
initializePage();
