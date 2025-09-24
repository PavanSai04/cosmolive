// Main application entry point
import { apiClient } from './js/api.js';

class CosmosLiveApp {
  constructor() {
    this.init();
  }

  async init() {
    console.log('🚀 CosmosLive App Initializing...');
    
    // Initialize UI components
    this.setupEventListeners();
    this.updateLastUpdateTime();
    
    // Load initial data
    await this.loadLiveStats();
    await this.loadNavigationTiles();
    await this.loadNASAAPODSection();
    await this.loadMissionsSection();
    await this.loadMainContent();
    await this.setupTestimonialsCarousel();
    
    // Set up periodic updates
    this.setupPeriodicUpdates();
    
    console.log('✅ CosmosLive App Ready!');
  }

  setupEventListeners() {
    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Testimonials carousel functionality
    this.setupTestimonialsCarousel();
  }

  async loadLiveStats() {
    const liveStatsContainer = document.getElementById('liveStats');
    if (!liveStatsContainer) return;

    try {
      // Create stats grid with tile layout
      const statsHTML = `
        <div class="stats-grid">
          <div class="stat-card" onclick="app.showLaunches()">
            <div class="stat-number" id="spacex-launches">4</div>
            <div class="stat-label">SpaceX Launches</div>
          </div>
          <div class="stat-card" onclick="app.showISSTracker()">
            <div class="stat-number" id="iss-astronauts">7</div>
            <div class="stat-label">ISS Astronauts</div>
          </div>
          <div class="stat-card" onclick="app.showEarthquakes()">
            <div class="stat-number" id="earthquake-count">12</div>
            <div class="stat-label">Recent Earthquakes</div>
          </div>
          <div class="stat-card" onclick="app.showSatellites()">
            <div class="stat-number" id="tracked-satellites">2,800+</div>
            <div class="stat-label">Tracked Satellites</div>
          </div>
        </div>
      `;
      
      liveStatsContainer.innerHTML = statsHTML;

      // Load actual data in background
      this.updateStats();
      
    } catch (error) {
      console.error('Error loading live stats:', error);
      liveStatsContainer.innerHTML = '<div class="error">Unable to load live statistics</div>';
    }
  }

  async loadNavigationTiles() {
    const navigationContainer = document.getElementById('navigationTiles');
    if (!navigationContainer) return;

    const navigationHTML = `
      <div class="navigation-grid">
        <div class="nav-tile" onclick="app.showSpaceXAPI()">
          <span class="nav-tile-text">SpaceX API</span>
        </div>
        <div class="nav-tile active" onclick="app.showISSTracker()">
          <span class="nav-tile-text">ISS Tracker</span>
        </div>
        <div class="nav-tile" onclick="app.showNASAAPI()">
          <span class="nav-tile-text">NASA API</span>
        </div>
        <div class="nav-tile" onclick="app.showEarthquakes()">
          <span class="nav-tile-text">Earthquake Data</span>
        </div>
        <div class="nav-tile" onclick="app.showLaunchLibrary()">
          <span class="nav-tile-text">Launch Library</span>
        </div>
      </div>
    `;
    
    navigationContainer.innerHTML = navigationHTML;
  }

