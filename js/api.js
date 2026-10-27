// Live open countries API client
const LIVE_COUNTRIES_API = 'https://cdn.jsdelivr.net/npm/world-countries@latest/countries.json';
const LIVE_POPULATION_API = 'https://cdn.jsdelivr.net/npm/country-json@latest/src/country-by-population.json';
const LOCAL_FALLBACK = 'data/countries.json';

let cachedCountries = null;

export async function getCountriesData() {
  if (cachedCountries && cachedCountries.length > 0) {
    return cachedCountries;
  }

  try {
    // Fetch live open dataset from CDN
    const [countriesRes, popRes] = await Promise.all([
      fetch(LIVE_COUNTRIES_API),
      fetch(LIVE_POPULATION_API).catch(() => null)
    ]);

    if (!countriesRes.ok) {
      throw new Error(`Live API error: ${countriesRes.status}`);
    }

    const rawCountries = await countriesRes.json();
    const populationMap = {};

    if (popRes && popRes.ok) {
      try {
        const popData = await popRes.json();
        for (const item of popData) {
          if (item.country && item.population) {
            populationMap[item.country.toLowerCase()] = item.population;
          }
        }
      } catch (e) {
        console.warn('Could not parse population data:', e);
      }
    }

    // Normalize each country object to match expected schema (flags, population, capital, etc.)
    cachedCountries = rawCountries.map(c => {
      const code = (c.cca2 || '').toLowerCase();
      const commonName = c.name?.common || '';
      const pop = populationMap[commonName.toLowerCase()] || c.population || 5000000;

      return {
        ...c,
        population: pop,
        flags: {
          png: `https://flagcdn.com/w320/${code}.png`,
          svg: `https://flagcdn.com/${code}.svg`
        }
      };
    });

    return cachedCountries;
  } catch (error) {
    console.warn('Failed to load from live API, falling back to local data:', error);

    try {
      const localRes = await fetch(LOCAL_FALLBACK);
      if (localRes.ok) {
        cachedCountries = await localRes.json();
        return cachedCountries;
      }
    } catch (localErr) {
      console.error('Local fallback also failed:', localErr);
    }

    throw error;
  }
}

export async function getCountryByName(countryName) {
  const countries = await getCountriesData();
  const target = decodeURIComponent(countryName).trim().toLowerCase();

  const found = countries.find(c =>
    c.name?.common?.toLowerCase() === target ||
    c.name?.official?.toLowerCase() === target ||
    c.cca2?.toLowerCase() === target ||
    c.cca3?.toLowerCase() === target ||
    c.altSpellings?.some(alt => alt.toLowerCase() === target)
  );

  return found || null;
}
