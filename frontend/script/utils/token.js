// frontend/script/utils/token.js

const API_BASE = 'http://localhost:5000/api';

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function refreshAccessToken() {
  const response = await fetch(`${API_BASE}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: getRefreshToken() })
  });

  const data = await response.json();

  if (data.accessToken) {
    setTokens(data.accessToken, getRefreshToken());
    return data.accessToken;
  } else {
    clearTokens();
    alert('Session expired. Please login again.');
    window.location.href = 'index.html';
  }
}
