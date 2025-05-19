document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }
})

function handleRegister(e) {
  e.preventDefault()

  const firstname = document.getElementById("firstname").value
  const lastname = document.getElementById("lastname").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirm-password").value

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas")
    return
  }

  if (firstname && lastname && email && password) {
    // Simuler l'inscription (à remplacer par un vrai système)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userName", `${firstname} ${lastname}`)

    // Redirection vers le tableau de bord
    window.location.href = "dashboard.html"
  } else {
    alert("Veuillez remplir tous les champs")
  }
}