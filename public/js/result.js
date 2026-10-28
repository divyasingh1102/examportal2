// public/js/result.js
import { apiFetch, requireAuth, initNavbar, showToast } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;
  initNavbar();

  const urlParams = new URLSearchParams(window.location.search);
  const attemptId = urlParams.get('attemptId');
  const autoType = urlParams.get('auto');

  if (!attemptId) {
    showToast('No attempt ID provided. Returning to dashboard.', 'danger');
    setTimeout(() => window.location.href = '/dashboard.html', 1500);
    return;
  }

  // Handle immediate visual banner if coming straight from auto-submit
  if (autoType === 'tab_violation') {
    document.getElementById('violation-banner').style.display = 'flex';
  } else if (autoType === 'timeout') {
    document.getElementById('timeout-banner').style.display = 'flex';
  }

  await loadResultData(attemptId);
});

async function loadResultData(attemptId) {
  const res = await apiFetch(`/api/attempts/${attemptId}/result`);

  if (!res.success) {
    showToast(res.message || 'Failed to load attempt result.', 'danger');
    document.getElementById('questions-review-container').innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem; color: #f87171;">
        Failed to load score data. Please verify your attempt ID or return to the dashboard.
      </div>
    `;
    return;
  }

  const { attempt, violations, review } = res;

  // Render Alert Banners
  if (attempt.submissionType === 'tab_violation' || attempt.violations >= 3) {
    document.getElementById('violation-banner').style.display = 'flex';
  } else if (attempt.submissionType === 'timeout') {
    document.getElementById('timeout-banner').style.display = 'flex';
  }

  // Header and Scores
  document.getElementById('result-exam-title').textContent = attempt.examTitle || 'Exam Report';
  document.getElementById('result-subject-badge').textContent = attempt.subject || 'Assessment';
  document.getElementById('result-score-val').textContent = attempt.score;
  document.getElementById('result-total-val').textContent = `/ ${attempt.totalMarks}`;
  document.getElementById('result-percent-val').textContent = `(${attempt.percentage}%)`;

  // Badges
  const passBadge = document.getElementById('result-pass-badge');
  if (attempt.passed) {
    passBadge.className = 'badge badge-success';
    passBadge.textContent = 'Passed ✅';
  } else {
    passBadge.className = 'badge badge-danger';
    passBadge.textContent = 'Needs Improvement ⚠️';
  }

  const subBadge = document.getElementById('result-submission-badge');
  if (attempt.submissionType === 'tab_violation') {
    subBadge.className = 'badge badge-danger';
    subBadge.textContent = 'Terminated (Tab Violation)';
  } else if (attempt.submissionType === 'timeout') {
    subBadge.className = 'badge badge-warning';
    subBadge.textContent = 'Auto-Submitted (Timeout)';
  } else {
    subBadge.className = 'badge badge-primary';
    subBadge.textContent = 'Manual Submission';
  }

  // KPIs
  let correctCount = 0;
  let incorrectCount = 0;
  review.forEach(item => {
    if (item.isCorrect) correctCount++;
    else incorrectCount++;
  });

  document.getElementById('kpi-correct').textContent = correctCount;
  document.getElementById('kpi-incorrect').textContent = incorrectCount;
  document.getElementById('kpi-accuracy').textContent = `${attempt.percentage}%`;
  document.getElementById('kpi-violations').textContent = `${attempt.violations || 0} / 3`;

  // Render Questions Review
  renderReviewList(review);
}

function renderReviewList(review) {
  const container = document.getElementById('questions-review-container');

  if (!review || review.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        No detailed question responses recorded for this attempt.
      </div>
    `;
    return;
  }

  container.innerHTML = review.map(q => {
    const isCorrect = q.isCorrect;
    const cardClass = isCorrect ? 'correct' : 'incorrect';

    return `
      <div class="review-card ${cardClass}">
        <div class="review-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="question-number-badge">Question ${q.number}</span>
            <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
              ${isCorrect ? '✓ Correct (+ ' + q.marksAwarded + ' pts)' : '✕ Incorrect (0 pts)'}
            </span>
            <span class="badge badge-primary">${escapeHtml(q.category || 'General')}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-dim); font-weight: 600;">
            Max: ${q.marks} Pts
          </div>
        </div>

        <h3 class="review-question-text">${escapeHtml(q.questionText)}</h3>

        <!-- Options Breakdown -->
        <div class="review-options-list">
          ${q.options.map((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isStudentChoice = opt.id === q.selectedOptionId;
            const isCorrectOption = opt.isCorrect;

            let optStyleClass = 'neutral';
            let statusTag = '';

            if (isStudentChoice && isCorrectOption) {
              optStyleClass = 'chosen-correct';
              statusTag = ' (Your Answer ✓)';
            } else if (isStudentChoice && !isCorrectOption) {
              optStyleClass = 'chosen-incorrect';
              statusTag = ' (Your Answer ✕)';
            } else if (isCorrectOption) {
              optStyleClass = 'correct-answer-key';
              statusTag = ' (Correct Key ✓)';
            }

            return `
              <div class="review-option-item ${optStyleClass}">
                <strong style="width: 24px;">${letter}.</strong>
                <span style="flex: 1;">${escapeHtml(opt.text)}</span>
                <span style="font-size: 0.8rem; font-weight: 600;">${statusTag}</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Explanation -->
        ${q.explanation ? `
          <div class="explanation-box">
            <strong>💡 Explanation:</strong> ${escapeHtml(q.explanation)}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
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
