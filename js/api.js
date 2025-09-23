// API client for CosmosLive application
class APIClient {
  constructor() {
    this.baseURL = '';
    this.endpoints = {
      spacex: {
        company: 'https://api.spacex.land/rest/company',
        launches: 'https://api.spacex.land/rest/launches',
        rockets: 'https://api.spacex.land/rest/rockets'
      },
      iss: {
        location: 'http://api.open-notify.org/iss-now.json',
        astronauts: 'http://api.open-notify.org/astros.json'
      },
      nasa: {
        apod: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
      },
      launches: {
        upcoming: 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/',
        recent: 'https://ll.thespacedevs.com/2.2.0/launch/previous/'
      },
      earthquakes: {
        usgs: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&minmagnitude=4.0&limit=10'
      }
    };
  }

  async fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // SpaceX API methods
  async getSpaceXCompany() {
    try {
      return await this.fetchWithTimeout(this.endpoints.spacex.company);
    } catch (error) {
      console.error('Error fetching SpaceX company data:', error);
      return null;
    }
  }

  async getSpaceXLaunches() {
    try {
      return await this.fetchWithTimeout(this.endpoints.spacex.launches);
    } catch (error) {
      console.error('Error fetching SpaceX launches:', error);
      return null;
    }
  }

  async getSpaceXRockets() {
    try {
      return await this.fetchWithTimeout(this.endpoints.spacex.rockets);
    } catch (error) {
      console.error('Error fetching SpaceX rockets:', error);
      return null;
    }
  }

  async getLatestLaunch() {
    try {
      const launches = await this.getSpaceXLaunches();
      if (launches && launches.length > 0) {
        return launches[launches.length - 1];
      }
      return null;
    } catch (error) {
      console.error('Error fetching latest launch:', error);
      return null;
    }
  }

  // ISS API methods
  async getISSLocation() {
    try {
      return await this.fetchWithTimeout(this.endpoints.iss.location);
    } catch (error) {
      console.error('Error fetching ISS location:', error);
      return null;
    }
  }

  async getISSAstronauts() {
    try {
      return await this.fetchWithTimeout(this.endpoints.iss.astronauts);
    } catch (error) {
      console.error('Error fetching ISS astronauts:', error);
      return null;
    }
  }

  async getISSDetails() {
    try {
      // Return static ISS details since there's no specific API for this
      return {
        altitude: 408,
        orbital_speed: 7.66,
        orbital_period: 92.68
      };
    } catch (error) {
      console.error('Error fetching ISS details:', error);
      return null;
    }
  }

  // NASA API methods
  async getNASAAPOD() {
    try {
      return await this.fetchWithTimeout(this.endpoints.nasa.apod);
    } catch (error) {
      console.error('Error fetching NASA APOD:', error);
      return null;
    }
  }

  // Launch Library API methods
  async getUpcomingLaunches() {
    try {
      return await this.fetchWithTimeout(this.endpoints.launches.upcoming);
    } catch (error) {
      console.error('Error fetching upcoming launches:', error);
      return null;
    }
  }

  async getRecentLaunches() {
    try {
      return await this.fetchWithTimeout(this.endpoints.launches.recent);
    } catch (error) {
      console.error('Error fetching recent launches:', error);
      return null;
    }
  }

  // Earthquake API methods
  async getEarthquakes() {
    try {
      return await this.fetchWithTimeout(this.endpoints.earthquakes.usgs);
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      return null;
    }
  }

  // API status checking
  async checkAPIStatus(endpoint) {
    try {
      const response = await fetch(endpoint, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllAPIStatuses() {
    const statuses = {};
    
    try {
      statuses.spacex = await this.checkAPIStatus(this.endpoints.spacex.company);
      statuses.iss = await this.checkAPIStatus(this.endpoints.iss.location);
      statuses.nasa = await this.checkAPIStatus(this.endpoints.nasa.apod);
      statuses.launches = await this.checkAPIStatus(this.endpoints.launches.upcoming);
      statuses.earthquakes = await this.checkAPIStatus(this.endpoints.earthquakes.usgs);
    } catch (error) {
      console.error('Error checking API statuses:', error);
    }
    
    return statuses;
  }
}

// Create and export singleton instance
export const apiClient = new APIClient();