// const API_BASE = 'http://localhost:5000/api/auth';

// async function loadDashboard() {
//   const token = localStorage.getItem('jwtToken');
//   if (!token) {
//     alert('Please login first');
//     window.location.href = 'login.html';
//     return;
//   }

//   const response = await fetch(`${API_BASE}/protected`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'token': token
//     }
//   });

//   const data = await response.json();
//   if (response.ok) {
//     document.getElementById('welcome-msg').innerText = data.msg;
//   } else {
//     alert(data.msg || 'Access denied');
//     window.location.href = 'login.html';
//   }
// }

// function logout() {
//   localStorage.removeItem('jwtToken');
//   alert('Logged out');
//   window.location.href = 'login.html';
// }

// function goToMembers() {
//   window.location.href = 'members.html';
// }

// window.onload = loadDashboard;

import {
  getAccessToken,
  refreshAccessToken,
  clearTokens
} from './utils/token.js';

async function testProtected() {
  let token = getAccessToken();

  let response = await fetch('http://localhost:5000/api/auth/protected', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: token
    }
  });

  let data = await response.json();

  if (response.ok && data.msg?.startsWith('Welcome')) {
    document.getElementById('welcome-msg').innerText = data.msg;
    document.getElementById('token-box').innerText = token;
  } else {
    // Token might be expired → try refreshing it
    const newToken = await refreshAccessToken();
    if (!newToken) return;

    const retryRes = await fetch('http://localhost:5000/api/auth/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: newToken
      }
    });

    const retryData = await retryRes.json();

    if (retryRes.ok) {
      document.getElementById('welcome-msg').innerText = retryData.msg;
      document.getElementById('token-box').innerText = newToken;
    } else {
      alert(retryData.msg || 'Protected request failed after refresh');
      window.location.href = 'index.html';
    }
  }
}

function logout() {
  clearTokens();
  alert('Logged out!');
  window.location.href = 'index.html';
}

function goToMembers() {
  window.location.href = 'members.html';
}

// ✅ Call this on page load
window.onload = testProtected;

window.logout = logout;
window.goToMembers = goToMembers;
window.testProtected = testProtected;
