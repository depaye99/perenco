/**
 * Gestion de l'inscription utilisateur
 * Communique avec le backend Flask via l'API
 */
import { authService } from './api';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});

async function handleRegister(e) {
  e.preventDefault();

  const userData = {
    firstname: document.getElementById('firstname').value,
    lastname: document.getElementById('lastname').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value
  };

  const confirmPassword = document.getElementById('confirm-password').value;

  if (userData.password !== confirmPassword) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }

  try {
    const response = await authService.register(userData);
    
    // Stocker le token et les informations utilisateur
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', `${userData.firstname} ${userData.lastname}`);

    // Redirection vers le tableau de bord
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
}