  async loadNASAAPODSection() {
    try {
      const apodData = await apiClient.getNASAAPOD();
      
      if (apodData) {
        // Update the NASA APOD image
        const apodImage = document.getElementById('nasa-apod-daily-image');
        const apodTitle = document.getElementById('nasa-apod-daily-title');
        const apodDate = document.getElementById('nasa-apod-daily-date');
        const apodExplanation = document.getElementById('nasa-apod-daily-explanation');
        
        if (apodImage && apodData.url) {
          apodImage.src = apodData.url;
          apodImage.alt = apodData.title || 'NASA Picture of the Day';
          apodImage.onerror = function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA Picture of the Day</text></svg>';
          };
        }
        
        if (apodTitle) {
          apodTitle.textContent = apodData.title || 'NASA Picture of the Day';
        }
        
        if (apodExplanation) {
          apodExplanation.textContent = apodData.explanation || 'No explanation available for this image.';
        }
        
        if (apodDate) {
          apodDate.textContent = apodData.date ? new Date(apodData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'Today';
        }
      } else {
        // Fallback content if API fails
        const apodImage = document.getElementById('nasa-apod-daily-image');
        const apodTitle = document.getElementById('nasa-apod-daily-title');
        const apodDate = document.getElementById('nasa-apod-daily-date');
        const apodExplanation = document.getElementById('nasa-apod-daily-explanation');
        
        if (apodImage) {
          apodImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA Picture of the Day</text></svg>';
          apodImage.alt = 'NASA Picture of the Day - Loading...';
        }
        
        if (apodTitle) {
          apodTitle.textContent = 'NASA Picture of the Day';
        }
        
        if (apodExplanation) {
          apodExplanation.textContent = 'Loading NASA\'s daily astronomy picture and explanation...';
        }
        
        if (apodDate) {
          apodDate.textContent = 'Loading...';
        }
      }
    } catch (error) {
      console.error('Error loading NASA APOD section:', error);
      
      // Set fallback content
      const apodImage = document.getElementById('nasa-apod-daily-image');
      const apodTitle = document.getElementById('nasa-apod-daily-title');
      const apodDate = document.getElementById('nasa-apod-daily-date');
      const apodExplanation = document.getElementById('nasa-apod-daily-explanation');
      
      if (apodImage) {
        apodImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA Picture of the Day</text></svg>';
        apodImage.alt = 'NASA Picture of the Day - Unavailable';
      }
      
      if (apodTitle) {
        apodTitle.textContent = 'NASA Picture of the Day';
      }
      
      if (apodExplanation) {
        apodExplanation.textContent = 'Unable to load NASA\'s daily astronomy picture. Please try again later.';
      }
      
      if (apodDate) {
        apodDate.textContent = 'Unavailable';
      }
    }
  }

  async loadMissionsSection() {
    try {
      const missionsContainer = document.getElementById('missionsGrid');
      const moreMissionsBtn = document.getElementById('moreMissionsBtn');
      
      if (!missionsContainer) return;

      // Initialize missions data
      this.missionsData = [
        {
          id: 1,
          title: "Artemis Program",
          description: "NASA's program to return humans to the Moon and establish a sustainable presence.",
          details: {
            duration: "2022-2025",
            status: "Active",
            crew: "4 astronauts"
          },
          fullDescription: "The Artemis program is NASA's flagship mission to return humans to the Moon by 2025. This ambitious program will establish a sustainable human presence on the lunar surface and serve as a stepping stone for future Mars missions. Artemis includes the Space Launch System (SLS) rocket, Orion spacecraft, and the Gateway lunar outpost."
        },
        {
          id: 2,
          title: "Mars Perseverance",
          description: "Rover mission to search for signs of ancient life and collect samples for return to Earth.",
          details: {
            duration: "2020-2023",
            status: "Active",
            location: "Jezero Crater"
          },
          fullDescription: "The Mars Perseverance rover is exploring Jezero Crater, a site that scientists believe was once flooded with water. The rover is searching for signs of ancient microbial life and collecting rock and soil samples that will be returned to Earth by future missions. It also carries the Ingenuity helicopter, the first aircraft to fly on another planet."
        },
        {
          id: 3,
          title: "James Webb Telescope",
          description: "Next-generation space telescope to observe the universe in infrared light.",
          details: {
            duration: "2021-2030+",
            status: "Active",
            orbit: "L2 Lagrange Point"
          },
          fullDescription: "The James Webb Space Telescope is the most powerful space telescope ever built. It observes the universe in infrared light, allowing scientists to see through dust clouds and study the formation of stars, galaxies, and planetary systems. Webb has already revolutionized our understanding of the early universe and exoplanet atmospheres."
        }
      ];

      this.visibleMissions = 3;
      this.allMissions = [
        ...this.missionsData,
        {
          id: 4,
          title: "Dragonfly Mission",
          description: "Rotary-wing aircraft to explore Saturn's moon Titan.",
          details: {
            duration: "2027-2034",
            status: "Planned",
            target: "Titan"
          },
          fullDescription: "Dragonfly is a planned mission to send a dual-quadcopter to explore Titan, Saturn's largest moon. This innovative spacecraft will fly from location to location, studying Titan's prebiotic chemistry and habitability. Titan's thick atmosphere and low gravity make it an ideal place for rotorcraft exploration."
        },
        {
          id: 5,
          title: "Europa Clipper",
          description: "Mission to investigate Jupiter's moon Europa for signs of life.",
          details: {
            duration: "2024-2030",
            status: "In Development",
            target: "Europa"
          },
          fullDescription: "Europa Clipper will conduct detailed reconnaissance of Jupiter's moon Europa to investigate whether the icy moon could have conditions suitable for life. The mission will study Europa's ice shell, ocean, composition, and geology using a suite of scientific instruments."
        },
        {
          id: 6,
          title: "Psyche Mission",
          description: "Journey to a unique metal asteroid that may be the core of an early planet.",
          details: {
            duration: "2023-2029",
            status: "In Transit",
            target: "16 Psyche"
          },
          fullDescription: "The Psyche mission will explore 16 Psyche, a unique metal asteroid that may be the exposed nickel-iron core of an early planet. This mission will help scientists understand how planets form and what Earth's core might look like. The asteroid is located in the main asteroid belt between Mars and Jupiter."
        }
      ];

      // Load initial missions
      this.renderMissions();

      // Set up "More Missions" button
      if (moreMissionsBtn) {
        moreMissionsBtn.addEventListener('click', () => {
          this.loadMoreMissions();
        });
      }

    } catch (error) {
      console.error('Error loading missions section:', error);
    }
  }

