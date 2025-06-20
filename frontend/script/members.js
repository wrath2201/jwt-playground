const API_BASE = 'http://localhost:5000/api/auth';

async function loadMembers() {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${API_BASE}/get-members`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  });

  const data = await response.json();

  const container = document.getElementById('members-container');
  container.innerHTML = ''; // Clear previous

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

  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${API_BASE}/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  });

  const data = await response.json();
  alert(data.msg || 'User deleted');

  // Refresh the list
  loadMembers();
}

// ✅ Important: expose deleteMember so inline button can access it
window.deleteMember = deleteMember;

window.onload = loadMembers;



