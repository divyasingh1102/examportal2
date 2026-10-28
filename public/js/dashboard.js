// public/js/dashboard.js
import { apiFetch, requireAuth, getUser, initNavbar, showToast } from './api.js';

let selectedExamId = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;
  initNavbar();

  const user = getUser();
  const displayNameElem = document.getElementById('student-display-name');
  if (displayNameElem && user) {
    displayNameElem.textContent = user.name;
  }

  await loadAvailableExams();
  await loadPreviousAttempts();
  setupModalHandlers();
});

// Load Active Exams
async function loadAvailableExams() {
  const container = document.getElementById('exams-container');
  const res = await apiFetch('/api/exams');

  if (!res.success || !res.exams || res.exams.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--text-muted); font-size: 1rem;">No active assessments available right now. Check back soon!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = res.exams.map(exam => `
    <div class="exam-card">
      <div class="exam-card-top">
        <span class="exam-subject-badge">${escapeHtml(exam.subject)}</span>
        <h3 class="exam-card-title">${escapeHtml(exam.title)}</h3>
        <p class="exam-card-desc">${escapeHtml(exam.description || 'Test your knowledge with randomized questions and anti-cheat proctoring.')}</p>
        
        <div class="exam-meta-grid">
          <div class="exam-meta-item">
            <span class="meta-label">Duration</span>
            <span class="meta-value">⏱️ ${exam.duration_minutes} Mins</span>
          </div>
          <div class="exam-meta-item">
            <span class="meta-label">Total Marks</span>
            <span class="meta-value">🎯 ${exam.total_marks} Pts</span>
          </div>
          <div class="exam-meta-item">
            <span class="meta-label">Passing Score</span>
            <span class="meta-value">✅ ${exam.passing_marks} Pts</span>
          </div>
          <div class="exam-meta-item">
            <span class="meta-label">Max Violations</span>
            <span class="meta-value" style="color: #fca5a5;">🚨 3 Violations</span>
          </div>
        </div>
      </div>

      <button class="btn btn-primary start-exam-btn" data-id="${exam.id}" data-title="${escapeHtml(exam.title)}">
        Start Assessment 🚀
      </button>
    </div>
  `).join('');

  // Attach click listeners to cards
  document.querySelectorAll('.start-exam-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedExamId = e.currentTarget.getAttribute('data-id');
      const title = e.currentTarget.getAttribute('data-title');
      openInstructionsModal(title);
    });
  });
}

// Load Student Previous Attempts
async function loadPreviousAttempts() {
  const tbody = document.getElementById('attempts-table-body');
  const res = await apiFetch('/api/exams/student/my-attempts');

  if (!res.success || !res.attempts || res.attempts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
          You haven't attempted any tests yet. Click "Start Assessment" above to begin your first test!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = res.attempts.map(a => {
    const isCompleted = a.status === 'completed';
    const isTabDisqualified = a.submission_type === 'tab_violation' || a.auto_submitted === 1;
    const formattedDate = a.created_at ? new Date(a.created_at).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Recent';

    let statusBadge = '';
    if (a.submission_type === 'tab_violation') {
      statusBadge = `<span class="badge badge-danger">Auto-Submitted (Tab Switched)</span>`;
    } else if (a.submission_type === 'timeout') {
      statusBadge = `<span class="badge badge-warning">Auto-Submitted (Timeout)</span>`;
    } else if (isCompleted) {
      statusBadge = `<span class="badge badge-success">Completed</span>`;
    } else {
      statusBadge = `<span class="badge badge-primary">In Progress</span>`;
    }

    return `
      <tr>
        <td><strong>#ATT-${a.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(a.exam_title || `Exam #${a.exam_id}`)}</div>
          <small style="color: var(--text-dim);">${escapeHtml(a.subject || 'Academic Exam')}</small>
        </td>
        <td>${formattedDate}</td>
        <td><strong>${a.score} / ${a.total_marks}</strong></td>
        <td>
          <span style="font-weight: 700; color: ${a.percentage >= 40 ? '#10b981' : '#ef4444'};">
            ${a.percentage}%
          </span>
        </td>
        <td>${statusBadge}</td>
        <td>
          <span class="badge ${a.violations > 0 ? 'badge-danger' : 'badge-primary'}">
            ${a.violations || 0} / 3
          </span>
        </td>
        <td>
          ${isCompleted ? `
            <a href="/result.html?attemptId=${a.id}" class="btn btn-sm btn-secondary">
              Review Result →
            </a>
          ` : `
            <a href="/exam.html?id=${a.exam_id}" class="btn btn-sm btn-primary">
              Resume Test →
            </a>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// Modal logic
function setupModalHandlers() {
  const modal = document.getElementById('instructions-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const startBtn = document.getElementById('modal-start-btn');

  const closeModal = () => {
    modal.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  startBtn.addEventListener('click', () => {
    if (selectedExamId) {
      closeModal();
      window.location.href = `/exam.html?id=${selectedExamId}`;
    }
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

function openInstructionsModal(title) {
  const modal = document.getElementById('instructions-modal');
  const titleElem = document.getElementById('modal-exam-title');
  if (titleElem) {
    titleElem.textContent = `Guidelines: ${title}`;
  }
  modal.classList.add('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
