(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();class E{constructor(){this.baseURL="",this.endpoints={spacex:{company:"https://api.spacexdata.com/v4/company",launches:"https://api.spacexdata.com/v4/launches",rockets:"https://api.spacexdata.com/v4/rockets"},iss:{location:"/api/iss-now",astronauts:"/api/astros"},nasa:{apod:"https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo"},launches:{upcoming:"https://ll.thespacedevs.com/2.2.0/launch/upcoming/",recent:"https://ll.thespacedevs.com/2.2.0/launch/previous/"},earthquakes:{usgs:"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&minmagnitude=4.0&limit=10"}}}async fetchWithTimeout(n,a={},e=1e4){const t=new AbortController,s=setTimeout(()=>t.abort(),e);try{const o=await fetch(n,{...a,signal:t.signal});if(clearTimeout(s),!o.ok)throw new Error(`HTTP error! status: ${o.status}`);return await o.json()}catch(o){throw clearTimeout(s),o.name==="AbortError"?new Error("Request timeout"):o}}async getSpaceXCompany(){try{return await this.fetchWithTimeout(this.endpoints.spacex.company)}catch(n){return console.error("Error fetching SpaceX company data:",n),null}}async getSpaceXLaunches(){try{return await this.fetchWithTimeout(this.endpoints.spacex.launches)}catch(n){return console.error("Error fetching SpaceX launches:",n),null}}async getSpaceXRockets(){try{return await this.fetchWithTimeout(this.endpoints.spacex.rockets)}catch(n){return console.error("Error fetching SpaceX rockets:",n),null}}async getLatestLaunch(){try{const n=await this.getSpaceXLaunches();return n&&n.length>0?n[n.length-1]:null}catch(n){return console.error("Error fetching latest launch:",n),null}}async getISSLocation(){try{return await this.fetchWithTimeout(this.endpoints.iss.location,{},2e4)}catch(n){return console.error("Error fetching ISS location:",n),null}}async getISSAstronauts(){try{return await this.fetchWithTimeout(this.endpoints.iss.astronauts,{},2e4)}catch(n){return console.error("Error fetching ISS astronauts:",n),null}}async getISSDetails(){try{return{altitude:408,orbital_speed:7.66,orbital_period:92.68}}catch(n){return console.error("Error fetching ISS details:",n),null}}async getNASAAPOD(){try{return await this.fetchWithTimeout(this.endpoints.nasa.apod)}catch(n){return console.error("Error fetching NASA APOD:",n),null}}async getUpcomingLaunches(){try{return await this.fetchWithTimeout(this.endpoints.launches.upcoming)}catch(n){return console.error("Error fetching upcoming launches:",n),null}}async getRecentLaunches(){try{return await this.fetchWithTimeout(this.endpoints.launches.recent)}catch(n){return console.error("Error fetching recent launches:",n),null}}async getEarthquakes(){try{return await this.fetchWithTimeout(this.endpoints.earthquakes.usgs)}catch(n){return console.error("Error fetching earthquake data:",n),null}}async checkAPIStatus(n){try{const a=await fetch(n,{method:"HEAD",mode:"no-cors"});return!0}catch{return!1}}async getAllAPIStatuses(){const n={};try{n.spacex=await this.checkAPIStatus(this.endpoints.spacex.company),n.iss=await this.checkAPIStatus(this.endpoints.iss.location),n.nasa=await this.checkAPIStatus(this.endpoints.nasa.apod),n.launches=await this.checkAPIStatus(this.endpoints.launches.upcoming),n.earthquakes=await this.checkAPIStatus(this.endpoints.earthquakes.usgs)}catch(a){console.error("Error checking API statuses:",a)}return n}}const d=new E;class w{constructor(){this.init()}async init(){console.log("🚀 CosmosLive App Initializing..."),this.setupEventListeners(),this.updateLastUpdateTime(),await this.loadLiveStats(),await this.loadNavigationTiles(),await this.loadNASAAPODSection(),await this.loadMissionsSection(),await this.loadMainContent(),await this.setupTestimonialsCarousel(),this.setupPeriodicUpdates(),console.log("✅ CosmosLive App Ready!")}setupEventListeners(){const n=document.getElementById("hamburger"),a=document.querySelector(".nav-links");n&&a&&n.addEventListener("click",()=>{a.classList.toggle("active"),n.classList.toggle("active")}),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(t){t.preventDefault();const s=document.querySelector(this.getAttribute("href"));s&&s.scrollIntoView({behavior:"smooth",block:"start"})})}),this.setupTestimonialsCarousel()}async loadLiveStats(){const n=document.getElementById("liveStats");if(n)try{const a=`
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
      `;n.innerHTML=a,this.updateStats()}catch(a){console.error("Error loading live stats:",a),n.innerHTML='<div class="error">Unable to load live statistics</div>'}}async loadNavigationTiles(){const n=document.getElementById("navigationTiles");if(!n)return;const a=`
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
    `;n.innerHTML=a}async loadNASAAPODSection(){try{const n=await d.getNASAAPOD();if(n){const a=document.getElementById("nasa-apod-daily-image"),e=document.getElementById("nasa-apod-daily-title"),t=document.getElementById("nasa-apod-daily-date"),s=document.getElementById("nasa-apod-daily-explanation");a&&n.url&&(a.src=n.url,a.alt=n.title||"NASA Picture of the Day",a.onerror=function(){this.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA Picture of the Day</text></svg>'}),e&&(e.textContent=n.title||"NASA Picture of the Day"),s&&(s.textContent=n.explanation||"No explanation available for this image."),t&&(t.textContent=n.date?new Date(n.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"Today")}else{const a=document.getElementById("nasa-apod-daily-image"),e=document.getElementById("nasa-apod-daily-title"),t=document.getElementById("nasa-apod-daily-date"),s=document.getElementById("nasa-apod-daily-explanation");a&&(a.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA Picture of the Day</text></svg>',a.alt="NASA Picture of the Day - Loading..."),e&&(e.textContent="NASA Picture of the Day"),s&&(s.textContent="Loading NASA's daily astronomy picture and explanation..."),t&&(t.textContent="Loading...")}}catch(n){console.error("Error loading NASA APOD section:",n);const a=document.getElementById("nasa-apod-daily-image"),e=document.getElementById("nasa-apod-daily-title"),t=document.getElementById("nasa-apod-daily-date"),s=document.getElementById("nasa-apod-daily-explanation");a&&(a.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA Picture of the Day</text></svg>',a.alt="NASA Picture of the Day - Unavailable"),e&&(e.textContent="NASA Picture of the Day"),s&&(s.textContent="Unable to load NASA's daily astronomy picture. Please try again later."),t&&(t.textContent="Unavailable")}}async loadMissionsSection(){try{const n=document.getElementById("missionsGrid"),a=document.getElementById("moreMissionsBtn");if(!n)return;this.missionsData=[{id:1,title:"Artemis Program",description:"NASA's program to return humans to the Moon and establish a sustainable presence.",details:{duration:"2022-2025",status:"Active",crew:"4 astronauts"},fullDescription:"The Artemis program is NASA's flagship mission to return humans to the Moon by 2025. This ambitious program will establish a sustainable human presence on the lunar surface and serve as a stepping stone for future Mars missions. Artemis includes the Space Launch System (SLS) rocket, Orion spacecraft, and the Gateway lunar outpost."},{id:2,title:"Mars Perseverance",description:"Rover mission to search for signs of ancient life and collect samples for return to Earth.",details:{duration:"2020-2023",status:"Active",location:"Jezero Crater"},fullDescription:"The Mars Perseverance rover is exploring Jezero Crater, a site that scientists believe was once flooded with water. The rover is searching for signs of ancient microbial life and collecting rock and soil samples that will be returned to Earth by future missions. It also carries the Ingenuity helicopter, the first aircraft to fly on another planet."},{id:3,title:"James Webb Telescope",description:"Next-generation space telescope to observe the universe in infrared light.",details:{duration:"2021-2030+",status:"Active",orbit:"L2 Lagrange Point"},fullDescription:"The James Webb Space Telescope is the most powerful space telescope ever built. It observes the universe in infrared light, allowing scientists to see through dust clouds and study the formation of stars, galaxies, and planetary systems. Webb has already revolutionized our understanding of the early universe and exoplanet atmospheres."}],this.visibleMissions=3,this.allMissions=[...this.missionsData,{id:4,title:"Dragonfly Mission",description:"Rotary-wing aircraft to explore Saturn's moon Titan.",details:{duration:"2027-2034",status:"Planned",target:"Titan"},fullDescription:"Dragonfly is a planned mission to send a dual-quadcopter to explore Titan, Saturn's largest moon. This innovative spacecraft will fly from location to location, studying Titan's prebiotic chemistry and habitability. Titan's thick atmosphere and low gravity make it an ideal place for rotorcraft exploration."},{id:5,title:"Europa Clipper",description:"Mission to investigate Jupiter's moon Europa for signs of life.",details:{duration:"2024-2030",status:"In Development",target:"Europa"},fullDescription:"Europa Clipper will conduct detailed reconnaissance of Jupiter's moon Europa to investigate whether the icy moon could have conditions suitable for life. The mission will study Europa's ice shell, ocean, composition, and geology using a suite of scientific instruments."},{id:6,title:"Psyche Mission",description:"Journey to a unique metal asteroid that may be the core of an early planet.",details:{duration:"2023-2029",status:"In Transit",target:"16 Psyche"},fullDescription:"The Psyche mission will explore 16 Psyche, a unique metal asteroid that may be the exposed nickel-iron core of an early planet. This mission will help scientists understand how planets form and what Earth's core might look like. The asteroid is located in the main asteroid belt between Mars and Jupiter."}],this.renderMissions(),a&&a.addEventListener("click",()=>{this.loadMoreMissions()})}catch(n){console.error("Error loading missions section:",n)}}renderMissions(){const n=document.getElementById("missionsGrid");if(!n)return;const e=this.allMissions.slice(0,this.visibleMissions).map(t=>`
      <div class="mission-tile" data-mission-id="${t.id}">
        <div class="mission-tile-title">${t.title}</div>
        <div class="mission-tile-description">${t.description}</div>
        <div class="mission-tile-separator"></div>
        <div class="mission-tile-details">
          <p><strong>Duration:</strong> ${t.details.duration}</p>
          <p><strong>Status:</strong> ${t.details.status}</p>
          ${t.details.crew?`<p><strong>Crew:</strong> ${t.details.crew}</p>`:""}
          ${t.details.location?`<p><strong>Location:</strong> ${t.details.location}</p>`:""}
          ${t.details.orbit?`<p><strong>Orbit:</strong> ${t.details.orbit}</p>`:""}
          ${t.details.target?`<p><strong>Target:</strong> ${t.details.target}</p>`:""}
        </div>
        <button class="mission-tile-btn" onclick="app.showMissionDetails(${t.id})">Learn More</button>
      </div>
    `).join("");n.innerHTML=e}loadMoreMissions(){const n=document.getElementById("moreMissionsBtn");this.visibleMissions<this.allMissions.length&&(this.visibleMissions=Math.min(this.visibleMissions+3,this.allMissions.length),this.renderMissions(),this.visibleMissions>=this.allMissions.length&&n&&(n.style.display="none"))}showMissionDetails(n){const a=this.allMissions.find(s=>s.id===n);if(!a)return;const e=document.createElement("div");e.className="mission-modal",e.innerHTML=`
      <div class="mission-modal-content">
        <div class="mission-modal-header">
          <h2>${a.title}</h2>
          <button class="mission-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="mission-modal-body">
          <div class="mission-modal-description">
            <h3>Mission Overview</h3>
            <p>${a.fullDescription}</p>
          </div>
          <div class="mission-modal-details">
            <h3>Mission Details</h3>
            <div class="mission-details-grid">
              <div class="detail-item">
                <strong>Duration:</strong> ${a.details.duration}
              </div>
              <div class="detail-item">
                <strong>Status:</strong> ${a.details.status}
              </div>
              ${a.details.crew?`<div class="detail-item"><strong>Crew:</strong> ${a.details.crew}</div>`:""}
              ${a.details.location?`<div class="detail-item"><strong>Location:</strong> ${a.details.location}</div>`:""}
              ${a.details.orbit?`<div class="detail-item"><strong>Orbit:</strong> ${a.details.orbit}</div>`:""}
              ${a.details.target?`<div class="detail-item"><strong>Target:</strong> ${a.details.target}</div>`:""}
            </div>
          </div>
        </div>
      </div>
    `;const t=document.createElement("style");t.textContent=`
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
    `,document.head.appendChild(t),document.body.appendChild(e),e.addEventListener("click",s=>{s.target===e&&(e.remove(),t.remove())})}async updateStats(){try{try{const a=await d.getISSAstronauts();if(a&&a.number){const e=document.getElementById("iss-astronauts");e&&(e.textContent=a.number);const t=document.getElementById("iss-astronauts-count");t&&(t.textContent=a.number)}}catch{console.log("ISS API not available, using fallback");const e=document.getElementById("iss-astronauts");e&&(e.textContent="7");const t=document.getElementById("iss-astronauts-count");t&&(t.textContent="7")}try{const a=await d.getSpaceXRockets();if(a&&Array.isArray(a)){const e=document.getElementById("spacex-launches");e&&(e.textContent=a.length);const t=document.getElementById("spacex-launches-count");t&&(t.textContent=a.length)}}catch{console.log("SpaceX API not available, using fallback");const e=document.getElementById("spacex-launches");e&&(e.textContent="4");const t=document.getElementById("spacex-launches-count");t&&(t.textContent="4")}try{const a=await this.getEarthquakeCount(4,7);if(a>0){const e=document.getElementById("earthquake-count");e&&(e.textContent=a)}else throw new Error("No USGS data")}catch{console.log("USGS API not available, using fallback");try{const e=await d.getEarthquakes();if(e&&e.features){const t=document.getElementById("earthquake-count");t&&(t.textContent=e.features.length)}else throw new Error("No backend data")}catch{console.log("Earthquake APIs not available, using fallback");const t=document.getElementById("earthquake-count");t&&(t.textContent="12")}}const n=document.getElementById("tracked-satellites");n&&(n.textContent="2,800+")}catch(n){console.error("Error updating stats:",n),Object.entries({"spacex-launches-count":"4","iss-astronauts":"7","iss-astronauts-count":"7","earthquake-count":"12","tracked-satellites":"2,800+"}).forEach(([e,t])=>{const s=document.getElementById(e);s&&(s.textContent=t)})}}async loadMainContent(){await this.loadLiveMissionsData(),await this.loadISSData(),await this.loadEarthquakeData(),await this.loadLaunchData(),await this.loadImageryData()}async loadLiveMissionsData(){var a;if(document.getElementById("spacex-company-info"))try{const e=await d.getSpaceXCompany();e&&(document.getElementById("spacex-name").textContent=e.name||"SpaceX",document.getElementById("spacex-founded").textContent=e.founded||"2002",document.getElementById("spacex-employees").textContent=e.employees||"N/A",document.getElementById("spacex-ceo").textContent=e.ceo||"Elon Musk",document.getElementById("spacex-valuation").textContent=e.valuation?`$${e.valuation}B`:"N/A");const t=await d.getLatestLaunch();t&&(document.getElementById("latest-mission-name").textContent=t.name||"N/A",document.getElementById("latest-launch-date").textContent=t.date_local?new Date(t.date_local).toLocaleDateString():"N/A",document.getElementById("latest-rocket").textContent=((a=t.rocket)==null?void 0:a.name)||"N/A",document.getElementById("latest-launch-status").textContent=t.success?"Success ✅":"Failed ❌")}catch(e){console.error("Error loading live missions data:",e)}}async loadISSData(){const n=document.getElementById("iss-position-info"),a=document.getElementById("iss-crew-info");if(!(!n||!a))try{const[e,t,s]=await Promise.all([d.getISSLocation().catch(()=>null),d.getISSAstronauts().catch(()=>null),d.getISSDetails().catch(()=>null)]);if(e&&e.iss_position){const o=parseFloat(e.iss_position.latitude).toFixed(4),r=parseFloat(e.iss_position.longitude).toFixed(4),l=new Date(e.timestamp*1e3).toLocaleString();document.getElementById("iss-status").textContent="Currently in orbit",document.getElementById("iss-latitude").textContent=`${o}°`,document.getElementById("iss-longitude").textContent=`${r}°`,document.getElementById("iss-altitude").textContent=`${(s==null?void 0:s.altitude)||"408"} km`,document.getElementById("iss-velocity").textContent=`${(s==null?void 0:s.orbital_speed)||"7.66"} km/s`,document.getElementById("iss-timestamp").textContent=l}if(t&&t.people){const o=t.people.filter(l=>l.craft==="ISS");document.getElementById("iss-crew-count").textContent=`${t.number}`;const r=o.map(l=>`<div class="crew-member"><strong>${l.name}</strong> - ${l.craft}</div>`).join("");document.getElementById("crew-list").innerHTML=r||"Loading crew information..."}}catch(e){console.error("Error loading ISS data:",e),document.getElementById("iss-status").textContent="Currently in orbit",document.getElementById("iss-crew-count").textContent="7",document.getElementById("crew-list").innerHTML="Unable to load crew information"}}async loadEarthquakeData(){const n=document.getElementById("earthquake-info"),a=document.getElementById("recent-earthquakes-list");if(!(!n||!a))try{const e=await this.getRecentEarthquakes(4,10);if(e&&e.features){const t=e.features.slice(0,5);document.getElementById("earthquake-total-count").textContent=e.features.length,document.getElementById("earthquake-last-update").textContent=new Date().toLocaleString();let s="";t.forEach(o=>{const r=o.properties.mag||"N/A",l=o.properties.place||"Unknown location",m=new Date(o.properties.time).toLocaleString(),i=o.geometry.coordinates[2]||"N/A";s+=`
            <div class="earthquake-item">
              <div class="earthquake-magnitude">M${r}</div>
              <div class="earthquake-details">
                <div class="earthquake-location">${l}</div>
                <div class="earthquake-time">${m}</div>
                <div class="earthquake-depth">Depth: ${i} km</div>
              </div>
            </div>
          `}),document.getElementById("earthquake-list").innerHTML=s}else try{const t=await d.getEarthquakes();if(t&&t.features){const s=t.features.slice(0,5);document.getElementById("earthquake-total-count").textContent=t.features.length,document.getElementById("earthquake-last-update").textContent=new Date().toLocaleString();let o="";s.forEach(r=>{const l=r.properties.mag,m=r.properties.place,i=new Date(r.properties.time).toLocaleString();o+=`
                <div class="earthquake-item">
                  <div class="earthquake-magnitude">M${l}</div>
                  <div class="earthquake-details">
                    <div class="earthquake-location">${m}</div>
                    <div class="earthquake-time">${i}</div>
                    <div class="earthquake-depth">Depth: ${r.geometry.coordinates[2]} km</div>
                  </div>
                </div>
              `}),document.getElementById("earthquake-list").innerHTML=o}else throw new Error("No earthquake data available")}catch{throw new Error("Both USGS and backend APIs failed")}}catch(e){console.error("Error loading earthquake data:",e),document.getElementById("earthquake-total-count").textContent="N/A",document.getElementById("earthquake-last-update").textContent="Unable to load",document.getElementById("earthquake-list").innerHTML="Unable to load recent earthquake data"}}async loadLaunchData(){var e,t;const n=document.getElementById("upcoming-launches-info"),a=document.getElementById("launch-stats-info");if(!(!n||!a))try{const[s,o]=await Promise.all([d.getUpcomingLaunches(),d.getLatestLaunch()]);if(s&&s.results){const r=s.results[0];r&&(document.getElementById("next-launch-name").textContent=r.name||"N/A",document.getElementById("next-launch-provider").textContent=((e=r.launch_service_provider)==null?void 0:e.name)||"N/A",document.getElementById("next-launch-date").textContent=new Date(r.net).toLocaleDateString(),document.getElementById("next-launch-status").textContent=((t=r.status)==null?void 0:t.name)||"N/A");const l=new Date().getFullYear();document.getElementById("launch-year").textContent=l,document.getElementById("launch-upcoming-count").textContent=s.count||s.results.length,document.getElementById("launch-total-count").textContent=s.count||"N/A"}}catch(s){console.error("Error loading launch data:",s),document.getElementById("next-launch-name").textContent="N/A",document.getElementById("next-launch-provider").textContent="N/A",document.getElementById("next-launch-date").textContent="N/A",document.getElementById("next-launch-status").textContent="N/A"}}async loadImageryData(){const n=document.getElementById("nasa-apod-info"),a=document.getElementById("nasa-apod-image");if(!(!n||!a))try{const e=await d.getNASAAPOD();if(e){if(document.getElementById("apod-title").textContent=e.title||"N/A",document.getElementById("apod-date").textContent=e.date||"N/A",document.getElementById("apod-copyright").textContent=e.copyright||"NASA",document.getElementById("apod-explanation").textContent=e.explanation?e.explanation.length>200?e.explanation.substring(0,200)+"...":e.explanation:"N/A",e.url){const t=document.getElementById("apod-image");t.src=e.url,t.alt=e.title||"NASA APOD",t.onerror=function(){this.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">NASA APOD Image</text></svg>'}}}else document.getElementById("apod-title").textContent="N/A",document.getElementById("apod-date").textContent="N/A",document.getElementById("apod-copyright").textContent="N/A",document.getElementById("apod-explanation").textContent="Unable to load NASA imagery"}catch(e){console.error("Error loading imagery data:",e),document.getElementById("apod-title").textContent="Error",document.getElementById("apod-date").textContent="Error",document.getElementById("apod-copyright").textContent="Error",document.getElementById("apod-explanation").textContent="Error loading NASA imagery"}}setupPeriodicUpdates(){setInterval(()=>{this.updateStats()},3e4),setInterval(()=>{this.loadISSData()},1e4),setInterval(()=>{this.loadEarthquakeData()},3e5),setInterval(()=>{this.loadNASAAPODSection()},36e5)}updateLastUpdateTime(){const n=document.getElementById("lastUpdate");n&&(n.textContent=new Date().toLocaleString())}showISSTracker(){document.getElementById("iss").scrollIntoView({behavior:"smooth"})}showEarthquakes(){document.getElementById("earthquakes").scrollIntoView({behavior:"smooth"})}showLaunches(){document.getElementById("launches").scrollIntoView({behavior:"smooth"})}showMissions(){document.getElementById("missions").scrollIntoView({behavior:"smooth"})}showNASAImagery(){document.getElementById("imagery").scrollIntoView({behavior:"smooth"})}showSpaceXAPI(){document.getElementById("launches").scrollIntoView({behavior:"smooth"})}showNASAAPI(){document.getElementById("nasa-apod").scrollIntoView({behavior:"smooth"})}showLaunchLibrary(){document.getElementById("launches").scrollIntoView({behavior:"smooth"})}showSatellites(){document.getElementById("iss").scrollIntoView({behavior:"smooth"})}setupTestimonialsCarousel(){this.carousel={currentSlide:0,autoSlideInterval:null,isAutoPlaying:!0};const n=document.querySelectorAll(".pagination-dot"),a=document.querySelectorAll(".testimonial-slide"),e=document.querySelector(".testimonials-slider"),t=document.querySelector(".testimonials-section");if(!a.length||!n.length||!e){console.warn("No slides, dots, or slider found for carousel.");return}const s=i=>{const c=Math.max(0,Math.min(i,a.length-1));e.style.transform=`translateX(-${c*100}%)`,n.forEach((h,u)=>{h.classList.toggle("active",u===c)}),this.carousel.currentSlide=c},o=()=>{const i=(this.carousel.currentSlide+1)%a.length;s(i)},r=()=>{const i=this.carousel.currentSlide===0?a.length-1:this.carousel.currentSlide-1;s(i)},l=()=>{this.carousel.autoSlideInterval&&clearInterval(this.carousel.autoSlideInterval),this.carousel.autoSlideInterval=setInterval(o,5e3),this.carousel.isAutoPlaying=!0},m=()=>{this.carousel.autoSlideInterval&&(clearInterval(this.carousel.autoSlideInterval),this.carousel.autoSlideInterval=null),this.carousel.isAutoPlaying=!1};if(n.forEach((i,c)=>{i.addEventListener("click",()=>{s(c),this.carousel.isAutoPlaying&&l()})}),t&&(t.addEventListener("mouseenter",()=>{this.carousel.isAutoPlaying&&m()}),t.addEventListener("mouseleave",()=>{l()})),t){let i=0,c=0,h=!1;t.addEventListener("touchstart",u=>{i=u.touches[0].clientX,c=u.touches[0].clientY,h=!1},{passive:!0}),t.addEventListener("touchmove",u=>{if(!i||!c)return;const p=u.touches[0].clientX,g=u.touches[0].clientY,f=Math.abs(p-i),v=Math.abs(g-c);f>v&&f>10&&(h=!0,u.preventDefault())},{passive:!1}),t.addEventListener("touchend",u=>{if(!i||!h)return;const p=u.changedTouches[0].clientX,g=i-p;Math.abs(g)>50&&(g>0?o():r(),this.carousel.isAutoPlaying&&l()),i=0,c=0,h=!1},{passive:!0})}document.addEventListener("keydown",i=>{if(!t)return;const c=t.getBoundingClientRect();if(c.top<window.innerHeight&&c.bottom>0)switch(i.key){case"ArrowLeft":i.preventDefault(),r(),this.carousel.isAutoPlaying&&l();break;case"ArrowRight":i.preventDefault(),o(),this.carousel.isAutoPlaying&&l();break;case" ":i.preventDefault(),this.carousel.isAutoPlaying?m():l();break}}),s(0),l(),this.carousel.showSlide=s,this.carousel.nextSlide=o,this.carousel.prevSlide=r,this.carousel.startAutoSlide=l,this.carousel.stopAutoSlide=m}async getRecentEarthquakes(n=4,a=10){try{const e=new Date,s=`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${new Date(e.getTime()-7*24*60*60*1e3).toISOString().split("T")[0]}&endtime=${e.toISOString().split("T")[0]}&minmagnitude=${n}&limit=${a}`;return await(await fetch(s)).json()}catch(e){throw console.error("Error fetching recent earthquakes:",e),e}}async getEarthquakeCount(n=4,a=7){try{const e=new Date,s=`https://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson&starttime=${new Date(e.getTime()-a*24*60*60*1e3).toISOString().split("T")[0]}&endtime=${e.toISOString().split("T")[0]}&minmagnitude=${n}`;return(await(await fetch(s)).json()).count||0}catch(e){return console.error("Error fetching earthquake count:",e),0}}}document.addEventListener("DOMContentLoaded",()=>{window.app=new w});
