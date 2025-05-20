document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (isAuthenticated) {
    // Initialiser la page de détails de la plateforme
    initPlatformDetails()

    // Ajouter les gestionnaires d'événements pour la recherche et le filtrage
    initSearchAndFilter()

    // Initialiser la pagination
    initPagination()
  }
})

function initPlatformDetails() {
  // Cette fonction pourrait charger des données réelles depuis un API
  // Pour l'exemple, nous utilisons des données statiques
  // Ici, vous pourriez faire un appel API pour récupérer les détails de la plateforme
  // et mettre à jour l'interface utilisateur en conséquence
}

function initSearchAndFilter() {
  // Gestionnaire d'événements pour la recherche de PID
  const searchInput = document.getElementById("pid-search")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const rows = document.querySelectorAll(".pid-table tbody tr")

      rows.forEach((row) => {
        const pidName = row.cells[0].textContent.toLowerCase()
        const pidId = row.cells[1].textContent.toLowerCase()

        if (pidName.includes(searchTerm) || pidId.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    })
  }

  // Gestionnaire d'événements pour le filtrage par statut
  const statusFilter = document.getElementById("status-filter")
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      const selectedValue = this.value
      const rows = document.querySelectorAll(".pid-table tbody tr")

      rows.forEach((row) => {
        const statusCell = row.cells[2]
        const statusBadge = statusCell.querySelector(".status-badge")
        const status = statusBadge ? statusBadge.classList[1] : ""

        if (!selectedValue || status === selectedValue) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    })
  }
}

function initPagination() {
  // Gestionnaire d'événements pour la pagination
  const paginationButtons = document.querySelectorAll(".pid-pagination-controls button:not([disabled])")
  if (paginationButtons.length) {
    paginationButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Réinitialiser la classe 'active' pour tous les boutons
        paginationButtons.forEach((btn) => btn.classList.remove("active"))

        // Si c'est un bouton numéroté, ajouter la classe 'active'
        if (!this.querySelector("i")) {
          this.classList.add("active")
        }

        // Ici, vous pourriez implémenter la logique pour changer la page
        // Par exemple, charger une nouvelle page de données
        // Pour cet exemple, nous simulons simplement un changement de page
        const pageNumber = this.textContent
        if (pageNumber) {
          // Mettre à jour les informations de pagination
          const showingStart = document.getElementById("showing-start")
          const showingEnd = document.getElementById("showing-end")
          if (showingStart && showingEnd) {
            const pageSize = 10
            const start = (Number.parseInt(pageNumber) - 1) * pageSize + 1
            const end = Math.min(start + pageSize - 1, 34) // 34 est le nombre total d'éléments

            showingStart.textContent = start
            showingEnd.textContent = end
          }
        }
      })
    })
  }
}
