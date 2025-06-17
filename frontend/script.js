const API_BASE = 'http://localhost:5000/api'; // change port if your backend is on a different one

let jwtToken = null;

// ------------------ Register ------------------
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
}

// ------------------ Login ------------------
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
    jwtToken = data.token;
    document.getElementById('token-box').innerText = jwtToken;
    alert('Login successful!');
  } else {
    alert(data.msg || 'Login failed');
  }
}

// ------------------ Test Protected ------------------
async function testProtected() {
  const response = await fetch(`${API_BASE}/protected`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': jwtToken  // use 'Authorization': `Bearer ${jwtToken}` if your backend uses Bearer tokens
    }
  });

  const data = await response.json();
  alert(data.msg || 'Protected route failed');
}
