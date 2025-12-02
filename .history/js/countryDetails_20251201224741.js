import { embedHTML } from "../util/utils.js"

// Mock data generator for country details (until backend is ready)
const mockCountryData = {
  // More extensive mock data with fun facts
  generateMockData(countryName, basicData) {
    const mockFacts = [
      `${countryName} is known for its stunning landscapes and rich cultural heritage.`,
      `The country has over 50 UNESCO World Heritage Sites recognized globally.`,
      `Traditional festivals attract millions of visitors from around the world each year.`,
      `${countryName} is a leading producer of renewable energy in its region.`,
      `The national cuisine has influenced food culture across multiple continents.`,
      `Ancient ruins dating back over 2,000 years can still be found throughout the country.`
    ];

    const climates = ['Tropical', 'Temperate', 'Mediterranean', 'Continental', 'Arid', 'Polar', 'Subtropical'];
    const religions = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Traditional Beliefs', 'Mixed'];
    const ethnicGroups = ['Diverse ethnic composition', 'Predominantly homogeneous', 'Multi-ethnic society'];
    const industries = ['Technology', 'Agriculture', 'Tourism', 'Manufacturing', 'Mining', 'Finance'];

    return {
      motto: `"Unity, Freedom, and Prosperity" (National Motto)`,
      officialName: basicData.name?.official || `The Republic of ${countryName}`,
      lifeExpectancy: `${Math.floor(Math.random() * 20) + 65} years`,
      literacyRate: `${Math.floor(Math.random() * 20) + 80}%`,
      density: `${Math.floor(Math.random() * 500) + 50} people/km²`,
      religions: religions[Math.floor(Math.random() * religions.length)] + ', ' + religions[Math.floor(Math.random() * religions.length)],
      ethnicGroups: ethnicGroups[Math.floor(Math.random() * ethnicGroups.length)],
      gdp: `$${Math.floor(Math.random() * 900 + 100)} billion`,
      gdpPerCapita: `$${(Math.floor(Math.random() * 50) + 10) * 1000}`,
      industries: industries.sort(() => Math.random() - 0.5).slice(0, 3).join(', '),
      coordinates: `${(Math.random() * 180 - 90).toFixed(2)}° N, ${(Math.random() * 360 - 180).toFixed(2)}° E`,
      coastline: `${Math.floor(Math.random() * 5000)} km`,
      highestPoint: `Mt. ${countryName.slice(0, 4)}peak - ${Math.floor(Math.random() * 6000 + 1000)}m`,
      climate: climates[Math.floor(Math.random() * climates.length)],
      funFacts: mockFacts.sort(() => Math.random() - 0.5).slice(0, 4)
    };
  }
};

async function initializePage() {
  await embedHTML("head", "/htmlUtil/head.html");
  await embedHTML("header", "/htmlUtil/header.html");
  await embedHTML("sideBar", "/htmlUtil/sideBar.html");
  await embedHTML("fab", "/htmlUtil/fab.html");
  document.getElementById("hekal")?.appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  loadCountryDetails();
}

async function loadCountryDetails() {
  // Get country name from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get('country');

  if (!countryName) {
    window.location.href = 'index.html';
    return;
  }

  document.title = `FlagScape - ${countryName}`;

  try {
    // Fetch basic data from REST Countries API
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
    const data = await response.json();
    const country = data[0];

    // Generate mock data for fields not in API
    const mockData = mockCountryData.generateMockData(countryName, country);

    // Populate the page
    populateCountryDetails(country, mockData);
  } catch (error) {
    console.error('Error loading country details:', error);
    document.getElementById('country-name').textContent = 'Country not found';
  }

  // Setup back button
  document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back();
  });
}

function populateCountryDetails(country, mockData) {
  // Hero section
  document.getElementById('country-name').textContent = country.name.common;
  document.getElementById('country-flag').src = country.flags?.svg || '';
  document.getElementById('country-flag').alt = `Flag of ${country.name.common}`;
  document.getElementById('country-motto').textContent = mockData.motto;

  // Basic Info
  document.getElementById('official-name').textContent = mockData.officialName;
  document.getElementById('capital').textContent = country.capital?.[0] || 'N/A';
  document.getElementById('region').textContent = country.region || 'N/A';
  document.getElementById('subregion').textContent = country.subregion || 'N/A';
  document.getElementById('area').textContent = country.area 
    ? `${country.area.toLocaleString()} km²` 
    : 'N/A';

  // Demographics
  document.getElementById('population').textContent = country.population 
    ? country.population.toLocaleString() 
    : 'N/A';
  document.getElementById('density').textContent = mockData.density;
  document.getElementById('life-expectancy').textContent = mockData.lifeExpectancy;
  document.getElementById('literacy-rate').textContent = mockData.literacyRate;

  // Language & Culture
  const languages = country.languages 
    ? Object.values(country.languages).join(', ') 
    : 'N/A';
  document.getElementById('languages').textContent = languages;
  document.getElementById('religions').textContent = mockData.religions;
  document.getElementById('ethnic-groups').textContent = mockData.ethnicGroups;

  // Economy
  const currencies = country.currencies 
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
    : 'N/A';
  document.getElementById('currency').textContent = currencies;
  document.getElementById('gdp').textContent = mockData.gdp;
  document.getElementById('gdp-per-capita').textContent = mockData.gdpPerCapita;
  document.getElementById('industries').textContent = mockData.industries;

  // Geography
  document.getElementById('coordinates').textContent = country.latlng 
    ? `${country.latlng[0]}° N, ${country.latlng[1]}° E` 
    : mockData.coordinates;
  
  const borders = country.borders && country.borders.length > 0
    ? `${country.borders.length} countries`
    : 'Island nation / No land borders';
  document.getElementById('borders').textContent = borders;
  document.getElementById('coastline').textContent = mockData.coastline;
  document.getElementById('highest-point').textContent = mockData.highestPoint;
  document.getElementById('climate').textContent = mockData.climate;

  // Fun Facts
  const funFactsContainer = document.getElementById('fun-facts');
  funFactsContainer.innerHTML = '';
  mockData.funFacts.forEach((fact, index) => {
    const factElement = document.createElement('div');
    factElement.className = 'fun-fact-item';
    factElement.innerHTML = `
      <span class="fact-number">${index + 1}</span>
      <span class="fact-text">${fact}</span>
    `;
    funFactsContainer.appendChild(factElement);
  });
}

initializePage();
