export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getAuthToken() {
  return localStorage.getItem('boardease_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('boardease_token', token);
  } else {
    localStorage.removeItem('boardease_token');
  }
}

export function clearAuthSession() {
  localStorage.removeItem('boardease_token');
  localStorage.removeItem('boardease_user');
}

export async function api(path, options = {}) {
  const token = getAuthToken();
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Cannot connect to the server. Check that MongoDB and the API server are running.'
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearAuthSession();
    }
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export default api;
