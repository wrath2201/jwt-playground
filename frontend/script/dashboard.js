const API_BASE = 'http://localhost:5000/api/auth';

async function loadDashboard() {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  const response = await fetch(`${API_BASE}/protected`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  });

  const data = await response.json();
  if (response.ok) {
    document.getElementById('welcome-msg').innerText = data.msg;
  } else {
    alert(data.msg || 'Access denied');
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('jwtToken');
  alert('Logged out');
  window.location.href = 'login.html';
}

function goToMembers() {
  window.location.href = 'members.html';
}

window.onload = loadDashboard;
