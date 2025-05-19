document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }
})

function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (email && password) {
    // Simuler l'authentification (à remplacer par un vrai système)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userName", email.split("@")[0])

    // Redirection vers le tableau de bord
    window.location.href = "dashboard.html"
  } else {
    alert("Veuillez remplir tous les champs")
  }
}