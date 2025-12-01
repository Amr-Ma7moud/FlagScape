import { embedHTML } from "../util/utils.js"

embedHTML("head", "/htmlUtil/head.html")
embedHTML("header", "/htmlUtil/header.html")
embedHTML("sideBar", "/htmlUtil/sideBar.html")
embedHTML("map", "/htmlUtil/map.html")

function displayMap(){
  fetch('assets/world.svg')
    .then(res => res.text())
    .then(svgData => {
      document.getElementById('map-container').innerHTML = svgData;

      document.querySelectorAll('path').forEach(country => {
        country.addEventListener('click', (e) => {
          const name = country.getAttribute('title') || 'Unknown';
          // country.style.scale = 100;

          alert(`You clicked on ${name}`);
        });
      });
    })
    .catch(err => console.error('Failed to load world.svg', err));
}

// Build continent -> country names map from util/countries.json
let continentCountries = {};
async function loadCountries() {
  try {
    const res = await fetch('/util/countries.json');
    const data = await res.json();
    // Expecting array of { name, continent } or map; adapt generically
    if (Array.isArray(data)) {
      continentCountries = data.reduce((acc, item) => {
        const cont = item.continent || item.region || item.Continent;
        const name = item.name || item.country || item.Country;
        if (cont && name) {
          (acc[cont] ||= new Set()).add(name);
        }
        return acc;
      }, {});
    } else {
      // If it's already grouped by continent: { Europe: [..] }
      continentCountries = Object.fromEntries(
        Object.entries(data).map(([k, arr]) => [k, new Set(arr)])
      );
    }
  } catch (e) {
    console.error('Failed to load countries.json', e);
  }
}

function clearHighlights() {
  document.querySelectorAll('#map-container path').forEach(p => {
    p.style.fill = '';
    p.style.stroke = '';
    p.style.filter = '';
  });
}

function highlightContinent(continent) {
  const set = continentCountries[continent];
  if (!set) return;
  clearHighlights();
  document.querySelectorAll('#map-container path').forEach(p => {
    const title = p.getAttribute('title');
    if (title && set.has(title)) {
      p.style.fill = '#dfb417';
      p.style.stroke = '#2c3e50';
      p.style.filter = 'drop-shadow(0 0 6px rgba(0,0,0,0.4))';
    }
  });
}

function wireSidebar() {
  // Continent links
  document.querySelectorAll('[data-continent]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const continent = link.getAttribute('data-continent');
      highlightContinent(continent);
    });
  });
}

// Initialize
displayMap()
loadCountries().then(wireSidebar)