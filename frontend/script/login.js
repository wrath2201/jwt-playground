const API_BASE = 'http://localhost:5000/api/auth';
import { setTokens } from './utils/token.js';

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

console.log('Response status:', response.status);
console.log('Raw response:', response);

const data = await response.json();
console.log('Response  xyzabc data:', data);

  if (data.accessToken && data.refreshToken) {
    setTokens(data.accessToken, data.refreshToken);
    alert('Login successful!');
    window.location.href = 'dashboard.html';
  } else {
    alert(data.msg || 'Login failed');
  }
}
window.login = login;

