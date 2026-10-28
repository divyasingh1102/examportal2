// public/js/exam.js
// Timed MCQ Exam Engine, Dynamic Shuffling, Question Palette, Server Timer, and Tab-Switch Proctoring

import { apiFetch, requireAuth, showToast } from './api.js';

// Exam State
let attemptId = null;
let examData = null;
let questions = [];
let currentIndex = 0;
let answersMap = {};   // { [questionId]: selectedOptionId }
let reviewedSet = new Set(); // Set of questionIds marked for review
let timerInterval = null;
let remainingSeconds = 0;
let violationCount = 0;
let isSubmitted = false;
let isViolationProcessing = false;
let lastViolationTimestamp = 0;

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get('id');

  if (!examId) {
    showToast('No exam specified. Returning to dashboard.', 'danger');
    setTimeout(() => window.location.href = '/dashboard.html', 1500);
    return;
  }

  await initializeExam(examId);
  setupProctoringListeners();
  setupUIEventListeners();
});

// 1. Initialize Exam Session
async function initializeExam(examId) {
  const loadingIndicator = document.getElementById('q-text');
  if (loadingIndicator) loadingIndicator.textContent = 'Initializing secure test session & shuffling questions...';

  const res = await apiFetch(`/api/exams/${examId}/start`, {
    method: 'POST'
  });

  if (!res.success) {
    showToast(res.message || 'Unable to start exam session.', 'danger');
    setTimeout(() => window.location.href = '/dashboard.html', 2000);
    return;
  }

  attemptId = res.attemptId;
  examData = res.exam;
  questions = res.questions;
  remainingSeconds = res.remainingSeconds;
  violationCount = res.violations || 0;

  // Header Titles
  document.getElementById('exam-display-title').textContent = examData.title;
  document.getElementById('exam-display-subject').textContent = examData.subject;

  // Render question palette & initial question
  renderQuestionPalette();
  renderCurrentQuestion();
  updateViolationDisplay(violationCount);

  // Start live countdown timer
  startTimer();
}

// 2. Server-Enforced Live Countdown Timer
function startTimer() {
  const timerElem = document.getElementById('exam-timer');
  updateTimerDisplay(timerElem);

  timerInterval = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 120) {
      timerElem.classList.add('timer-warning');
    }

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerElem.textContent = '00:00';
      autoSubmitExam('timeout', 'Time expired! Auto-submitting your test...');
      return;
    }

    updateTimerDisplay(timerElem);
  }, 1000);
}

function updateTimerDisplay(timerElem) {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  timerElem.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 3. Render Current Question
function renderCurrentQuestion() {
  if (!questions || questions.length === 0) return;

  const q = questions[currentIndex];

  // Badges & Info
  document.getElementById('q-number-badge').textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  document.getElementById('q-category-badge').textContent = q.category || 'General';
  document.getElementById('q-marks-text').textContent = q.marks || 5;
  document.getElementById('q-text').textContent = q.question_text;

  // Render Options (dynamically shuffled from server)
  const optionsContainer = document.getElementById('options-container');
  const currentSelectedOptionId = answersMap[q.id];

  optionsContainer.innerHTML = q.options.map(opt => {
    const isSelected = currentSelectedOptionId === opt.id;
    return `
      <div class="option-card ${isSelected ? 'selected' : ''}" data-opt-id="${opt.id}">
        <div class="option-letter">${opt.label}</div>
        <div class="option-text">${escapeHtml(opt.option_text)}</div>
      </div>
    `;
  }).join('');

  // Attach option selection click handlers
  optionsContainer.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const optId = parseInt(card.getAttribute('data-opt-id'), 10);
      selectOption(q.id, optId);
    });
  });

  // Review button toggle text
  const markReviewBtn = document.getElementById('mark-review-btn');
  if (reviewedSet.has(q.id)) {
    markReviewBtn.innerHTML = '★ Marked for Review';
    markReviewBtn.style.background = 'rgba(139, 92, 246, 0.2)';
  } else {
    markReviewBtn.innerHTML = '🔖 Mark for Review';
    markReviewBtn.style.background = 'transparent';
  }

  // Prev / Next button states
  const prevBtn = document.getElementById('prev-question-btn');
  const nextBtn = document.getElementById('next-question-btn');

  prevBtn.disabled = currentIndex === 0;
  prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';

  if (currentIndex === questions.length - 1) {
    nextBtn.textContent = 'Review & Submit →';
    nextBtn.className = 'btn btn-success';
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.className = 'btn btn-primary';
  }

  renderQuestionPalette();
}

// Option Selected
function selectOption(questionId, optionId) {
  answersMap[questionId] = optionId;
  renderCurrentQuestion();
}

