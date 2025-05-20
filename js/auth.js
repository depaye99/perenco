// Fonctions d'authentification pour la plateforme PID PERENCO
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si nous sommes sur la page de connexion
  if (document.getElementById("login-form")) {
    const loginForm = document.getElementById("login-form")
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Récupérer les valeurs du formulaire
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Simuler l'authentification (à remplacer par un vrai système d'authentification)
      if (email && password) {
        // Stocker les informations de l'utilisateur connecté
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", email.split("@")[0])

        // Redirection vers le tableau de bord
        window.location.href = "dashboard.html"
      } else {
        alert("Veuillez remplir tous les champs")
      }
    })
  }

  // Vérifier si nous sommes sur la page d'inscription
  if (document.getElementById("register-form")) {
    const registerForm = document.getElementById("register-form")
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Récupérer les valeurs du formulaire
      const firstname = document.getElementById("firstname").value
      const lastname = document.getElementById("lastname").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value

      // Vérifier si les mots de passe correspondent
      if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas")
        return
      }

      // Simuler l'inscription (à remplacer par un vrai système d'inscription)
      if (firstname && lastname && email && password) {
        // Stocker les informations de l'utilisateur
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", `${firstname} ${lastname}`)

        // Redirection vers le tableau de bord
        window.location.href = "dashboard.html"
      } else {
        alert("Veuillez remplir tous les champs")
      }
    })
  }

  // Gérer le menu utilisateur et la déconnexion si l'utilisateur est connecté
  updateAuthUI()
})

// Fonction pour créer le menu utilisateur
function createUserMenu() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  if (!isAuthenticated) return

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
                <a href="pid-management.html" class="user-dropdown-item">
                    <i class="fas fa-project-diagram"></i> Gestion des PIDs
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

    // Ajouter le gestionnaire d'événement pour la déconnexion
    document.querySelector(".logout-btn").addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })

    // Ajouter le gestionnaire d'événement pour le menu déroulant
    document.querySelector(".user-menu-toggle").addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelector(".user-dropdown").classList.toggle("active")
    })
  }
}

// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état d'authentification
function updateAuthUI() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  // Masquer/afficher les éléments en fonction de l'état d'authentification
  document.querySelectorAll(".auth-required").forEach((el) => {
    el.style.display = isAuthenticated ? "block" : "none"
  })

  document.querySelectorAll(".non-auth-content").forEach((el) => {
    el.style.display = isAuthenticated ? "none" : "block"
  })

  // Mettre à jour le bouton de connexion / menu utilisateur
  if (isAuthenticated) {
    createUserMenu()
  } else {
    // S'assurer que le bouton de connexion est visible
    const loginBtn = document.querySelector(".login-btn")
    if (loginBtn) {
      loginBtn.parentElement.style.display = "block"
    }
  }
}

// Fonction de déconnexion
function logout() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userName")

  // Redirection vers la page d'accueil
  window.location.href = "index.html"
}
