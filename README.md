# ⚡ ExamPulse — Online Exam Portal

A full-stack timed MCQ assessment and anti-cheat examination portal built from scratch for hackathon evaluation. Features automated server-side grading, dynamic question & option shuffling, live Page Visibility tab-switch monitoring with 3-strike auto-submission, instant score breakdowns, and an admin dashboard with Chart.js analytics.

---

## 🛠️ Tech Stack (Strict Compliance)

- **Backend**: Node.js + Express (ES Modules)
- **Database**: MySQL (using `mysql2` with parameterized queries)
- **Frontend**: Plain HTML5, Modern Responsive CSS3, Vanilla JavaScript (Zero front-end frameworks)
- **Charts**: Chart.js (loaded via CDN)
- **Proctoring / Anti-Cheat**: Browser Page Visibility API (`document.visibilitychange` + `window.onblur`)
- **Rule Adherence**: Strictly **NO** Google Forms, Quizizz, or third-party quiz plugins. All quiz and shuffling logic written entirely from scratch.

---

## 🌟 Core Features & "Harder Twist" Implementations

### 1. 🔀 Shuffling (Both Questions AND Options)
- For every unique student attempt, questions are shuffled using the **Fisher-Yates** randomization algorithm.
- Options for **every single question** are shuffled independently.
- The student's specific shuffled sequence is serialized and stored in the database (`question_order` and `option_order` in the `attempts` table) so server grading maps directly back to the original answer keys.
- **Security**: The correct answer key (`is_correct`) is **NEVER** sent to the client browser during the examination.

### 2. 🛡️ Tab-Switch Detection (3-Strike Auto-Submission)
- Continuously monitors browser state using the **Page Visibility API** (`visibilitychange`) and window focus (`blur`).
- **1st Tab Switch**: Logs violation to server, renders warning modal: `⚠️ Warning 1 of 2: Security Violation Detected`.
- **2nd Tab Switch**: Logs violation to server, renders critical warning modal: `🚨 Final Warning 2 of 2: Immediate Submission Risk`.
- **3rd Tab Switch**: The test **immediately terminates and auto-submits** current responses. Redirects to the result report with a prominent auto-submission notice.
- **Server-Side Source of Truth**: Violations are posted to `POST /api/attempts/:id/violation` and recorded in the database, so refreshing the page **cannot** reset the violation count.

### 3. ⏱️ Server-Enforced Live Timer
- Live countdown displayed in a sticky proctor header with visual warnings (< 2 minutes turns warning red).
- Enforced on the **server**: start time is recorded at session initialization; late submissions are automatically capped or auto-closed.

### 4. 📊 Instant Score & Question Review
- Real-time server-side grading upon submission.
- Instant score card, percentage, pass/fail status, and breakdown.
- Detailed question review comparing the student's selected choice with the correct answer key, complete with verified explanations.

### 5. 📈 Admin Dashboard & Analytics
- **KPI Summary Cards**: Total Exams, Enrolled Students, Submissions, Global Average Score, Flagged Attempts.
- **Chart.js Bar Chart**: **Per-Question Accuracy (% of students who answered correctly)** with dynamic color coding.
- **Chart.js Bar Chart**: **Average Score across all assessments**.
- **Attempts Monitoring Table**: Student name, score, time taken, tab violations (flagged), and auto-submitted status.
- **Question Bank CRUD**: Admin can add, edit, and delete questions with 4 options, designate correct options, assign subject/category tags, and set marks.

---

## 🚀 Quick Setup Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node 20 / 22 / 24)
- **MySQL Server** (optional for live pool; fallback embedded store is built-in for instant zero-dependency testing)

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Configuration (.env)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your MySQL credentials in `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=exam_portal
JWT_SECRET=super_secure_exam_portal_secret_key_2026_jwt
```

### 4. Run Database Schema & Seed Data
You can import the SQL files directly using MySQL CLI or Workbench:
```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```
*Or run the automated helper:*
```bash
npm run seed
```

> **Note for Evaluators:** If MySQL is not running on your machine, `server/db.js` automatically activates the built-in resilient relational store with pre-seeded data, so `npm start` works out of the box with zero external dependencies!

### 5. Start the Server
```bash
npm start
```
Open your browser and navigate to:
👉 **`http://localhost:5000`** (or `http://localhost:5000/login.html`)