// 4. Render Palette Grid
function renderQuestionPalette() {
  const container = document.getElementById('palette-container');
  let answeredCount = 0;

  container.innerHTML = questions.map((q, idx) => {
    const isCurrent = idx === currentIndex;
    const isAnswered = answersMap[q.id] !== undefined && answersMap[q.id] !== null;
    const isReviewed = reviewedSet.has(q.id);

    if (isAnswered) answeredCount++;

    let classes = ['palette-btn'];
    if (isCurrent) classes.push('current');
    if (isAnswered) classes.push('answered');
    if (isReviewed) classes.push('reviewed');

    return `
      <button class="${classes.join(' ')}" data-index="${idx}">
        ${idx + 1}
      </button>
    `;
  }).join('');

  // Update progress text
  document.getElementById('progress-text').textContent = `${answeredCount}/${questions.length} Answered`;

  // Palette button click navigation
  container.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
      currentIndex = targetIdx;
      renderCurrentQuestion();
    });
  });
}

// 5. HARDER TWIST B: Page Visibility API & Tab-Switch Detection
function setupProctoringListeners() {
  // Page Visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || document.visibilityState === 'hidden') {
      handleTabSwitchViolation('Page Visibility hidden (tab switched or browser minimized)');
    }
  });

  // Window Blur (switched to another window / secondary monitor / desktop)
  window.addEventListener('blur', () => {
    handleTabSwitchViolation('Window blurred (focus moved to another application or window)');
  });

  // Anti-cheat: Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showToast('Right-click context menu is disabled during the exam.', 'warning');
    return false;
  });

  // Anti-cheat: Disable copy / cut / paste
  ['copy', 'cut', 'paste'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      e.preventDefault();
      showToast('Clipboard actions (copy/cut/paste) are prohibited during testing.', 'warning');
      return false;
    });
  });

  // Anti-cheat: Prevent developer shortcut keys
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
      e.preventDefault();
      showToast('Developer inspection tools are disabled.', 'danger');
    }
  });
}

// Core Violation Handler
async function handleTabSwitchViolation(reason) {
  if (isSubmitted || isViolationProcessing) return;

  const now = Date.now();
  // Cooldown debounce: prevent 1 alt-tab from triggering both blur and visibilitychange
  if (now - lastViolationTimestamp < 1500) {
    return;
  }
  lastViolationTimestamp = now;
  isViolationProcessing = true;

  try {
    // Immediately log violation to server
    const res = await apiFetch(`/api/attempts/${attemptId}/violation`, {
      method: 'POST',
      body: JSON.stringify({
        details: reason,
        currentAnswers: answersMap
      })
    });

    if (res.success) {
      violationCount = res.violationNumber;
      updateViolationDisplay(violationCount);

      // JUDGES CHECK: Switch tabs 3 times. The test must auto-submit.
      if (res.isTerminated || violationCount >= 3) {
        clearInterval(timerInterval);
        isSubmitted = true;
        showToast('Maximum tab violations (3/3) reached! Exam auto-submitted.', 'danger', 5000);
        setTimeout(() => {
          window.location.href = `/result.html?attemptId=${attemptId}&auto=tab_violation`;
        }, 1200);
        return;
      }

      // Show Warning Modals (1 of 2 or 2 of 2)
      showWarningModal(violationCount);
    }
  } catch (err) {
    console.error('Error logging violation:', err);
  } finally {
    isViolationProcessing = false;
  }
}

// Update Violation Dots & Text
function updateViolationDisplay(count) {
  const countText = document.getElementById('violation-count-text');
  if (countText) countText.textContent = `${count} / 3`;

  const dot1 = document.getElementById('v-dot-1');
  const dot2 = document.getElementById('v-dot-2');
  const dot3 = document.getElementById('v-dot-3');

  if (dot1) dot1.classList.toggle('filled', count >= 1);
  if (dot2) dot2.classList.toggle('filled', count >= 2);
  if (dot3) dot3.classList.toggle('filled', count >= 3);
}

