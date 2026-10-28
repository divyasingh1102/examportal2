// public/js/admin.js
// Admin Analytics, Chart.js Integrations, Student Proctoring Review, and Question Bank CRUD

import { apiFetch, requireAuth, initNavbar, showToast } from './api.js';

let accuracyChartInstance = null;
let avgScoreChartInstance = null;
let cachedExams = [];
let cachedQuestions = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth('admin')) return;
  initNavbar();

  setupTabs();
  setupModals();

  await loadDashboardData();
  await loadAttemptsList();
  await loadQuestionBank();
});

// Tab Switcher for Admin Sections
function setupTabs() {
  const tabExams = document.getElementById('tab-btn-exams');
  const tabAttempts = document.getElementById('tab-btn-attempts');
  const tabQuestions = document.getElementById('tab-btn-questions');

  const secExams = document.getElementById('section-exams');
  const secAttempts = document.getElementById('section-attempts');
  const secQuestions = document.getElementById('section-questions');

  const activateTab = (activeBtn, activeSec) => {
    [tabExams, tabAttempts, tabQuestions].forEach(btn => btn.classList.remove('active'));
    [secExams, secAttempts, secQuestions].forEach(sec => sec.style.display = 'none');

    activeBtn.classList.add('active');
    activeSec.style.display = 'block';
  };

  tabExams.addEventListener('click', () => activateTab(tabExams, secExams));
  tabAttempts.addEventListener('click', () => activateTab(tabAttempts, secAttempts));
  tabQuestions.addEventListener('click', () => activateTab(tabQuestions, secQuestions));
}

// 1. Load Stats & Performance Analytics
async function loadDashboardData() {
  try {
    const statsRes = await apiFetch('/api/admin/stats');
    if (statsRes.success) {
      const s = statsRes.stats;
      document.getElementById('stat-total-exams').textContent = s.totalExams;
      document.getElementById('stat-total-students').textContent = s.totalStudents;
      document.getElementById('stat-total-attempts').textContent = s.totalAttempts;
      document.getElementById('stat-avg-score').textContent = `${s.globalAvgScore}%`;
      document.getElementById('stat-flagged-count').textContent = s.flaggedAttemptsCount;
    }

    const analyticsRes = await apiFetch('/api/admin/analytics');
    if (analyticsRes.success) {
      const { examAverages, questionAccuracy } = analyticsRes.analytics;
      renderExamsTable(examAverages);
      renderAccuracyChart(questionAccuracy);
      renderExamAverageChart(examAverages);
    }
  } catch (err) {
    console.error('Error loading dashboard analytics:', err);
  }
}

