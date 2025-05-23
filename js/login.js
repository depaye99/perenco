/**
 * Gestion de la connexion utilisateur
 * Communique avec le backend Flask via l'API
 */
import { authService } from './api';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await authService.login({ email, password });
    
    // Stocker le token et les informations utilisateur
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', response.user.name);

    // Redirection vers le tableau de bord
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
}