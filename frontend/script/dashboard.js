
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

      Authorization: `Bearer ${token}` // ✅ use Bearer format
    }
  });


  let data = await response.json();
  console.log('🔒 Protected route response:', response);
  console.log('📦 Data:', data);


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
        Authorization: `Bearer ${newToken}`
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
