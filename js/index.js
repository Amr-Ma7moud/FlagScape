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
  'CC': 'capitalChallenge.html',
  'SQ': 'speedQuiz.html'
};

function displayMap( mapUri = "world.svg", continentName = "World" ){
  // Update legend
  const legend = document.querySelector('.map-container legend');
  if (legend) {
    legend.textContent = `${continentName} Map`;
  }

  // Remove selected class from all navigation buttons
  document.querySelectorAll('.world-map-btn, details a').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Add selected class to the appropriate button
  if (continentName === 'World') {
    const worldBtn = document.getElementById('world-map');
    if (worldBtn) worldBtn.classList.add('selected');
  } else {
    // Find and select the continent link
    const continentLinks = document.querySelectorAll('details a[id]');
    continentLinks.forEach(link => {
      if (link.textContent.trim() === continentName) {
        link.classList.add('selected');
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
  // Check if we're on the index page
  const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
  
  if (!isIndexPage) {
    // Not on index page, let anchors work normally
    return;
  }

  // On index page: prevent default and use JavaScript navigation
  // Handle World Map button
  const worldMapBtn = document.getElementById("world-map");
  if (worldMapBtn) {
    worldMapBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Loading World Map');
      displayMap('world.svg', 'World');
      // Update URL without reload
      window.history.pushState({}, '', 'index.html');
    });
  }

  // Handle continent navigation
  const continentContainer = document.getElementById("continents");
  if (continentContainer) {
    const continentItems = continentContainer.querySelectorAll('a[id]');
    console.log(`Found ${continentItems.length} continent links`);
    continentItems.forEach(continent => {
      continent.addEventListener('click', (e) => {
        e.preventDefault();
        const continentId = continent.id;
        const mapFile = continentMaps[continentId];
        const continentName = continent.textContent.trim();
        if (mapFile) {
          console.log(`Loading map for ${continentName}: ${mapFile}`);
          displayMap(mapFile, continentName);
          // Update URL without reload
          window.history.pushState({}, '', `index.html?continent=${continentId}`);
        }
      });
    });
  }
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sideBar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (!menuToggle || !sidebar || !overlay) return;
  
  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  };
  
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on a navigation item
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
      if (window.innerWidth <= 768) {
        toggleMenu();
      }
    }
  });
}

// Load all HTML components and wait for them to finish
async function initializePage() {
  await embedHTML("head", "htmlUtil/head.html");
  await embedHTML("header", "htmlUtil/header.html");
  await embedHTML("sideBar", "htmlUtil/sideBar.html");
  await embedHTML("map", "htmlUtil/map.html");
  await embedHTML("fab", "htmlUtil/fab.html");
  
  // Load country modal
  const modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
  await embedHTML(modalContainer.id = 'modal-root', "htmlUtil/countryModal.html");
  await countryModal.init();
  
  // Now that sidebar is loaded, set up event listeners
  setupNavigationListeners();
  setupMobileMenu();
  
  // Add Hekal span after fab is loaded as something weird happens here his nae doesn't render at the screen
  document.getElementById("hekal").appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  // Check URL parameters for continent
  const urlParams = new URLSearchParams(window.location.search);
  const continentParam = urlParams.get('continent');
  
  if (continentParam && continentMaps[continentParam]) {
    // Load the continent from URL parameter
    const continentLink = document.getElementById(continentParam);
    const continentName = continentLink ? continentLink.textContent.trim() : continentParam;
    displayMap(continentMaps[continentParam], continentName);
  } else {
    // Display the world map initially
    displayMap('world.svg', 'World');
  }
}

// Initialize the page
initializePage();