// Render Exams Summary Table
function renderExamsTable(examAverages) {
  const tbody = document.getElementById('exams-table-body');
  cachedExams = examAverages;

  if (!examAverages || examAverages.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No exams found. Click "+ Create Exam" to add your first assessment.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = examAverages.map(e => `
    <tr>
      <td><strong>#EX-${e.examId}</strong></td>
      <td style="font-weight: 600;">${escapeHtml(e.title)}</td>
      <td><span class="badge badge-primary">${escapeHtml(e.subject)}</span></td>
      <td>⏱️ ${e.durationMinutes || 10} Mins</td>
      <td>${e.totalMarks || 50} Pts</td>
      <td><strong>${e.attemptCount}</strong> Attempts</td>
      <td>
        <span class="badge ${e.averageScore >= 50 ? 'badge-success' : 'badge-warning'}" style="font-size: 0.85rem;">
          ${e.averageScore}% Avg
        </span>
      </td>
    </tr>
  `).join('');

  // Populate exam select dropdown in Question modal
  const examSelect = document.getElementById('q-modal-exam');
  if (examSelect) {
    examSelect.innerHTML = examAverages.map(e => `
      <option value="${e.examId}">${escapeHtml(e.title)} (${escapeHtml(e.subject)})</option>
    `).join('');
  }
}

// 2. HARDER TWIST C: Chart.js Per-Question Accuracy Bar Chart
function renderAccuracyChart(questionAccuracy) {
  const ctx = document.getElementById('questionAccuracyChart');
  if (!ctx || !window.Chart) return;

  if (accuracyChartInstance) {
    accuracyChartInstance.destroy();
  }

  const labels = questionAccuracy.map((q, i) => `Q${i + 1}`);
  const dataValues = questionAccuracy.map(q => q.accuracyPercentage);

  // Dynamic colors: green for high accuracy, amber for medium, red for low
  const backgroundColors = dataValues.map(val => {
    if (val >= 75) return 'rgba(16, 185, 129, 0.7)'; // Green
    if (val >= 45) return 'rgba(245, 158, 11, 0.7)'; // Yellow/Amber
    return 'rgba(239, 68, 68, 0.7)';                 // Red
  });

  const borderColors = dataValues.map(val => {
    if (val >= 75) return '#10b981';
    if (val >= 45) return '#f59e0b';
    return '#ef4444';
  });

  accuracyChartInstance = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Accuracy Rate (%)',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              const idx = items[0].dataIndex;
              return `Question ${idx + 1}: ${questionAccuracy[idx].category}`;
            },
            label: (item) => {
              const idx = item.dataIndex;
              return [
                `Accuracy: ${item.raw}%`,
                `Text: ${questionAccuracy[idx].questionText}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#94a3b8',
            callback: (v) => `${v}%`
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

// 3. HARDER TWIST C: Chart.js Average Score Across Exams
function renderExamAverageChart(examAverages) {
  const ctx = document.getElementById('examAverageChart');
  if (!ctx || !window.Chart) return;

  if (avgScoreChartInstance) {
    avgScoreChartInstance.destroy();
  }

  const labels = examAverages.map(e => e.title.length > 20 ? e.title.substring(0, 18) + '...' : e.title);
  const dataValues = examAverages.map(e => e.averageScore);

  avgScoreChartInstance = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Average Score (%)',
        data: dataValues,
        backgroundColor: 'rgba(79, 70, 229, 0.65)',
        borderColor: '#818cf8',
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `Average Score: ${item.raw}%`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: {
            color: '#94a3b8',
            callback: (v) => `${v}%`
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

// 4. Student Attempts Table (Student name, score, time taken, violations, auto-submitted flag)
async function loadAttemptsList() {
  const tbody = document.getElementById('admin-attempts-table-body');
  const res = await apiFetch('/api/admin/attempts');

  if (!res.success || !res.attempts || res.attempts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No student attempts recorded yet.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = res.attempts.map(a => {
    const hasViolations = a.violations > 0;
    const isAuto = a.autoSubmitted || a.submissionType === 'tab_violation' || a.submissionType === 'timeout';

    return `
      <tr>
        <td><strong>#ATT-${a.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(a.studentName)}</div>
          <small style="color: var(--text-dim);">${escapeHtml(a.studentEmail)}</small>
        </td>
        <td>${escapeHtml(a.examTitle)}</td>
        <td>
          <strong>${a.score} / ${a.totalMarks}</strong>
          <span style="font-size: 0.8rem; color: #a5b4fc;">(${a.percentage}%)</span>
        </td>
        <td>⏱️ ${a.timeTaken}</td>
        <td>
          <span class="badge ${hasViolations ? 'badge-danger' : 'badge-primary'}" style="font-weight: 700;">
            ${a.violations} / 3 Strikes
          </span>
        </td>
        <td>
          ${isAuto ? `
            <span class="badge badge-danger">
              YES (${a.submissionType === 'tab_violation' ? 'Tab Violation' : 'Timeout'})
            </span>
          ` : `
            <span class="badge badge-success">No (Manual)</span>
          `}
        </td>
        <td>
          <a href="/result.html?attemptId=${a.id}" class="btn btn-sm btn-secondary" target="_blank">
            Inspect Review →
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Question Bank Management (CRUD)
async function loadQuestionBank() {
  const tbody = document.getElementById('questions-table-body');
  const badge = document.getElementById('question-count-badge');
  const res = await apiFetch('/api/admin/questions');

  if (!res.success || !res.questions || res.questions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
          No questions in the repository yet. Click "+ Add MCQ Question" to add one.
        </td>
      </tr>
    `;
    if (badge) badge.textContent = '0 Questions';
    return;
  }

  cachedQuestions = res.questions;
  if (badge) badge.textContent = `${res.questions.length} Questions`;

  tbody.innerHTML = res.questions.map(q => {
    const correctOpt = q.options.find(o => o.is_correct);
    const correctText = correctOpt ? correctOpt.option_text : 'N/A';

    return `
      <tr>
        <td><strong>#Q-${q.id}</strong></td>
        <td><span class="badge badge-primary">${escapeHtml(q.examTitle || `Exam #${q.exam_id}`)}</span></td>
        <td style="max-width: 380px;">
          <div style="font-weight: 500; line-height: 1.4;">${escapeHtml(q.question_text)}</div>
        </td>
        <td><span class="badge badge-secondary">${escapeHtml(q.category || 'General')}</span></td>
        <td><strong>${q.marks} Pts</strong></td>
        <td>
          <div style="color: #6ee7b7; font-weight: 600; font-size: 0.85rem; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ✓ ${escapeHtml(correctText)}
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm btn-secondary edit-q-btn" data-id="${q.id}" title="Edit question">
              ✏️
            </button>
            <button class="btn btn-sm btn-outline-danger delete-q-btn" data-id="${q.id}" title="Delete question">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Attach Edit and Delete Handlers
  tbody.querySelectorAll('.edit-q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = parseInt(btn.getAttribute('data-id'), 10);
      openEditQuestionModal(qId);
    });
  });

  tbody.querySelectorAll('.delete-q-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const qId = parseInt(btn.getAttribute('data-id'), 10);
      if (confirm(`Are you sure you want to delete Question #Q-${qId}? This action cannot be undone.`)) {
        const delRes = await apiFetch(`/api/admin/questions/${qId}`, { method: 'DELETE' });
        if (delRes.success) {
          showToast('Question deleted successfully.', 'success');
          await loadQuestionBank();
          await loadDashboardData();
        } else {
          showToast(delRes.message || 'Failed to delete question.', 'danger');
        }
      }
    });
  });
}

