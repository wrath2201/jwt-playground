import {
  getAccessToken,
  refreshAccessToken,
  clearTokens
} from './utils/token.js';

const API_BASE = 'http://localhost:5000/api/auth';



async function loadMembers() {
  console.log('🔍 loadMembers called');
  let token = getAccessToken();

  let response = await fetch(`${API_BASE}/get-members`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
   console.log('🔁 Members response (first try):', response); 

  // Try refreshing if unauthorized
  if (response.status === 401 || response.status === 403) {
    token = await refreshAccessToken();
    if (!token) return;

    response = await fetch(`${API_BASE}/get-members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('🔁 Members response (after refresh):', response);
  }

  const data = await response.json();
  const container = document.getElementById('members-container');
  container.innerHTML = '';

  if (Array.isArray(data.members)) {
    data.members.forEach(user => {
      const div = document.createElement('div');
      div.classList.add('member');
      div.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <button onclick="deleteMember('${user._id}')">Delete</button>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerText = data.msg || 'Failed to load members';
  }
}

async function deleteMember(userId) {
  const confirmDelete = confirm('Are you sure you want to delete this user?');
  if (!confirmDelete) return;

  let token = getAccessToken();

  let response = await fetch(`${API_BASE}/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401 || response.status === 403) {
    token = await refreshAccessToken();
    if (!token) return;

    response = await fetch(`${API_BASE}/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  const data = await response.json();
  alert(data.msg || 'User deleted');

  loadMembers(); // Refresh member list
}

// ✅ Make deleteMember globally available to buttons
window.deleteMember = deleteMember;

// ✅ Load members on page load
window.onload = loadMembers;



