// Country Modal Manager - Best Practices Implementation
class CountryModal {
  constructor() {
    this.modal = null;
    this.overlay = null;
    this.isOpen = false;
    this.countryData = null;
  }

  async init() {
    // Wait for modal HTML to be loaded
    this.modal = document.getElementById('country-modal');
    this.overlay = this.modal?.querySelector('.modal-overlay');
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.modal) return;

    // Close on overlay click
    this.overlay?.addEventListener('click', () => this.close());

    // Close on X button click
    const closeBtn = this.modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => this.close());

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Quiz button action
    const quizBtn = document.getElementById('modal-quiz-btn');
    quizBtn?.addEventListener('click', () => {
      // Navigate to quiz game - could pass country as parameter
      window.location.href = 'guessTheFlag.html';
    });
  }

  async open(countryName) {
    if (!this.modal) return;

    try {
      // Fetch country data from REST Countries API
      const data = await this.fetchCountryData(countryName);
      if (!data) return;

      this.countryData = data;
      this.populateModal(data);
      
      // Show modal with animation
      this.modal.classList.add('modal-active');
      this.isOpen = true;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus management for accessibility
      this.modal.querySelector('.modal-close')?.focus();
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  close() {
    if (!this.modal) return;

    this.modal.classList.remove('modal-active');
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  async fetchCountryData(countryName) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
      
      if (!response.ok) {
        throw new Error('Country not found');
      }

      const data = await response.json();
      return data[0]; // API returns array, take first result
    } catch (error) {
      console.error('Error fetching country data:', error);
      
      // Fallback to basic info if API fails
      return {
        name: { common: countryName },
        capital: ['N/A'],
        region: 'N/A',
        population: 'N/A',
        languages: {},
        currencies: {},
        flags: { svg: '' }
      };
    }
  }

  populateModal(data) {
    // Country name
    const nameEl = document.getElementById('modal-title');
    if (nameEl) nameEl.textContent = data.name.common;

    // Flag
    const flagEl = document.getElementById('modal-flag');
    if (flagEl && data.flags?.svg) {
      flagEl.src = data.flags.svg;
      flagEl.alt = `Flag of ${data.name.common}`;
    }

    // Capital
    const capitalEl = document.getElementById('modal-capital');
    if (capitalEl) {
      capitalEl.textContent = data.capital?.[0] || 'N/A';
    }

    // Region
    const regionEl = document.getElementById('modal-region');
    if (regionEl) {
      const subregion = data.subregion ? ` (${data.subregion})` : '';
      regionEl.textContent = `${data.region || 'N/A'}${subregion}`;
    }

    // Population
    const populationEl = document.getElementById('modal-population');
    if (populationEl) {
      populationEl.textContent = data.population 
        ? data.population.toLocaleString() 
        : 'N/A';
    }

    // Languages
    const languagesEl = document.getElementById('modal-languages');
    if (languagesEl) {
      const languages = data.languages 
        ? Object.values(data.languages).join(', ') 
        : 'N/A';
      languagesEl.textContent = languages;
    }

    // Currency
    const currencyEl = document.getElementById('modal-currency');
    if (currencyEl) {
      const currencies = data.currencies 
        ? Object.values(data.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
        : 'N/A';
      currencyEl.textContent = currencies;
    }
  }
}

// Export singleton instance
export const countryModal = new CountryModal();
