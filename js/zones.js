// Gestion des zones pour la plateforme PID PERENCO
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    initZonesPage();
  }
});

function initZonesPage() {
  // Données des zones (statiques pour l'exemple)
  const zones = [
    {
      id: 'rdrw',
      name: 'RDRW',
      platforms: 5,
      pids: 45,
      description: 'Zone de production RDRW'
    },
    {
      id: 'rdre',
      name: 'RDRE',
      platforms: 4,
      pids: 38,
      description: 'Zone de production RDRE'
    },
    {
      id: 'rdrs',
      name: 'RDRS',
      platforms: 6,
      pids: 52,
      description: 'Zone de production RDRS'
    }
  ];

  renderZones(zones);
  setupEventListeners();
}

function renderZones(zones) {
  const container = document.querySelector('.zones-grid');
  if (!container) return;

  container.innerHTML = zones.map(zone => `
    <div class="zone-card" data-zone-id="${zone.id}">
      <div class="zone-header">
        <h3>${zone.name}</h3>
      </div>
      <div class="zone-content">
        <div class="zone-stats">
          <div class="zone-stat">
            <div class="zone-stat-label">Plateformes</div>
            <div class="zone-stat-value">${zone.platforms}</div>
          </div>
          <div class="zone-stat">
            <div class="zone-stat-label">PIDs</div>
            <div class="zone-stat-value">${zone.pids}</div>
          </div>
        </div>
        <p class="zone-description">${zone.description}</p>
      </div>
      <div class="zone-footer">
        <a href="platforms.html?zone=${zone.id}" class="btn btn-primary">
          Voir les plateformes
        </a>
      </div>
    </div>
  `).join('');
}

function setupEventListeners() {
  // Gestionnaire pour la recherche
  const searchInput = document.getElementById('zone-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterZones(searchTerm);
    });
  }

  // Gestionnaire pour les cartes de zone
  document.querySelectorAll('.zone-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn')) {
        const zoneId = card.dataset.zoneId;
        window.location.href = `platforms.html?zone=${zoneId}`;
      }
    });
  });
}

function filterZones(searchTerm) {
  const cards = document.querySelectorAll('.zone-card');
  cards.forEach(card => {
    const zoneName = card.querySelector('h3').textContent.toLowerCase();
    const visible = zoneName.includes(searchTerm);
    card.style.display = visible ? 'block' : 'none';
  });
}