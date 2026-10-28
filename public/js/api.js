// public/js/api.js
// Centralized API Client, Token & Session Management, and Toast Alerts

const API_BASE = '';

// Session Management
export function getToken() {
  return localStorage.getItem('portal_token');
}

export function getUser() {
  const userStr = localStorage.getItem('portal_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem('portal_token', token);
  localStorage.setItem('portal_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('portal_token');
  localStorage.removeItem('portal_user');
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

// Redirect guards
export function requireAuth(role = null) {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  if (role && getUser()?.role !== role) {
    if (getUser()?.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
    return false;
  }
  return true;
}

// Unified API Fetcher
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (response.status === 401) {
      // Token expired or invalid
      clearSession();
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = '/login.html?expired=1';
      }
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${endpoint}]:`, error);
    return {
      success: false,
      message: error.message || 'Network connection failed.'
    };
  }
}

// Toast Notifications
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'danger' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Global Nav bar renderer helper
export function initNavbar() {
  const user = getUser();
  const navContainer = document.getElementById('app-navbar');
  if (!navContainer) return;

  const currentPath = window.location.pathname;

  navContainer.innerHTML = `
    <div class="navbar">
      <a href="${user?.role === 'admin' ? '/admin.html' : '/dashboard.html'}" class="brand">
        <div class="brand-icon">⚡</div>
        <span>ExamPulse</span>
        <span class="badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}">${user?.role === 'admin' ? 'Proctor Portal' : 'Student Portal'}</span>
      </a>

      <div class="nav-actions">
        ${user ? `
          ${user.role === 'admin' ? `
            <a href="/admin.html" class="btn btn-sm ${currentPath.includes('admin') ? 'btn-primary' : 'btn-secondary'}">Admin Analytics</a>
            <a href="/dashboard.html" class="btn btn-sm ${currentPath.includes('dashboard') ? 'btn-primary' : 'btn-secondary'}">Student View</a>
          ` : `
            <a href="/dashboard.html" class="btn btn-sm ${currentPath.includes('dashboard') ? 'btn-primary' : 'btn-secondary'}">My Exams</a>
          `}
          
          <div class="user-profile">
            <div class="user-avatar">${(user.name || 'U').charAt(0).toUpperCase()}</div>
            <div class="user-details">
              <span class="user-name">${user.name || 'User'}</span>
              <span class="user-role">${user.role}</span>
            </div>
          </div>

          <button id="nav-logout-btn" class="btn btn-sm btn-secondary" title="Sign out">
            Logout
          </button>
        ` : `
          <a href="/login.html" class="btn btn-sm btn-primary">Sign In</a>
        `}
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      showToast('Logged out successfully', 'info');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 400);
    });
  }
}
