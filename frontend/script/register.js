const API_BASE = 'http://localhost:5000/api/auth';

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  alert(data.msg || 'Registered!');
  if (response.ok) {
    window.location.href = 'login.html';
  }
}