  renderMissions() {
    const missionsContainer = document.getElementById('missionsGrid');
    if (!missionsContainer) return;

    const missionsToShow = this.allMissions.slice(0, this.visibleMissions);
    
    const missionsHTML = missionsToShow.map(mission => `
      <div class="mission-tile" data-mission-id="${mission.id}">
        <div class="mission-tile-title">${mission.title}</div>
        <div class="mission-tile-description">${mission.description}</div>
        <div class="mission-tile-separator"></div>
        <div class="mission-tile-details">
          <p><strong>Duration:</strong> ${mission.details.duration}</p>
          <p><strong>Status:</strong> ${mission.details.status}</p>
          ${mission.details.crew ? `<p><strong>Crew:</strong> ${mission.details.crew}</p>` : ''}
          ${mission.details.location ? `<p><strong>Location:</strong> ${mission.details.location}</p>` : ''}
          ${mission.details.orbit ? `<p><strong>Orbit:</strong> ${mission.details.orbit}</p>` : ''}
          ${mission.details.target ? `<p><strong>Target:</strong> ${mission.details.target}</p>` : ''}
        </div>
        <button class="mission-tile-btn" onclick="app.showMissionDetails(${mission.id})">Learn More</button>
      </div>
    `).join('');

    missionsContainer.innerHTML = missionsHTML;
  }

  loadMoreMissions() {
    const moreMissionsBtn = document.getElementById('moreMissionsBtn');
    
    if (this.visibleMissions < this.allMissions.length) {
      this.visibleMissions = Math.min(this.visibleMissions + 3, this.allMissions.length);
      this.renderMissions();
      
      if (this.visibleMissions >= this.allMissions.length && moreMissionsBtn) {
        moreMissionsBtn.style.display = 'none';
      }
    }
  }

