// Ce fichier contient uniquement la logique commune d'authentification
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier l'état d'authentification
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  // Mettre à jour l'interface utilisateur
  updateAuthUI()

  // Gérer le menu utilisateur et la déconnexion si l'utilisateur est connecté
  if (isAuthenticated) {
    createUserMenu()
  }
})

// Fonction pour créer le menu utilisateur
function createUserMenu() {
  const userName = localStorage.getItem("userName") || "Utilisateur"
  const navMenu = document.querySelector(".nav-menu")

  // Vérifier si l'élément login-btn existe et le supprimer
  const loginBtn = document.querySelector(".login-btn")
  if (loginBtn) {
    loginBtn.parentElement.remove()
  }

  // Créer le menu utilisateur s'il n'existe pas déjà
  if (!document.querySelector(".user-menu-container")) {
    const userMenuItem = document.createElement("li")
    userMenuItem.className = "nav-item user-menu-container"

    const userMenu = `
      <a href="#" class="nav-link user-menu-toggle">
        <i class="fas fa-user"></i> ${userName}
      </a>
      <div class="user-dropdown">
        <a href="dashboard.html" class="user-dropdown-item">
          <i class="fas fa-tachometer-alt"></i> Tableau de bord
        </a>
        <a href="zones.html" class="user-dropdown-item">
          <i class="fas fa-layer-group"></i> Zones
        </a>
        <a href="import-data.html" class="user-dropdown-item">
          <i class="fas fa-file-import"></i> Importer des données
        </a>
        <a href="#" class="user-dropdown-item logout-btn">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </a>
      </div>
    `

    userMenuItem.innerHTML = userMenu
    navMenu.appendChild(userMenuItem)

    // Ajouter les gestionnaires d'événements
    document.querySelector(".logout-btn").addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })

    document.querySelector(".user-menu-toggle").addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelector(".user-dropdown").classList.toggle("active")
    })
  }
}

// Fonction pour mettre à jour l'interface utilisateur
function updateAuthUI() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  // Masquer/afficher les éléments en fonction de l'état d'authentification
  document.querySelectorAll(".auth-required").forEach((el) => {
    el.style.display = isAuthenticated ? "block" : "none"
  })

  document.querySelectorAll(".non-auth-content").forEach((el) => {
    el.style.display = isAuthenticated ? "none" : "block"
  })

  // Mettre à jour la navigation
  updateNavigation(isAuthenticated)
}

// Fonction pour mettre à jour la navigation
function updateNavigation(isAuthenticated) {
  const navMenu = document.querySelector(".nav-menu")
  if (!navMenu) return

  // Structure de base de la navigation
  const baseNavItems = [
    { href: "index.html", text: "Accueil" },
    { href: "zones.html", text: "Zones" },
    { href: "dashboard.html", text: "Tableau de bord" },
    { href: "about.html", text: "À propos" }
  ]

  // Vider le menu
  navMenu.innerHTML = ""

  // Ajouter les éléments de base
  baseNavItems.forEach(item => {
    const li = document.createElement("li")
    li.className = "nav-item"
    li.innerHTML = `<a href="${item.href}" class="nav-link">${item.text}</a>`
    navMenu.appendChild(li)
  })

  // Ajouter le bouton de connexion si non authentifié
  if (!isAuthenticated) {
    const loginLi = document.createElement("li")
    loginLi.className = "nav-item"
    loginLi.innerHTML = '<a href="login.html" class="nav-link login-btn">Connexion</a>'
    navMenu.appendChild(loginLi)
  }
}

// Fonction de déconnexion
function logout() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userName")
  window.location.href = "index.html"
}