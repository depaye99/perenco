import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (isAuthenticated) {
    // Initialiser les graphiques du tableau de bord
    initCharts()

    // Charger les données du tableau de bord
    loadDashboardData()
  }
})

function initCharts() {
  // Récupérer les contextes des canvas
  const platformsChartCtx = document.getElementById("platformsChart")?.getContext("2d")
  const verificationChartCtx = document.getElementById("verificationChart")?.getContext("2d")

  if (platformsChartCtx) {
    // Initialiser le graphique des plateformes
    new Chart(platformsChartCtx, {
      type: "bar",
      data: {
        labels: ["VT", "BAP", "ESP1", "ESP2", "KLP1", "KLF1", "KLF2", "KLF3", "KLF4", "ESF1"],
        datasets: [
          {
            label: "Nombre de PIDs",
            data: [34, 28, 23, 22, 16, 13, 7, 11, 13, 13],
            backgroundColor: [
              "rgba(0, 39, 82, 0.8)",
              "rgba(0, 39, 82, 0.75)",
              "rgba(0, 39, 82, 0.7)",
              "rgba(0, 39, 82, 0.65)",
              "rgba(0, 39, 82, 0.6)",
              "rgba(0, 39, 82, 0.55)",
              "rgba(0, 39, 82, 0.5)",
              "rgba(0, 39, 82, 0.45)",
              "rgba(0, 39, 82, 0.4)",
              "rgba(0, 39, 82, 0.35)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  if (verificationChartCtx) {
    // Initialiser le graphique de vérification
    new Chart(verificationChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Vérifiés", "En attente"],
        datasets: [
          {
            data: [78, 264],
            backgroundColor: ["rgba(40, 167, 69, 0.7)", "rgba(220, 53, 69, 0.7)"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }
}

function loadDashboardData() {
  // Cette fonction pourrait charger des données réelles depuis un API
  // Pour l'exemple, nous utilisons des données statiques

  // Exemple: mettre à jour les statistiques
  updateStats({
    platforms: 10,
    totalPids: 342,
    verifiedPids: 78,
    pendingPids: 264,
  })

  // Ajouter un lien vers la gestion des PIDs
  addPIDManagementLink()
}

function updateStats(data) {
  // Mettre à jour les statistiques affichées sur le tableau de bord
  const statsElements = document.querySelectorAll(".stat-value")
  if (statsElements.length >= 4) {
    statsElements[0].textContent = data.platforms
    statsElements[1].textContent = data.totalPids
    statsElements[2].textContent = data.verifiedPids
    statsElements[3].textContent = data.pendingPids
  }
}

function addPIDManagementLink() {
  // Ajouter un lien vers la page de gestion des PIDs dans le tableau de bord
  const dashboardOverview = document.querySelector(".dashboard-overview")

  if (dashboardOverview) {
    const pidManagementCard = document.createElement("div")
    pidManagementCard.className = "dashboard-card"
    pidManagementCard.innerHTML = `
      <div class="dashboard-card-header">
        <h2>Gestion des PIDs</h2>
      </div>
      <div class="dashboard-card-body">
        <p>Accédez à la gestion complète des PIDs pour consulter, modifier et organiser les données par zone et plateforme.</p>
        <a href="pid-management.html" class="btn btn-primary">Gérer les PIDs</a>
      </div>
    `

    dashboardOverview.appendChild(pidManagementCard)
  }
}