---

## 🔑 Demo Credentials

| Role | Email | Password | Quick 1-Click Access |
|---|---|---|---|
| **Admin / Proctor** | `admin@portal.com` | `admin123` | Click **"🛡️ Admin Demo"** on login |
| **Student 1** | `student1@portal.com` | `student123` | Click **"👤 Student Demo"** on login |
| **Student 2** | `student2@portal.com` | `student123` | Input credentials |

---

## 🧪 Short Test Checklist for Judges

### Test 1: Tab-Switch Detection & 3-Strike Auto-Submission Flow
1. Log in as a student (or click **"👤 Student Demo"**).
2. Click **"Start Assessment"** on *Full-Stack Web Engineering & Node.js*.
3. Click another browser tab or switch to another window.
4. Return to the test tab:
   - Notice **`⚠️ Warning 1 of 2: Security Violation Detected`** modal appears.
   - The proctor banner updates to **`Violations: 1 / 3`** with the first dot illuminated.
5. Dismiss the modal and switch tabs a second time:
   - Notice **`🚨 Final Warning 2 of 2`** modal appears with alert styling.
   - Violation meter reads **`Violations: 2 / 3`**.
6. Switch tabs a **3rd time**:
   - The test **immediately auto-submits** and terminates.
   - You are redirected to `result.html` displaying the red banner:
     **`Exam Auto-Submitted: Maximum Tab-Switch Violations (3/3) Exceeded`**.
   - Your score is computed instantly based on answers submitted prior to disqualification.

### Test 2: Dynamic Shuffling Verification
1. Open the exam in one browser window as `student1@portal.com`.
2. Inspect the first question and option letters (A, B, C, D).
3. Open an Incognito / private window and sign in as `student2@portal.com`.
4. Start the same exam:
   - Notice that the **question sequence is completely different**.
   - The **options inside each question are also shuffled**.
5. Check browser DevTools network responses: `is_correct` is absent from question payloads.

### Test 3: Admin Dashboard & Question Bank CRUD
1. Log in as Admin (`admin@portal.com` / `admin123`).
2. Verify **Chart.js Per-Question Accuracy** bar chart showing % of students answering each question correctly.
3. Verify **Average Score across Exams** bar chart.
4. Review the **Student Attempts & Tab Violations** table showing time taken and auto-submitted tags.
5. Click **"+ Add MCQ Question"**:
   - Enter question text, fill 4 options, and select the radio button for the correct key.
   - Save and observe the question bank table update dynamically.
   - Try editing or deleting a question.

---

## 📁 Project Structure

```
├── schema.sql                 # MySQL schema (users, exams, questions, options, attempts, answers)
├── seed.sql                   # Demo seed data (Admin, Students, 10+ questions, attempts)
├── .env.example               # Environment variables template
├── package.json               # Node.js project manifest
├── README.md                  # Documentation and testing checklist
├── server/
│   ├── app.js                 # Express application & API route definitions
│   ├── db.js                  # MySQL pool connection + resilient relational fallback
│   ├── seedRunner.js          # DB setup and migration script
│   ├── controllers/
│   │   ├── authController.js  # Login, registration & JWT authentication
│   │   ├── examController.js  # Shuffling, server timer, tab violations, grading
│   │   └── adminController.js # Analytics, Chart.js metrics, Question Bank CRUD
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role authorization
│   └── routes/
│       ├── authRoutes.js      # /api/auth routes
│       ├── examRoutes.js      # /api/exams routes
│       └── adminRoutes.js     # /api/admin routes
└── public/
    ├── login.html             # Login & register with 1-click evaluator demo buttons
    ├── dashboard.html         # Student portal: available exams & attempt history
    ├── exam.html              # Timed exam room: navigator, sticky timer, anti-cheat modals
    ├── result.html            # Instant score card, violation badges, review & explanations
    ├── admin.html             # Admin analytics, Chart.js charts, Question Bank CRUD
    ├── css/
    │   └── style.css          # Responsive academic styling & theme
    └── js/
        ├── api.js             # API fetch client & session management
        ├── auth.js            # Auth form handling
        ├── dashboard.js       # Exam list & instructions modal
        ├── exam.js            # Shuffling, timer, Page Visibility detection
        ├── result.js          # Score breakdown & question review
        └── admin.js           # Chart.js graphs & question bank manager
```
