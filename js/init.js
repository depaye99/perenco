// Ce script s'assure que l'authentification est vérifiée sur toutes les pages
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  // Sélection des éléments à afficher/masquer
  const authRequired = document.querySelectorAll(".auth-required")
  const nonAuthContent = document.querySelectorAll(".non-auth-content")

  // Mise à jour de l'interface utilisateur en fonction de l'état d'authentification
  updateAuthUI()

  // Ajouter des styles CSS pour le menu utilisateur
  addUserMenuStyles()
})

// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état d'authentification
function updateAuthUI() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  const authRequired = document.querySelectorAll(".auth-required")
  const nonAuthContent = document.querySelectorAll(".non-auth-content")

  authRequired.forEach((element) => {
    element.style.display = isAuthenticated ? "block" : "none"
  })

  nonAuthContent.forEach((element) => {
    element.style.display = isAuthenticated ? "none" : "block"
  })
}

// Fonction pour ajouter les styles CSS pour le menu utilisateur
function addUserMenuStyles() {
  // Vérifier si les styles existent déjà
  if (!document.getElementById("user-menu-styles")) {
    // Vérifier si le fichier CSS externe existe déjà
    const existingLink = document.querySelector('link[href="css/user-styles.css"]')

    if (!existingLink) {
      const link = document.createElement("link")
      link.id = "user-menu-styles"
      link.rel = "stylesheet"
      link.href = "css/user-styles.css"
      document.head.appendChild(link)
    }
  }
}
