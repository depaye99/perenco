/**
 * Gestion des zones de production
 * Communique avec le backend Flask via l'API
 */
import { zonesService } from './api';

document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    try {
      const zones = await zonesService.getAll();
      renderZones(zones);
      setupEventListeners();
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
    }
  }
});

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
            <div class="zone-stat-value">${zone.platforms_count}</div>
          </div>
          <div class="zone-stat">
            <div class="zone-stat-label">PIDs</div>
            <div class="zone-stat-value">${zone.pids_count}</div>
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