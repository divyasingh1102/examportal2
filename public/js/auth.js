// public/js/auth.js
import { apiFetch, setSession, isAuthenticated, getUser, showToast } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Check if session expired query param exists
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('expired')) {
    showToast('Session expired. Please sign in again.', 'warning');
  }

  // If already authenticated, redirect
  if (isAuthenticated()) {
    const user = getUser();
    if (user?.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
    return;
  }

  // DOM Elements
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  const demoStudentBtn = document.getElementById('demo-student-btn');
  const demoAdminBtn = document.getElementById('demo-admin-btn');

  // Tab switching
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
  });

  // Handle Login Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const role = document.querySelector('input[name="login-role"]:checked')?.value || 'student';

    const submitBtn = document.getElementById('login-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Signing In...';

    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });

    submitBtn.disabled = false;
    submitBtn.innerText = 'Sign In to Portal';

    if (res.success && res.token) {
      setSession(res.token, res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      setTimeout(() => {
        if (res.user.role === 'admin') {
          window.location.href = '/admin.html';
        } else {
          window.location.href = '/dashboard.html';
        }
      }, 500);
    } else {
      showToast(res.message || 'Login failed. Please check your credentials.', 'danger');
    }
  });

  // Handle Register Submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    const submitBtn = document.getElementById('register-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Creating Account...';

    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    submitBtn.disabled = false;
    submitBtn.innerText = 'Create Student Account';

    if (res.success && res.token) {
      setSession(res.token, res.user);
      showToast('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 500);
    } else {
      showToast(res.message || 'Registration failed.', 'danger');
    }
  });

  // Quick Demo Buttons for Evaluators
  if (demoStudentBtn) {
    demoStudentBtn.addEventListener('click', async () => {
      document.getElementById('login-email').value = 'student1@portal.com';
      document.getElementById('login-password').value = 'student123';
      const studentRadio = document.querySelector('input[name="login-role"][value="student"]');
      if (studentRadio) studentRadio.checked = true;
      loginForm.dispatchEvent(new Event('submit'));
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', async () => {
      document.getElementById('login-email').value = 'admin@portal.com';
      document.getElementById('login-password').value = 'admin123';
      const adminRadio = document.querySelector('input[name="login-role"][value="admin"]');
      if (adminRadio) adminRadio.checked = true;
      loginForm.dispatchEvent(new Event('submit'));
    });
  }
});
