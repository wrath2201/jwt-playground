const API_BASE = 'http://localhost:5000/api/auth';

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('jwtToken', data.token); // ✅ Save token in browser
    alert('Login successful!');
    window.location.href = 'dashboard.html'; // redirect after login
  } else {
    alert(data.msg || 'Login failed');
  }
}