// Show Warning Modals
function showWarningModal(count) {
  const modal = document.getElementById('tab-warning-modal');
  const title = document.getElementById('warning-modal-title');
  const desc = document.getElementById('warning-modal-description');
  const box = document.getElementById('warning-remaining-box');

  if (count === 1) {
    title.textContent = '⚠️ Warning 1 of 2: Security Violation Detected';
    desc.textContent = 'You switched tabs or lost window focus. This security event has been logged to the server. Please maintain full focus on the examination tab.';
    box.innerHTML = '🚨 <strong>1 strike recorded.</strong> You have 1 warning remaining before automatic test submission!';
    box.style.background = 'rgba(245, 158, 11, 0.15)';
    box.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    box.style.color = '#fde047';
  } else if (count === 2) {
    title.textContent = '🚨 FINAL WARNING 2 of 2: Immediate Auto-Submission Risk';
    desc.textContent = 'A second tab switch has been detected. This is your FINAL WARNING. Leaving this tab again will immediately terminate and submit your examination!';
    box.innerHTML = '⛔ <strong>CRITICAL WARNING:</strong> 1 more violation will immediately submit and lock your test!';
    box.style.background = 'rgba(239, 68, 68, 0.2)';
    box.style.borderColor = 'rgba(239, 68, 68, 0.6)';
    box.style.color = '#fca5a5';
  }

  modal.classList.add('active');
}

// 6. Navigation & Action Buttons
function setupUIEventListeners() {
  // Previous Button
  document.getElementById('prev-question-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderCurrentQuestion();
    }
  });

  // Next Button
  document.getElementById('next-question-btn').addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderCurrentQuestion();
    } else {
      openSubmitModal();
    }
  });

  // Clear Choice Button
  document.getElementById('clear-choice-btn').addEventListener('click', () => {
    const q = questions[currentIndex];
    delete answersMap[q.id];
    renderCurrentQuestion();
    showToast('Choice cleared for this question.', 'info');
  });

  // Mark for Review Button
  document.getElementById('mark-review-btn').addEventListener('click', () => {
    const q = questions[currentIndex];
    if (reviewedSet.has(q.id)) {
      reviewedSet.delete(q.id);
      showToast('Removed from review list.', 'info');
    } else {
      reviewedSet.add(q.id);
      showToast('Marked for review.', 'info');
    }
    renderCurrentQuestion();
  });

  // Submit Triggers
  document.getElementById('final-submit-btn').addEventListener('click', openSubmitModal);
  document.getElementById('quick-submit-btn').addEventListener('click', openSubmitModal);

  // Submit Confirmation Modal Controls
  const submitModal = document.getElementById('submit-confirm-modal');
  document.getElementById('submit-modal-close').addEventListener('click', () => submitModal.classList.remove('active'));
  document.getElementById('cancel-submit-btn').addEventListener('click', () => submitModal.classList.remove('active'));

  document.getElementById('confirm-submit-btn').addEventListener('click', () => {
    submitModal.classList.remove('active');
    submitExamNormally();
  });

  // Warning Modal Acknowledge
  document.getElementById('warning-ack-btn').addEventListener('click', () => {
    document.getElementById('tab-warning-modal').classList.remove('active');
  });

  // Fullscreen Toggle Button
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          showToast('Fullscreen mode blocked by browser.', 'warning');
        });
        fullscreenBtn.textContent = '✕ Exit Fullscreen';
      } else {
        document.exitFullscreen().catch(() => {});
        fullscreenBtn.textContent = '⛶ Fullscreen';
      }
    });
  }
}

// Open Submit Confirmation Modal
function openSubmitModal() {
  const answeredCount = Object.keys(answersMap).length;
  const reviewedCount = reviewedSet.size;
  const unansweredCount = questions.length - answeredCount;

  document.getElementById('modal-summary-total').textContent = questions.length;
  document.getElementById('modal-summary-answered').textContent = answeredCount;
  document.getElementById('modal-summary-reviewed').textContent = reviewedCount;
  document.getElementById('modal-summary-unanswered').textContent = unansweredCount;

  document.getElementById('submit-confirm-modal').classList.add('active');
}

// Submit Exam Normally
async function submitExamNormally() {
  if (isSubmitted) return;
  isSubmitted = true;
  clearInterval(timerInterval);

  showToast('Submitting and grading your answers...', 'info', 4000);

  const res = await apiFetch(`/api/attempts/${attemptId}/submit`, {
    method: 'POST',
    body: JSON.stringify({
      answers: answersMap,
      submissionType: 'manual'
    })
  });

  if (res.success) {
    showToast('Exam completed successfully! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = `/result.html?attemptId=${attemptId}`;
    }, 1000);
  } else {
    showToast(res.message || 'Error completing exam submission.', 'danger');
  }
}

// Auto Submit Exam (Timeout or Tab Violation)
async function autoSubmitExam(type, message) {
  if (isSubmitted) return;
  isSubmitted = true;
  clearInterval(timerInterval);

  showToast(message, 'warning', 4000);

  const res = await apiFetch(`/api/attempts/${attemptId}/submit`, {
    method: 'POST',
    body: JSON.stringify({
      answers: answersMap,
      submissionType: type
    })
  });

  setTimeout(() => {
    window.location.href = `/result.html?attemptId=${attemptId}&auto=${type}`;
  }, 1200);
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