  showMissionDetails(missionId) {
    const mission = this.allMissions.find(m => m.id === missionId);
    if (!mission) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'mission-modal';
    modal.innerHTML = `
      <div class="mission-modal-content">
        <div class="mission-modal-header">
          <h2>${mission.title}</h2>
          <button class="mission-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="mission-modal-body">
          <div class="mission-modal-description">
            <h3>Mission Overview</h3>
            <p>${mission.fullDescription}</p>
          </div>
          <div class="mission-modal-details">
            <h3>Mission Details</h3>
            <div class="mission-details-grid">
              <div class="detail-item">
                <strong>Duration:</strong> ${mission.details.duration}
              </div>
              <div class="detail-item">
                <strong>Status:</strong> ${mission.details.status}
              </div>
              ${mission.details.crew ? `<div class="detail-item"><strong>Crew:</strong> ${mission.details.crew}</div>` : ''}
              ${mission.details.location ? `<div class="detail-item"><strong>Location:</strong> ${mission.details.location}</div>` : ''}
              ${mission.details.orbit ? `<div class="detail-item"><strong>Orbit:</strong> ${mission.details.orbit}</div>` : ''}
              ${mission.details.target ? `<div class="detail-item"><strong>Target:</strong> ${mission.details.target}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
      .mission-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
      }
      .mission-modal-content {
        background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
        border: 1px solid rgba(78, 205, 196, 0.3);
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        backdrop-filter: blur(10px);
        color: white;
      }
      .mission-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(78, 205, 196, 0.3);
        padding-bottom: 1rem;
      }
      .mission-modal-header h2 {
        color: #4ecdc4;
        margin: 0;
      }
      .mission-modal-close {
        background: none;
        border: none;
        color: #4ecdc4;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mission-modal-body h3 {
        color: #4ecdc4;
        margin-bottom: 1rem;
      }
      .mission-modal-description {
        margin-bottom: 2rem;
      }
      .mission-details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      .detail-item {
        background: rgba(78, 205, 196, 0.1);
        padding: 0.8rem;
        border-radius: 8px;
        border: 1px solid rgba(78, 205, 196, 0.2);
      }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        modalStyles.remove();
      }
    });
  }

  async updateStats() {
    try {
      // ISS Astronauts
      try {
        const data = await apiClient.getISSAstronauts();
        if (data && data.number) {
          const issElement = document.getElementById('iss-astronauts');
          if (issElement) {
            issElement.textContent = data.number;
          }
          // Also update the stats in hero section
          const issStatsElement = document.getElementById('iss-astronauts-count');
          if (issStatsElement) {
            issStatsElement.textContent = data.number;
          }
        }
      } catch (error) {
        console.log('ISS API not available, using fallback');
        const issElement = document.getElementById('iss-astronauts');
        if (issElement) {
          issElement.textContent = '7'; // Fallback value
        }
        const issStatsElement = document.getElementById('iss-astronauts-count');
        if (issStatsElement) {
          issStatsElement.textContent = '7';
        }
      }

      // SpaceX Launches
      try {
        const spacexData = await apiClient.getSpaceXRockets();
        if (spacexData && Array.isArray(spacexData)) {
          const spacexElement = document.getElementById('spacex-launches');
          if (spacexElement) {
            spacexElement.textContent = spacexData.length;
          }
          const spacexStatsElement = document.getElementById('spacex-launches-count');
          if (spacexStatsElement) {
            spacexStatsElement.textContent = spacexData.length;
          }
        }
      } catch (error) {
        console.log('SpaceX API not available, using fallback');
        const spacexElement = document.getElementById('spacex-launches');
        if (spacexElement) {
          spacexElement.textContent = '4'; // Fallback value
        }
        const spacexStatsElement = document.getElementById('spacex-launches-count');
        if (spacexStatsElement) {
          spacexStatsElement.textContent = '4';
        }
      }

      // Recent Earthquakes
      try {
        const earthquakeCount = await this.getEarthquakeCount(4.0, 7);
        
        if (earthquakeCount > 0) {
          const earthquakeElement = document.getElementById('earthquake-count');
          if (earthquakeElement) {
            earthquakeElement.textContent = earthquakeCount;
          }
        } else {
          throw new Error('No USGS data');
        }
      } catch (usgsError) {
        console.log('USGS API not available, using fallback');
        try {
          const earthquakeData = await apiClient.getEarthquakes();
          if (earthquakeData && earthquakeData.features) {
            const earthquakeElement = document.getElementById('earthquake-count');
            if (earthquakeElement) {
              earthquakeElement.textContent = earthquakeData.features.length;
            }
          } else {
            throw new Error('No backend data');
          }
        } catch (fallbackError) {
          console.log('Earthquake APIs not available, using fallback');
          const earthquakeElement = document.getElementById('earthquake-count');
          if (earthquakeElement) {
            earthquakeElement.textContent = '12'; // Fallback value
          }
        }
      }

      // Tracked Satellites (static value as shown in image)
      const satellitesElement = document.getElementById('tracked-satellites');
      if (satellitesElement) {
        satellitesElement.textContent = '2,800+';
      }

    } catch (error) {
      console.error('Error updating stats:', error);
      // Set fallback values if everything fails
      const elements = {
        'spacex-launches-count': '4',
        'iss-astronauts': '7',
        'iss-astronauts-count': '7',
        'earthquake-count': '12',
        'tracked-satellites': '2,800+'
      };
      
      Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
        }
      });
    }
  }

  async loadMainContent() {
    // Load data for each section
    await this.loadLiveMissionsData();
    await this.loadISSData();
    await this.loadEarthquakeData();
    await this.loadLaunchData();
    await this.loadImageryData();
  }

  async loadLiveMissionsData() {
    const container = document.getElementById('spacex-company-info');
    if (!container) return;

    try {
      const spacexData = await apiClient.getSpaceXCompany();

      if (spacexData) {
        document.getElementById('spacex-name').textContent = spacexData.name || 'SpaceX';
        document.getElementById('spacex-founded').textContent = spacexData.founded || '2002';
        document.getElementById('spacex-employees').textContent = spacexData.employees || 'N/A';
        document.getElementById('spacex-ceo').textContent = spacexData.ceo || 'Elon Musk';
        document.getElementById('spacex-valuation').textContent = spacexData.valuation ? `$${spacexData.valuation}B` : 'N/A';
      }

      // Load latest launch data
      const latestLaunch = await apiClient.getLatestLaunch();
      if (latestLaunch) {
        document.getElementById('latest-mission-name').textContent = latestLaunch.name || 'N/A';
        document.getElementById('latest-launch-date').textContent = latestLaunch.date_local ? new Date(latestLaunch.date_local).toLocaleDateString() : 'N/A';
        document.getElementById('latest-rocket').textContent = latestLaunch.rocket?.name || 'N/A';
        document.getElementById('latest-launch-status').textContent = latestLaunch.success ? 'Success ✅' : 'Failed ❌';
      }


    } catch (error) {
      console.error('Error loading live missions data:', error);
    }
  }

  async loadISSData() {
    const positionContainer = document.getElementById('iss-position-info');
    const crewContainer = document.getElementById('iss-crew-info');
    if (!positionContainer || !crewContainer) return;

    try {
      const [locationResponse, astronautsResponse, detailsResponse] = await Promise.all([
        apiClient.getISSLocation().catch(() => null),
        apiClient.getISSAstronauts().catch(() => null),
        apiClient.getISSDetails().catch(() => null)
      ]);


      // ISS Location and Details
      if (locationResponse && locationResponse.iss_position) {
        const lat = parseFloat(locationResponse.iss_position.latitude).toFixed(4);
        const lon = parseFloat(locationResponse.iss_position.longitude).toFixed(4);
        const timestamp = new Date(locationResponse.timestamp * 1000).toLocaleString();
        
        document.getElementById('iss-status').textContent = 'Currently in orbit';
        document.getElementById('iss-latitude').textContent = `${lat}°`;
        document.getElementById('iss-longitude').textContent = `${lon}°`;
        document.getElementById('iss-altitude').textContent = `${detailsResponse?.altitude || '408'} km`;
        document.getElementById('iss-velocity').textContent = `${detailsResponse?.orbital_speed || '7.66'} km/s`;
        document.getElementById('iss-timestamp').textContent = timestamp;
      }

      // ISS Astronauts
      if (astronautsResponse && astronautsResponse.people) {
        const issCrew = astronautsResponse.people.filter(person => person.craft === 'ISS');
        
        document.getElementById('iss-crew-count').textContent = `${astronautsResponse.number}`;
        
        const crewListHTML = issCrew.map(person => 
          `<div class="crew-member"><strong>${person.name}</strong> - ${person.craft}</div>`
        ).join('');
        
        document.getElementById('crew-list').innerHTML = crewListHTML || 'Loading crew information...';
      }


    } catch (error) {
      console.error('Error loading ISS data:', error);
      // Set fallback values
      document.getElementById('iss-status').textContent = 'Currently in orbit';
      document.getElementById('iss-crew-count').textContent = '7';
      document.getElementById('crew-list').innerHTML = 'Unable to load crew information';
    }
  }

  async loadEarthquakeData() {
    const infoContainer = document.getElementById('earthquake-info');
    const listContainer = document.getElementById('recent-earthquakes-list');
    if (!infoContainer || !listContainer) return;

    try {
      const earthquakeData = await this.getRecentEarthquakes(4.0, 10);
      
      if (earthquakeData && earthquakeData.features) {
        const recentEarthquakes = earthquakeData.features.slice(0, 5);
        
        // Update earthquake info
        document.getElementById('earthquake-total-count').textContent = earthquakeData.features.length;
        document.getElementById('earthquake-last-update').textContent = new Date().toLocaleString();
        
        // Update earthquake list
        let listHTML = '';
        recentEarthquakes.forEach(quake => {
          const magnitude = quake.properties.mag || 'N/A';
          const place = quake.properties.place || 'Unknown location';
          const time = new Date(quake.properties.time).toLocaleString();
          const depth = quake.geometry.coordinates[2] || 'N/A';
          
          listHTML += `
            <div class="earthquake-item">
              <div class="earthquake-magnitude">M${magnitude}</div>
              <div class="earthquake-details">
                <div class="earthquake-location">${place}</div>
                <div class="earthquake-time">${time}</div>
                <div class="earthquake-depth">Depth: ${depth} km</div>
              </div>
            </div>
          `;
        });
        
        document.getElementById('earthquake-list').innerHTML = listHTML;
      } else {
        // Fallback
        try {
          const backendData = await apiClient.getEarthquakes();
          if (backendData && backendData.features) {
            const recentEarthquakes = backendData.features.slice(0, 5);
            
            document.getElementById('earthquake-total-count').textContent = backendData.features.length;
            document.getElementById('earthquake-last-update').textContent = new Date().toLocaleString();
            
            let listHTML = '';
            recentEarthquakes.forEach(quake => {
              const magnitude = quake.properties.mag;
              const place = quake.properties.place;
              const time = new Date(quake.properties.time).toLocaleString();
              
              listHTML += `
                <div class="earthquake-item">
                  <div class="earthquake-magnitude">M${magnitude}</div>
                  <div class="earthquake-details">
                    <div class="earthquake-location">${place}</div>
                    <div class="earthquake-time">${time}</div>
                    <div class="earthquake-depth">Depth: ${quake.geometry.coordinates[2]} km</div>
                  </div>
                </div>
              `;
            });
            
            document.getElementById('earthquake-list').innerHTML = listHTML;
          } else {
            throw new Error('No earthquake data available');
          }
        } catch (backendError) {
          throw new Error('Both USGS and backend APIs failed');
        }
      }

    } catch (error) {
      console.error('Error loading earthquake data:', error);
      document.getElementById('earthquake-total-count').textContent = 'N/A';
      document.getElementById('earthquake-last-update').textContent = 'Unable to load';
      document.getElementById('earthquake-list').innerHTML = 'Unable to load recent earthquake data';
    }
  }

  async loadLaunchData() {
    const upcomingContainer = document.getElementById('upcoming-launches-info');
    const statsContainer = document.getElementById('launch-stats-info');
    if (!upcomingContainer || !statsContainer) return;

    try {
      const [upcomingLaunches, latestLaunch] = await Promise.all([
        apiClient.getUpcomingLaunches(),
        apiClient.getLatestLaunch()
      ]);

      if (upcomingLaunches && upcomingLaunches.results) {
        const nextLaunch = upcomingLaunches.results[0];
        if (nextLaunch) {
          document.getElementById('next-launch-name').textContent = nextLaunch.name || 'N/A';
          document.getElementById('next-launch-provider').textContent = nextLaunch.launch_service_provider?.name || 'N/A';
          document.getElementById('next-launch-date').textContent = new Date(nextLaunch.net).toLocaleDateString();
          document.getElementById('next-launch-status').textContent = nextLaunch.status?.name || 'N/A';
        }
        
        // Update launch statistics
        const currentYear = new Date().getFullYear();
        document.getElementById('launch-year').textContent = currentYear;
        document.getElementById('launch-upcoming-count').textContent = upcomingLaunches.count || upcomingLaunches.results.length;
        document.getElementById('launch-total-count').textContent = upcomingLaunches.count || 'N/A';
      }


    } catch (error) {
      console.error('Error loading launch data:', error);
      document.getElementById('next-launch-name').textContent = 'N/A';
      document.getElementById('next-launch-provider').textContent = 'N/A';
      document.getElementById('next-launch-date').textContent = 'N/A';
      document.getElementById('next-launch-status').textContent = 'N/A';
    }
  }

  async loadImageryData() {
    const infoContainer = document.getElementById('nasa-apod-info');
    const imageContainer = document.getElementById('nasa-apod-image');
    if (!infoContainer || !imageContainer) return;

    try {
      const apodData = await apiClient.getNASAAPOD();
      
      if (apodData) {
        document.getElementById('apod-title').textContent = apodData.title || 'N/A';
        document.getElementById('apod-date').textContent = apodData.date || 'N/A';
        document.getElementById('apod-copyright').textContent = apodData.copyright || 'NASA';
        document.getElementById('apod-explanation').textContent = apodData.explanation ? 
          (apodData.explanation.length > 200 ? apodData.explanation.substring(0, 200) + '...' : apodData.explanation) : 'N/A';
        
        if (apodData.url) {
          const img = document.getElementById('apod-image');
          img.src = apodData.url;
          img.alt = apodData.title || 'NASA APOD';
          img.onerror = function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA APOD Image</text></svg>';
          };
        }
      } else {
        document.getElementById('apod-title').textContent = 'N/A';
        document.getElementById('apod-date').textContent = 'N/A';
        document.getElementById('apod-copyright').textContent = 'N/A';
        document.getElementById('apod-explanation').textContent = 'Unable to load NASA imagery';
      }

    } catch (error) {
      console.error('Error loading imagery data:', error);
      document.getElementById('apod-title').textContent = 'Error';
      document.getElementById('apod-date').textContent = 'Error';
      document.getElementById('apod-copyright').textContent = 'Error';
      document.getElementById('apod-explanation').textContent = 'Error loading NASA imagery';
    }
  }

  setupPeriodicUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
      this.updateStats();
    }, 30000);

    // Update ISS data every 10 seconds
    setInterval(() => {
      this.loadISSData();
    }, 10000);

    // Update earthquake data every 5 minutes
    setInterval(() => {
      this.loadEarthquakeData();
    }, 300000);

    // Update NASA APOD section daily (check every hour)
    setInterval(() => {
      this.loadNASAAPODSection();
    }, 3600000);
  }

  updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
      lastUpdateElement.textContent = new Date().toLocaleString();
    }
  }

  // Public methods for navigation
  showISSTracker() {
    document.getElementById('iss').scrollIntoView({ behavior: 'smooth' });
  }

  showEarthquakes() {
    document.getElementById('earthquakes').scrollIntoView({ behavior: 'smooth' });
  }

  showLaunches() {
    document.getElementById('launches').scrollIntoView({ behavior: 'smooth' });
  }

  showMissions() {
    document.getElementById('missions').scrollIntoView({ behavior: 'smooth' });
  }

  showNASAImagery() {
    document.getElementById('imagery').scrollIntoView({ behavior: 'smooth' });
  }

  showSpaceXAPI() {
    document.getElementById('launches').scrollIntoView({ behavior: 'smooth' });
  }

  showNASAAPI() {
    document.getElementById('nasa-apod').scrollIntoView({ behavior: 'smooth' });
  }

  showLaunchLibrary() {
    document.getElementById('launches').scrollIntoView({ behavior: 'smooth' });
  }

  showSatellites() {
    // For now, scroll to ISS tracker as it's related
    document.getElementById('iss').scrollIntoView({ behavior: 'smooth' });
  }

  setupTestimonialsCarousel() {
    // Initialize carousel data structure
    this.carousel = {
      currentSlide: 0,
      autoSlideInterval: null,
      isAutoPlaying: true
    };

    const paginationDots = document.querySelectorAll('.pagination-dot');
    const slides = document.querySelectorAll('.testimonial-slide');
    const slider = document.querySelector('.testimonials-slider');
    const testimonialsSection = document.querySelector('.testimonials-section');
    
    if (!slides.length || !paginationDots.length || !slider) {
      console.warn("No slides, dots, or slider found for carousel.");
      return;
    }

    // Show a specific slide
    const showSlide = (slideIndex) => {
      // Ensure slideIndex is within bounds
      const validIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
      
      slider.style.transform = `translateX(-${validIndex * 100}%)`;
      
      // Update pagination dots
      paginationDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === validIndex);
      });
      
      this.carousel.currentSlide = validIndex;
    };

    // Navigation functions
    const nextSlide = () => {
      const nextIndex = (this.carousel.currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = this.carousel.currentSlide === 0 ? slides.length - 1 : this.carousel.currentSlide - 1;
      showSlide(prevIndex);
    };

    // Auto-sliding functions
    const startAutoSlide = () => {
      if (this.carousel.autoSlideInterval) {
        clearInterval(this.carousel.autoSlideInterval);
      }
      this.carousel.autoSlideInterval = setInterval(nextSlide, 5000);
      this.carousel.isAutoPlaying = true;
    };

    const stopAutoSlide = () => {
      if (this.carousel.autoSlideInterval) {
        clearInterval(this.carousel.autoSlideInterval);
        this.carousel.autoSlideInterval = null;
      }
      this.carousel.isAutoPlaying = false;
    };

    // Pagination dot click handlers
    paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        // Restart auto-slide after manual interaction
        if (this.carousel.isAutoPlaying) {
          startAutoSlide();
        }
      });
    });

    // Hover pause/resume
    if (testimonialsSection) {
      testimonialsSection.addEventListener('mouseenter', () => {
        if (this.carousel.isAutoPlaying) {
          stopAutoSlide();
        }
      });
      
      testimonialsSection.addEventListener('mouseleave', () => {
        startAutoSlide();
      });
    }

    // Touch/swipe support
    if (testimonialsSection) {
      let startX = 0;
      let startY = 0;
      let isSwipeMove = false;

      testimonialsSection.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipeMove = false;
      }, { passive: true });

      testimonialsSection.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // If horizontal swipe is more significant than vertical
        if (diffX > diffY && diffX > 10) {
          isSwipeMove = true;
          e.preventDefault(); // Prevent scrolling
        }
      }, { passive: false });

      testimonialsSection.addEventListener('touchend', (e) => {
        if (!startX || !isSwipeMove) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          
          // Restart auto-slide after swipe
          if (this.carousel.isAutoPlaying) {
            startAutoSlide();
          }
        }
        
        // Reset
        startX = 0;
        startY = 0;
        isSwipeMove = false;
      }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle keys when testimonials section is visible
      if (!testimonialsSection) return;
      
      const rect = testimonialsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          if (this.carousel.isAutoPlaying) {
            startAutoSlide();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          if (this.carousel.isAutoPlaying) {
            startAutoSlide();
          }
          break;
        case ' ': // Space bar to pause/resume
          e.preventDefault();
          if (this.carousel.isAutoPlaying) {
            stopAutoSlide();
          } else {
            startAutoSlide();
          }
          break;
      }
    });

    // Initialize first slide and start auto-slide
    showSlide(0);
    startAutoSlide();

    // Store references for potential cleanup
    this.carousel.showSlide = showSlide;
    this.carousel.nextSlide = nextSlide;
    this.carousel.prevSlide = prevSlide;
    this.carousel.startAutoSlide = startAutoSlide;
    this.carousel.stopAutoSlide = stopAutoSlide;
  }

  // USGS Earthquake API utility methods
  async getRecentEarthquakes(minMagnitude = 4.0, limit = 10) {
    try {
      const today = new Date();
      const startDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)); // Last 7 days
      
      const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate.toISOString().split('T')[0]}&endtime=${today.toISOString().split('T')[0]}&minmagnitude=${minMagnitude}&limit=${limit}`;
      
      const response = await fetch(usgsUrl);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching recent earthquakes:', error);
      throw error;
    }
  }

  async getEarthquakeCount(minMagnitude = 4.0, days = 7) {
    try {
      const today = new Date();
      const startDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
      
      const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson&starttime=${startDate.toISOString().split('T')[0]}&endtime=${today.toISOString().split('T')[0]}&minmagnitude=${minMagnitude}`;
      
      const response = await fetch(usgsUrl);
      const data = await response.json();
      
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching earthquake count:', error);
      return 0;
    }
  }

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CosmosLiveApp();
});

// Export for potential module usage
export default CosmosLiveApp;