// 6. Modals Setup (Add/Edit Question, Create Exam)
function setupModals() {
  const qModal = document.getElementById('question-modal');
  const qModalClose = document.getElementById('question-modal-close');
  const qModalCancel = document.getElementById('question-modal-cancel');
  const addQBtn = document.getElementById('add-question-btn');
  const qForm = document.getElementById('question-form');

  const examModal = document.getElementById('exam-modal');
  const examModalClose = document.getElementById('exam-modal-close');
  const examModalCancel = document.getElementById('exam-modal-cancel');
  const addExamBtn = document.getElementById('add-exam-btn');
  const examForm = document.getElementById('exam-form');

  // Open Add Question
  addQBtn.addEventListener('click', () => {
    document.getElementById('question-modal-title').textContent = 'Add MCQ Question to Bank';
    document.getElementById('q-edit-id').value = '';
    qForm.reset();
    qModal.classList.add('active');
  });

  // Close Question Modal
  const closeQModal = () => qModal.classList.remove('active');
  qModalClose.addEventListener('click', closeQModal);
  qModalCancel.addEventListener('click', closeQModal);

  // Submit Question Form (Add or Edit)
  qForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('q-edit-id').value;
    const exam_id = document.getElementById('q-modal-exam').value;
    const question_text = document.getElementById('q-modal-text').value.trim();
    const category = document.getElementById('q-modal-category').value.trim();
    const marks = parseInt(document.getElementById('q-modal-marks').value, 10);
    const explanation = document.getElementById('q-modal-explanation').value.trim();

    const selectedRadio = document.querySelector('input[name="correct-option-radio"]:checked')?.value;
    const correctIdx = selectedRadio ? parseInt(selectedRadio, 10) : 0;

    const options = [
      { option_text: document.getElementById('q-opt-0').value.trim(), is_correct: correctIdx === 0 },
      { option_text: document.getElementById('q-opt-1').value.trim(), is_correct: correctIdx === 1 },
      { option_text: document.getElementById('q-opt-2').value.trim(), is_correct: correctIdx === 2 },
      { option_text: document.getElementById('q-opt-3').value.trim(), is_correct: correctIdx === 3 }
    ];

    const payload = { exam_id, question_text, category, marks, explanation, options };

    let res;
    if (editId) {
      res = await apiFetch(`/api/admin/questions/${editId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      res = await apiFetch('/api/admin/questions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    if (res.success) {
      showToast(res.message || 'Question saved successfully!', 'success');
      closeQModal();
      await loadQuestionBank();
      await loadDashboardData();
    } else {
      showToast(res.message || 'Failed to save question.', 'danger');
    }
  });

  // Open Create Exam
  addExamBtn.addEventListener('click', () => {
    examForm.reset();
    examModal.classList.add('active');
  });

  const closeExamModal = () => examModal.classList.remove('active');
  examModalClose.addEventListener('click', closeExamModal);
  examModalCancel.addEventListener('click', closeExamModal);

  // Submit Exam Form
  examForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('exam-title-input').value.trim();
    const subject = document.getElementById('exam-subject-input').value.trim();
    const description = document.getElementById('exam-desc-input').value.trim();
    const duration_minutes = parseInt(document.getElementById('exam-duration-input').value, 10);
    const passing_marks = parseInt(document.getElementById('exam-marks-input').value, 10);

    const res = await apiFetch('/api/admin/exams', {
      method: 'POST',
      body: JSON.stringify({ title, subject, description, duration_minutes, passing_marks })
    });

    if (res.success) {
      showToast('Exam created successfully!', 'success');
      closeExamModal();
      await loadDashboardData();
    } else {
      showToast(res.message || 'Failed to create exam.', 'danger');
    }
  });
}

// Prefill and Open Edit Question Modal
function openEditQuestionModal(qId) {
  const q = cachedQuestions.find(item => item.id === qId);
  if (!q) return;

  document.getElementById('question-modal-title').textContent = `Edit Question #Q-${q.id}`;
  document.getElementById('q-edit-id').value = q.id;
  document.getElementById('q-modal-exam').value = q.exam_id;
  document.getElementById('q-modal-text').value = q.question_text;
  document.getElementById('q-modal-category').value = q.category || '';
  document.getElementById('q-modal-marks').value = q.marks || 5;
  document.getElementById('q-modal-explanation').value = q.explanation || '';

  // Options
  for (let i = 0; i < 4; i++) {
    const optInput = document.getElementById(`q-opt-${i}`);
    const optData = q.options[i];
    if (optInput && optData) {
      optInput.value = optData.option_text;
      if (optData.is_correct) {
        const radio = document.querySelector(`input[name="correct-option-radio"][value="${i}"]`);
        if (radio) radio.checked = true;
      }
    }
  }

  document.getElementById('question-modal').classList.add('active');
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
