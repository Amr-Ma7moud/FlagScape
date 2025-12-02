import { embedHTML } from "../util/utils.js"

embedHTML("head", "/htmlUtil/head.html")
embedHTML("header", "/htmlUtil/header.html")
embedHTML("sideBar", "/htmlUtil/sideBar.html")
embedHTML("map", "/htmlUtil/map.html")
embedHTML("fab", "/htmlUtil/fab.html").then(() => {
  document.getElementById("hekal").appendChild(document.createElement("span")).innerHTML="3mk Hekal"
})

function displayMap( mapUri = "world.svg" ){
  fetch(`assets/${mapUri}`)
    .then(res => res.text())
    .then(svgData => {
      document.getElementById('map-container').innerHTML = svgData;

      document.querySelectorAll('path').forEach(country => {
        country.addEventListener('click', (e) => {
          const name = country.getAttribute('title') || 'Unknown';
          alert(`You clicked on ${name}`);
        });
      });
    })
    .catch(err => console.error('Failed to load map', err));
}

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

// Wait for sidebar to load, then attach event listeners
setTimeout(() => {
  // Handle continent navigation
  const continentContainer = document.getElementById("continents");
  if (continentContainer) {
    const continentItems = continentContainer.querySelectorAll('p[id]');
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

  document.querySelectorAll("nav-item").forEach(item => {
      item.addEventListener('click', () => {
    alert(`You clicked on ${item.textContent}`);
      });
});

  // Handle game navigation
  const gamesContainer = document.getElementById("games");
  if (gamesContainer) {
    const gameItems = gamesContainer.parentElement.querySelectorAll('p[id]');
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
}, 500);

// Display the world map initially
displayMap();
