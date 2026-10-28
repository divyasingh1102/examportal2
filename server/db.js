// server/db.js
// Handles MySQL connection pool using mysql2/promise with parameterized queries.
// Includes transparent embedded relational fallback engine for zero-config offline/sandbox demoing.

import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'exam_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// In-Memory Relational Database Store
export const memoryStore = {
  users: [
    { id: 1, name: 'System Administrator', email: 'admin@portal.com', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'admin', created_at: new Date('2026-10-01') },
    { id: 2, name: 'Alex Turner', email: 'student1@portal.com', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'student', created_at: new Date('2026-10-02') },
    { id: 3, name: 'Sarah Connor', email: 'student2@portal.com', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'student', created_at: new Date('2026-10-03') },
    // Backward compatibility aliases
    { id: 4, name: 'Admin Backup', email: 'admin@examportal.com', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'admin', created_at: new Date('2026-10-01') },
    { id: 5, name: 'Student Backup', email: 'student@examportal.com', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'student', created_at: new Date('2026-10-02') }
  ],
  exams: [
    {
      id: 1,
      title: 'Full-Stack Web Engineering & Node.js',
      subject: 'Computer Science',
      description: 'Comprehensive evaluation of Node.js event loop, asynchronous non-blocking I/O, RESTful status codes, browser Page Visibility API, and security.',
      duration_minutes: 10,
      total_marks: 50,
      passing_marks: 20,
      max_violations: 3,
      is_active: 1,
      shuffle_questions: 1,
      shuffle_options: 1,
      created_at: new Date('2026-10-10')
    },
    {
      id: 2,
      title: 'Relational Database Architecture & MySQL',
      subject: 'Database Systems',
      description: 'Assessment of SQL indexing, ACID properties, query joins, transactions, and relational schema normalization.',
      duration_minutes: 15,
      total_marks: 50,
      passing_marks: 20,
      max_violations: 3,
      is_active: 1,
      shuffle_questions: 1,
      shuffle_options: 1,
      created_at: new Date('2026-10-12')
    },
    {
      id: 3,
      title: 'Data Structures & Algorithmic Complexity',
      subject: 'Algorithms',
      description: 'Evaluation of asymptotic runtime analysis, complete binary trees, graph traversals, and dynamic programming.',
      duration_minutes: 12,
      total_marks: 50,
      passing_marks: 25,
      max_violations: 3,
      is_active: 1,
      shuffle_questions: 1,
      shuffle_options: 1,
      created_at: new Date('2026-10-15')
    }
  ],
  questions: [
    { id: 1, exam_id: 1, question_text: 'In Node.js, which multi-platform C library is responsible for providing the non-blocking event loop, thread pool, and asynchronous I/O?', category: 'Node.js Internals', difficulty: 'medium', marks: 5, explanation: 'libuv is the multi-platform support library written in C that handles the event loop and asynchronous operations in Node.js.' },
    { id: 2, exam_id: 1, question_text: 'Which HTTP status code should a REST API return when a request lacks valid authentication credentials?', category: 'REST APIs', difficulty: 'easy', marks: 5, explanation: 'HTTP 401 Unauthorized indicates that the request has not been applied because it lacks valid authentication credentials.' },
    { id: 3, exam_id: 1, question_text: 'Which browser API enables web applications to detect when a tab becomes inactive or minimized by the user?', category: 'Browser APIs', difficulty: 'medium', marks: 5, explanation: 'The Page Visibility API provides the document.visibilityState property and fires the visibilitychange event when the user switches tabs.' },
    { id: 4, exam_id: 1, question_text: 'What is the average time complexity for searching a key in a standard JavaScript Map (Hash Table)?', category: 'Data Structures', difficulty: 'easy', marks: 5, explanation: 'Hash tables provide an average time complexity of O(1) for lookup, insertion, and deletion.' },
    { id: 5, exam_id: 1, question_text: 'Why is bcrypt preferred over raw SHA-256 for storing user passwords in database tables?', category: 'Security', difficulty: 'medium', marks: 5, explanation: 'bcrypt incorporates a configurable work factor (key derivation iterations) and automatic cryptographic salting to resist brute-force and rainbow table attacks.' },
    { id: 6, exam_id: 1, question_text: 'In Express.js, what must a custom middleware function call to pass control to the next middleware in the execution stack?', category: 'Express.js', difficulty: 'easy', marks: 5, explanation: 'Calling the next() function passes control to the next matching middleware layer or route handler.' },
    { id: 7, exam_id: 1, question_text: 'Which database isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?', category: 'Databases', difficulty: 'hard', marks: 5, explanation: 'Serializable is the highest transaction isolation level, preventing dirty reads, non-repeatable reads, and phantom reads.' },
    { id: 8, exam_id: 1, question_text: 'Which data structure does Breadth-First Search (BFS) utilize during graph exploration?', category: 'Algorithms', difficulty: 'easy', marks: 5, explanation: 'BFS explores nodes level-by-level using a First-In-First-Out (FIFO) Queue.' },
    { id: 9, exam_id: 1, question_text: 'In standard SQL, how does the HAVING clause differ functionally from the WHERE clause?', category: 'SQL Querying', difficulty: 'medium', marks: 5, explanation: 'WHERE filters rows before aggregation occurs, whereas HAVING filters aggregated grouped rows produced by GROUP BY.' },
    { id: 10, exam_id: 1, question_text: 'What is the height of a balanced Complete Binary Tree containing N nodes?', category: 'Data Structures', difficulty: 'medium', marks: 5, explanation: 'The height of a balanced complete binary tree with N nodes is ⌊log₂ N⌋.' },

    // Additional questions for Exam 2
    { id: 11, exam_id: 2, question_text: 'Which normal form requires eliminating repeating groups and ensuring atomicity of every attribute column?', category: 'Normalization', difficulty: 'easy', marks: 10, explanation: 'First Normal Form (1NF) mandates atomic attributes with no repeating groups or composite columns.' },
    { id: 12, exam_id: 2, question_text: 'What type of index is most commonly implemented by default in MySQL InnoDB storage engine for B-Tree storage?', category: 'Indexing', difficulty: 'medium', marks: 10, explanation: 'InnoDB uses B+Tree structures for clustered primary key and secondary indexes.' },
    { id: 13, exam_id: 2, question_text: 'Which property of ACID transactions guarantees that database changes persist even in the event of a system crash?', category: 'ACID Properties', difficulty: 'easy', marks: 10, explanation: 'Durability ensures that committed transactions survive subsequent failures.' },
    { id: 14, exam_id: 2, question_text: 'What is the purpose of an EXPLAIN statement in MySQL queries?', category: 'Optimization', difficulty: 'medium', marks: 10, explanation: 'EXPLAIN displays the execution plan chosen by the MySQL query optimizer, including indexes used and rows examined.' },
    { id: 15, exam_id: 2, question_text: 'Which type of JOIN returns all records from the left table and matched records from the right table?', category: 'SQL Querying', difficulty: 'easy', marks: 10, explanation: 'LEFT OUTER JOIN returns all rows from the left table and matched rows from the right table.' }
  ],
  options: [
    // Question 1
    { id: 1, question_id: 1, option_text: 'libuv', is_correct: 1, option_order: 1 },
    { id: 2, question_id: 1, option_text: 'V8 JavaScript Engine', is_correct: 0, option_order: 2 },
    { id: 3, question_id: 1, option_text: 'OpenSSL Native Wrapper', is_correct: 0, option_order: 3 },
    { id: 4, question_id: 1, option_text: 'npm Package Manager', is_correct: 0, option_order: 4 },

    // Question 2
    { id: 5, question_id: 2, option_text: '401 Unauthorized', is_correct: 1, option_order: 1 },
    { id: 6, question_id: 2, option_text: '403 Forbidden', is_correct: 0, option_order: 2 },
    { id: 7, question_id: 2, option_text: '404 Not Found', is_correct: 0, option_order: 3 },
    { id: 8, question_id: 2, option_text: '400 Bad Request', is_correct: 0, option_order: 4 },

    // Question 3
    { id: 9, question_id: 3, option_text: 'Page Visibility API', is_correct: 1, option_order: 1 },
    { id: 10, question_id: 3, option_text: 'Intersection Observer API', is_correct: 0, option_order: 2 },
    { id: 11, question_id: 3, option_text: 'Web Workers API', is_correct: 0, option_order: 3 },
    { id: 12, question_id: 3, option_text: 'Broadcast Channel API', is_correct: 0, option_order: 4 },

    // Question 4
    { id: 13, question_id: 4, option_text: 'O(1) Constant Time', is_correct: 1, option_order: 1 },
    { id: 14, question_id: 4, option_text: 'O(log N) Logarithmic Time', is_correct: 0, option_order: 2 },
    { id: 15, question_id: 4, option_text: 'O(N) Linear Time', is_correct: 0, option_order: 3 },
    { id: 16, question_id: 4, option_text: 'O(N²) Quadratic Time', is_correct: 0, option_order: 4 },

    // Question 5
    { id: 17, question_id: 5, option_text: 'It incorporates cryptographic salting and an adaptive computational work factor (cost)', is_correct: 1, option_order: 1 },
    { id: 18, question_id: 5, option_text: 'It encrypts passwords with symmetric two-way DES keys', is_correct: 0, option_order: 2 },
    { id: 19, question_id: 5, option_text: 'It applies Base64 encoding for compression', is_correct: 0, option_order: 3 },
    { id: 20, question_id: 5, option_text: 'It produces an 8-bit checksum value', is_correct: 0, option_order: 4 },

    // Question 6
    { id: 21, question_id: 6, option_text: 'next()', is_correct: 1, option_order: 1 },
    { id: 22, question_id: 6, option_text: 'res.continue()', is_correct: 0, option_order: 2 },
    { id: 23, question_id: 6, option_text: 'req.forward()', is_correct: 0, option_order: 3 },
    { id: 24, question_id: 6, option_text: 'return done()', is_correct: 0, option_order: 4 },

    // Question 7
    { id: 25, question_id: 7, option_text: 'Serializable', is_correct: 1, option_order: 1 },
    { id: 26, question_id: 7, option_text: 'Repeatable Read', is_correct: 0, option_order: 2 },
    { id: 27, question_id: 7, option_text: 'Read Committed', is_correct: 0, option_order: 3 },
    { id: 28, question_id: 7, option_text: 'Read Uncommitted', is_correct: 0, option_order: 4 },

    // Question 8
    { id: 29, question_id: 8, option_text: 'FIFO Queue', is_correct: 1, option_order: 1 },
    { id: 30, question_id: 8, option_text: 'LIFO Stack', is_correct: 0, option_order: 2 },
    { id: 31, question_id: 8, option_text: 'Priority Max-Heap', is_correct: 0, option_order: 3 },
    { id: 32, question_id: 8, option_text: 'Self-Balancing Red-Black Tree', is_correct: 0, option_order: 4 },

    // Question 9
    { id: 33, question_id: 9, option_text: 'WHERE filters rows prior to aggregation, while HAVING filters grouped results post-aggregation', is_correct: 1, option_order: 1 },
    { id: 34, question_id: 9, option_text: 'HAVING is only used for string comparisons, while WHERE handles numerical comparisons', is_correct: 0, option_order: 2 },
    { id: 35, question_id: 9, option_text: 'WHERE can only be used with JOINs, while HAVING is reserved for UNIONs', is_correct: 0, option_order: 3 },
    { id: 36, question_id: 9, option_text: 'There is no difference; they are interchangeable aliases', is_correct: 0, option_order: 4 },

    // Question 10
    { id: 37, question_id: 10, option_text: '⌊log₂ N⌋', is_correct: 1, option_order: 1 },
    { id: 38, question_id: 10, option_text: 'N / 2', is_correct: 0, option_order: 2 },
    { id: 39, question_id: 10, option_text: '2ᴺ', is_correct: 0, option_order: 3 },
    { id: 40, question_id: 10, option_text: 'N log N', is_correct: 0, option_order: 4 },

    // Exam 2 Options
    { id: 41, question_id: 11, option_text: 'First Normal Form (1NF)', is_correct: 1, option_order: 1 },
    { id: 42, question_id: 11, option_text: 'Second Normal Form (2NF)', is_correct: 0, option_order: 2 },
    { id: 43, question_id: 11, option_text: 'Third Normal Form (3NF)', is_correct: 0, option_order: 3 },
    { id: 44, question_id: 11, option_text: 'Boyce-Codd Normal Form (BCNF)', is_correct: 0, option_order: 4 },

    { id: 45, question_id: 12, option_text: 'B+Tree Index', is_correct: 1, option_order: 1 },
    { id: 46, question_id: 12, option_text: 'Hash Index', is_correct: 0, option_order: 2 },
    { id: 47, question_id: 12, option_text: 'R-Tree Index', is_correct: 0, option_order: 3 },
    { id: 48, question_id: 12, option_text: 'Bitmap Index', is_correct: 0, option_order: 4 },

    { id: 49, question_id: 13, option_text: 'Durability', is_correct: 1, option_order: 1 },
    { id: 50, question_id: 13, option_text: 'Atomicity', is_correct: 0, option_order: 2 },
    { id: 51, question_id: 13, option_text: 'Consistency', is_correct: 0, option_order: 3 },
    { id: 52, question_id: 13, option_text: 'Isolation', is_correct: 0, option_order: 4 },

    { id: 53, question_id: 14, option_text: 'Shows query execution plan, indexes used, and row estimates', is_correct: 1, option_order: 1 },
    { id: 54, question_id: 14, option_text: 'Formats SQL into human-readable text', is_correct: 0, option_order: 2 },
    { id: 55, question_id: 14, option_text: 'Checks for syntax errors without compiling', is_correct: 0, option_order: 3 },
    { id: 56, question_id: 14, option_text: 'Encrypts database tables during query execution', is_correct: 0, option_order: 4 },

    { id: 57, question_id: 15, option_text: 'LEFT OUTER JOIN', is_correct: 1, option_order: 1 },
    { id: 58, question_id: 15, option_text: 'INNER JOIN', is_correct: 0, option_order: 2 },
    { id: 59, question_id: 15, option_text: 'CROSS JOIN', is_correct: 0, option_order: 3 },
    { id: 60, question_id: 15, option_text: 'FULL JOIN', is_correct: 0, option_order: 4 }
  ],
  attempts: [
    {
      id: 1,
      user_id: 2,
      exam_id: 1,
      started_at: new Date(Date.now() - 2 * 86400000),
      submitted_at: new Date(Date.now() - 2 * 86400000 + 8 * 60000),
      violations: 0,
      auto_submitted: 0,
      submission_type: 'manual',
      score: 45,
      total_marks: 50,
      percentage: 90.0,
      status: 'completed',
      question_order: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      option_order: JSON.stringify({}),
      created_at: new Date(Date.now() - 2 * 86400000)
    },
    {
      id: 2,
      user_id: 3,
      exam_id: 1,
      started_at: new Date(Date.now() - 1 * 86400000),
      submitted_at: new Date(Date.now() - 1 * 86400000 + 9 * 60000),
      violations: 1,
      auto_submitted: 0,
      submission_type: 'manual',
      score: 40,
      total_marks: 50,
      percentage: 80.0,
      status: 'completed',
      question_order: JSON.stringify([2, 4, 1, 3, 5, 6, 8, 7, 10, 9]),
      option_order: JSON.stringify({}),
      created_at: new Date(Date.now() - 1 * 86400000)
    },
    {
      id: 3,
      user_id: 2,
      exam_id: 2,
      started_at: new Date(Date.now() - 12 * 3600000),
      submitted_at: new Date(Date.now() - 12 * 3600000 + 14 * 60000),
      violations: 0,
      auto_submitted: 0,
      submission_type: 'manual',
      score: 35,
      total_marks: 50,
      percentage: 70.0,
      status: 'completed',
      question_order: JSON.stringify([11, 12, 13, 14, 15]),
      option_order: JSON.stringify({}),
      created_at: new Date(Date.now() - 12 * 3600000)
    },
    {
      id: 4,
      user_id: 3,
      exam_id: 2,
      started_at: new Date(Date.now() - 6 * 3600000),
      submitted_at: new Date(Date.now() - 6 * 3600000 + 15 * 60000),
      violations: 0,
      auto_submitted: 1,
      submission_type: 'timeout',
      score: 30,
      total_marks: 50,
      percentage: 60.0,
      status: 'completed',
      question_order: JSON.stringify([11, 12, 13, 14, 15]),
      option_order: JSON.stringify({}),
      created_at: new Date(Date.now() - 6 * 3600000)
    },
    {
      id: 5,
      user_id: 2,
      exam_id: 1,
      started_at: new Date(Date.now() - 3 * 3600000),
      submitted_at: new Date(Date.now() - 3 * 3600000 + 4 * 60000),
      violations: 3,
      auto_submitted: 1,
      submission_type: 'tab_violation',
      score: 20,
      total_marks: 50,
      percentage: 40.0,
      status: 'completed',
      question_order: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      option_order: JSON.stringify({}),
      created_at: new Date(Date.now() - 3 * 3600000)
    }
  ],
  answers: [
    // Attempt 1
    { id: 1, attempt_id: 1, question_id: 1, selected_option_id: 1, is_correct: 1, marks_awarded: 5 },
    { id: 2, attempt_id: 1, question_id: 2, selected_option_id: 5, is_correct: 1, marks_awarded: 5 },
    { id: 3, attempt_id: 1, question_id: 3, selected_option_id: 9, is_correct: 1, marks_awarded: 5 },
    { id: 4, attempt_id: 1, question_id: 4, selected_option_id: 13, is_correct: 1, marks_awarded: 5 },
    { id: 5, attempt_id: 1, question_id: 5, selected_option_id: 17, is_correct: 1, marks_awarded: 5 },
    { id: 6, attempt_id: 1, question_id: 6, selected_option_id: 21, is_correct: 1, marks_awarded: 5 },
    { id: 7, attempt_id: 1, question_id: 7, selected_option_id: 25, is_correct: 1, marks_awarded: 5 },
    { id: 8, attempt_id: 1, question_id: 8, selected_option_id: 29, is_correct: 1, marks_awarded: 5 },
    { id: 9, attempt_id: 1, question_id: 9, selected_option_id: 33, is_correct: 1, marks_awarded: 5 },
    { id: 10, attempt_id: 1, question_id: 10, selected_option_id: 38, is_correct: 0, marks_awarded: 0 },

    // Attempt 2
    { id: 11, attempt_id: 2, question_id: 1, selected_option_id: 1, is_correct: 1, marks_awarded: 5 },
    { id: 12, attempt_id: 2, question_id: 2, selected_option_id: 5, is_correct: 1, marks_awarded: 5 },
    { id: 13, attempt_id: 2, question_id: 3, selected_option_id: 9, is_correct: 1, marks_awarded: 5 },
    { id: 14, attempt_id: 2, question_id: 4, selected_option_id: 13, is_correct: 1, marks_awarded: 5 },
    { id: 15, attempt_id: 2, question_id: 5, selected_option_id: 18, is_correct: 0, marks_awarded: 0 },
    { id: 16, attempt_id: 2, question_id: 6, selected_option_id: 21, is_correct: 1, marks_awarded: 5 },
    { id: 17, attempt_id: 2, question_id: 7, selected_option_id: 26, is_correct: 0, marks_awarded: 0 },
    { id: 18, attempt_id: 2, question_id: 8, selected_option_id: 29, is_correct: 1, marks_awarded: 5 },
    { id: 19, attempt_id: 2, question_id: 9, selected_option_id: 33, is_correct: 1, marks_awarded: 5 },
    { id: 20, attempt_id: 2, question_id: 10, selected_option_id: 37, is_correct: 1, marks_awarded: 5 },

    // Attempt 5 (Auto-submitted due to violations)
    { id: 21, attempt_id: 5, question_id: 1, selected_option_id: 1, is_correct: 1, marks_awarded: 5 },
    { id: 22, attempt_id: 5, question_id: 2, selected_option_id: 5, is_correct: 1, marks_awarded: 5 },
    { id: 23, attempt_id: 5, question_id: 3, selected_option_id: 9, is_correct: 1, marks_awarded: 5 },
    { id: 24, attempt_id: 5, question_id: 4, selected_option_id: 13, is_correct: 1, marks_awarded: 5 },
    { id: 25, attempt_id: 5, question_id: 5, selected_option_id: null, is_correct: 0, marks_awarded: 0 }
  ],
  tab_violations: [
    { id: 1, attempt_id: 5, user_id: 2, violation_number: 1, detected_at: new Date(Date.now() - 3 * 3600000 + 60000), details: 'Tab switched to external window (Warning 1/2)' },
    { id: 2, attempt_id: 5, user_id: 2, violation_number: 2, detected_at: new Date(Date.now() - 3 * 3600000 + 120000), details: 'Window focus lost / blurred (Warning 2/2)' },
    { id: 3, attempt_id: 5, user_id: 2, violation_number: 3, detected_at: new Date(Date.now() - 3 * 3600000 + 180000), details: 'Tab switched 3rd time - Automatic test submission triggered' },
    { id: 4, attempt_id: 2, user_id: 3, violation_number: 1, detected_at: new Date(Date.now() - 1 * 86400000 + 90000), details: 'Brief tab switch (Warning 1/2)' }
  ]
};

let mysqlPool = null;
let isUsingMySQL = false;

// Initialize Database Connection
export async function initializeDatabase() {
  try {
    const mysqlModule = await import('mysql2/promise').catch(() => null);
    if (mysqlModule) {
      const mysql = mysqlModule.default || mysqlModule;
      const testPool = mysql.createPool(dbConfig);

      const connection = await testPool.getConnection();
      await connection.ping();
      connection.release();

      mysqlPool = testPool;
      isUsingMySQL = true;
      console.log(`[Database] Connected to live MySQL at ${dbConfig.host}:${dbConfig.port} (${dbConfig.database})`);
      return;
    }
  } catch (err) {
    console.warn(`[Database] MySQL connection notice (${err.code || err.message}). Fallback to built-in relational engine active.`);
  }

  isUsingMySQL = false;
  console.log('[Database] System operating with built-in relational SQL engine. Ready for instant demoing.');
}

export function isConnectedToMySQL() {
  return isUsingMySQL;
}

export function getDbConfig() {
  return { ...dbConfig, isConnected: isUsingMySQL };
}

// Universal Query Executor
export async function query(sql, params = []) {
  if (isUsingMySQL && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query(sql, params);
      return rows;
    } catch (err) {
      console.error('[MySQL Query Error]', err.message, 'SQL:', sql);
      throw err;
    }
  }

  // Resilient memory relational engine
  return executeInMemoryQuery(sql, params);
}

export async function execute(sql, params = []) {
  return query(sql, params);
}

// Helper to attach options to questions in memory
function getQuestionWithOptions(q) {
  const opts = memoryStore.options.filter(o => o.question_id === q.id).sort((a, b) => a.option_order - b.option_order);
  return { ...q, options: opts };
}

// Resilient In-Memory Query Engine (handles parameterized SQL queries)
function executeInMemoryQuery(sql, params = []) {
  const norm = sql.trim().replace(/\s+/g, ' ');
  const upper = norm.toUpperCase();

  // 1. USERS
  if (upper.includes('FROM USERS') || upper.includes('FROM `USERS`')) {
    if (upper.includes('WHERE EMAIL = ?') || upper.includes('WHERE `EMAIL` = ?')) {
      const email = String(params[0]).toLowerCase();
      const match = memoryStore.users.find(u => u.email.toLowerCase() === email);
      return match ? [{ ...match }] : [];
    }
    if (upper.includes('WHERE ID = ?') || upper.includes('WHERE `ID` = ?')) {
      const id = parseInt(params[0], 10);
      const match = memoryStore.users.find(u => u.id === id);
      return match ? [{ ...match }] : [];
    }
    if (upper.includes('WHERE ROLE = ?') || upper.includes('WHERE `ROLE` = ?')) {
      const role = params[0];
      return memoryStore.users.filter(u => u.role === role).map(u => ({ ...u }));
    }
    return memoryStore.users.map(u => ({ ...u }));
  }

  if (upper.startsWith('INSERT INTO USERS') || upper.startsWith('INSERT INTO `USERS`')) {
    const newId = memoryStore.users.length ? Math.max(...memoryStore.users.map(u => u.id)) + 1 : 1;
    const user = {
      id: newId,
      name: params[0],
      email: params[1],
      password_hash: params[2],
      role: params[3] || 'student',
      created_at: new Date()
    };
    memoryStore.users.push(user);
    return { insertId: newId, affectedRows: 1 };
  }

  // 2. EXAMS
  if (upper.includes('FROM EXAMS') || upper.includes('FROM `EXAMS`')) {
    if (upper.includes('WHERE ID = ?') || upper.includes('WHERE `ID` = ?')) {
      const id = parseInt(params[0], 10);
      const match = memoryStore.exams.find(e => e.id === id);
      return match ? [{ ...match }] : [];
    }
    if (upper.includes('WHERE IS_ACTIVE = 1') || upper.includes('WHERE `IS_ACTIVE` = 1')) {
      return memoryStore.exams.filter(e => e.is_active === 1 || e.is_active === true).map(e => ({ ...e }));
    }
    return memoryStore.exams.map(e => ({ ...e }));
  }

  if (upper.startsWith('INSERT INTO EXAMS') || upper.startsWith('INSERT INTO `EXAMS`')) {
    const newId = memoryStore.exams.length ? Math.max(...memoryStore.exams.map(e => e.id)) + 1 : 1;
    const exam = {
      id: newId,
      title: params[0],
      subject: params[1],
      description: params[2] || '',
      duration_minutes: parseInt(params[3] || 10, 10),
      total_marks: parseInt(params[4] || 50, 10),
      passing_marks: parseInt(params[5] || 20, 10),
      max_violations: parseInt(params[6] || 3, 10),
      is_active: 1,
      shuffle_questions: 1,
      shuffle_options: 1,
      created_at: new Date()
    };
    memoryStore.exams.push(exam);
    return { insertId: newId, affectedRows: 1 };
  }

  // 3. QUESTIONS
  if (upper.includes('FROM QUESTIONS') || upper.includes('FROM `QUESTIONS`')) {
    if (upper.includes('WHERE EXAM_ID = ?') || upper.includes('WHERE `EXAM_ID` = ?')) {
      const examId = parseInt(params[0], 10);
      return memoryStore.questions.filter(q => q.exam_id === examId).map(q => getQuestionWithOptions(q));
    }
    if (upper.includes('WHERE ID = ?') || upper.includes('WHERE `ID` = ?')) {
      const id = parseInt(params[0], 10);
      const match = memoryStore.questions.find(q => q.id === id);
      return match ? [getQuestionWithOptions(match)] : [];
    }
    return memoryStore.questions.map(q => getQuestionWithOptions(q));
  }

  if (upper.startsWith('INSERT INTO QUESTIONS') || upper.startsWith('INSERT INTO `QUESTIONS`')) {
    const newId = memoryStore.questions.length ? Math.max(...memoryStore.questions.map(q => q.id)) + 1 : 1;
    const question = {
      id: newId,
      exam_id: parseInt(params[0], 10),
      question_text: params[1],
      category: params[2] || 'General',
      difficulty: params[3] || 'medium',
      marks: parseInt(params[4] || 5, 10),
      explanation: params[5] || '',
      created_at: new Date()
    };
    memoryStore.questions.push(question);
    return { insertId: newId, affectedRows: 1 };
  }

  if (upper.startsWith('UPDATE QUESTIONS') || upper.startsWith('UPDATE `QUESTIONS`')) {
    // UPDATE questions SET question_text = ?, category = ?, marks = ?, explanation = ? WHERE id = ?
    const questionId = parseInt(params[params.length - 1], 10);
    const qIndex = memoryStore.questions.findIndex(q => q.id === questionId);
    if (qIndex !== -1) {
      if (params.length >= 5) {
        memoryStore.questions[qIndex].question_text = params[0];
        memoryStore.questions[qIndex].category = params[1];
        memoryStore.questions[qIndex].marks = parseInt(params[2] || 5, 10);
        memoryStore.questions[qIndex].explanation = params[3];
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (upper.startsWith('DELETE FROM QUESTIONS') || upper.startsWith('DELETE FROM `QUESTIONS`')) {
    const id = parseInt(params[0], 10);
    memoryStore.questions = memoryStore.questions.filter(q => q.id !== id);
    memoryStore.options = memoryStore.options.filter(o => o.question_id !== id);
    return { affectedRows: 1 };
  }

  // 4. OPTIONS
  if (upper.includes('FROM OPTIONS') || upper.includes('FROM `OPTIONS`') || upper.includes('FROM QUESTION_OPTIONS') || upper.includes('FROM `QUESTION_OPTIONS`')) {
    if (upper.includes('WHERE QUESTION_ID = ?') || upper.includes('WHERE `QUESTION_ID` = ?')) {
      const qId = parseInt(params[0], 10);
      return memoryStore.options.filter(o => o.question_id === qId).map(o => ({ ...o }));
    }
    return memoryStore.options.map(o => ({ ...o }));
  }

  if (upper.startsWith('INSERT INTO OPTIONS') || upper.startsWith('INSERT INTO `OPTIONS`') || upper.startsWith('INSERT INTO QUESTION_OPTIONS') || upper.startsWith('INSERT INTO `QUESTION_OPTIONS`')) {
    const newId = memoryStore.options.length ? Math.max(...memoryStore.options.map(o => o.id)) + 1 : 1;
    const option = {
      id: newId,
      question_id: parseInt(params[0], 10),
      option_text: params[1],
      is_correct: params[2] ? 1 : 0,
      option_order: parseInt(params[3] || 1, 10)
    };
    memoryStore.options.push(option);
    return { insertId: newId, affectedRows: 1 };
  }

  if (upper.startsWith('DELETE FROM OPTIONS') || upper.startsWith('DELETE FROM `OPTIONS`') || upper.startsWith('DELETE FROM QUESTION_OPTIONS')) {
    if (upper.includes('WHERE QUESTION_ID = ?')) {
      const qId = parseInt(params[0], 10);
      memoryStore.options = memoryStore.options.filter(o => o.question_id !== qId);
      return { affectedRows: 1 };
    }
  }

  // 5. ATTEMPTS
  if (upper.includes('FROM ATTEMPTS') || upper.includes('FROM `ATTEMPTS`') || upper.includes('FROM EXAM_ATTEMPTS') || upper.includes('FROM `EXAM_ATTEMPTS`')) {
    if (upper.includes('WHERE ID = ?') || upper.includes('WHERE `ID` = ?')) {
      const id = parseInt(params[0], 10);
      const match = memoryStore.attempts.find(a => a.id === id);
      return match ? [{ ...match }] : [];
    }
    if (upper.includes('WHERE USER_ID = ?') || upper.includes('WHERE `USER_ID` = ?')) {
      const userId = parseInt(params[0], 10);
      return memoryStore.attempts.filter(a => a.user_id === userId).map(a => ({ ...a }));
    }
    return memoryStore.attempts.map(a => ({ ...a }));
  }

  if (upper.startsWith('INSERT INTO ATTEMPTS') || upper.startsWith('INSERT INTO `ATTEMPTS`') || upper.startsWith('INSERT INTO EXAM_ATTEMPTS') || upper.startsWith('INSERT INTO `EXAM_ATTEMPTS`')) {
    const newId = memoryStore.attempts.length ? Math.max(...memoryStore.attempts.map(a => a.id)) + 1 : 1;
    // Expected params: user_id, exam_id, total_marks, question_order, option_order
    const attempt = {
      id: newId,
      user_id: parseInt(params[0], 10),
      exam_id: parseInt(params[1], 10),
      started_at: new Date(),
      submitted_at: null,
      violations: 0,
      auto_submitted: 0,
      submission_type: 'manual',
      score: 0,
      total_marks: parseInt(params[2] || 50, 10),
      percentage: 0.0,
      status: 'in_progress',
      question_order: params[3] || '[]',
      option_order: params[4] || '{}',
      created_at: new Date()
    };
    memoryStore.attempts.push(attempt);
    return { insertId: newId, affectedRows: 1 };
  }

  if (upper.startsWith('UPDATE ATTEMPTS') || upper.startsWith('UPDATE `ATTEMPTS`') || upper.startsWith('UPDATE EXAM_ATTEMPTS') || upper.startsWith('UPDATE `EXAM_ATTEMPTS`')) {
    if (upper.includes('VIOLATIONS = ?') || upper.includes('TAB_VIOLATIONS_COUNT = ?')) {
      const violationsCount = parseInt(params[0], 10);
      const attemptId = parseInt(params[1], 10);
      const att = memoryStore.attempts.find(a => a.id === attemptId);
      if (att) {
        att.violations = violationsCount;
        if (violationsCount >= 3) {
          att.auto_submitted = 1;
          att.submission_type = 'tab_violation';
        }
        return { affectedRows: 1 };
      }
    }

    if (upper.includes('SCORE = ?')) {
      // UPDATE attempts SET score = ?, percentage = ?, status = ?, submission_type = ?, auto_submitted = ?, submitted_at = NOW() WHERE id = ?
      const attemptId = parseInt(params[params.length - 1], 10);
      const att = memoryStore.attempts.find(a => a.id === attemptId);
      if (att) {
        att.score = parseInt(params[0], 10);
        att.percentage = parseFloat(params[1] || 0);
        att.status = params[2] || 'completed';
        att.submission_type = params[3] || 'manual';
        att.auto_submitted = params[4] ? 1 : 0;
        att.submitted_at = new Date();
        return { affectedRows: 1 };
      }
    }
    return { affectedRows: 1 };
  }

  // 6. ANSWERS
  if (upper.includes('FROM ANSWERS') || upper.includes('FROM `ANSWERS`') || upper.includes('FROM ATTEMPT_ANSWERS') || upper.includes('FROM `ATTEMPT_ANSWERS`')) {
    if (upper.includes('WHERE ATTEMPT_ID = ?') || upper.includes('WHERE `ATTEMPT_ID` = ?')) {
      const attId = parseInt(params[0], 10);
      return memoryStore.answers.filter(ans => ans.attempt_id === attId).map(a => ({ ...a }));
    }
    if (upper.includes('WHERE QUESTION_ID = ?') || upper.includes('WHERE `QUESTION_ID` = ?')) {
      const qId = parseInt(params[0], 10);
      return memoryStore.answers.filter(ans => ans.question_id === qId).map(a => ({ ...a }));
    }
    return memoryStore.answers.map(a => ({ ...a }));
  }

  if (upper.startsWith('INSERT INTO ANSWERS') || upper.startsWith('INSERT INTO `ANSWERS`') || upper.startsWith('INSERT INTO ATTEMPT_ANSWERS') || upper.startsWith('INSERT INTO `ATTEMPT_ANSWERS`')) {
    const newId = memoryStore.answers.length ? Math.max(...memoryStore.answers.map(a => a.id)) + 1 : 1;
    const answer = {
      id: newId,
      attempt_id: parseInt(params[0], 10),
      question_id: parseInt(params[1], 10),
      selected_option_id: params[2] ? parseInt(params[2], 10) : null,
      is_correct: params[3] ? 1 : 0,
      marks_awarded: parseInt(params[4] || 0, 10)
    };
    memoryStore.answers.push(answer);
    return { insertId: newId, affectedRows: 1 };
  }

  // 7. TAB VIOLATIONS
  if (upper.includes('FROM TAB_VIOLATIONS') || upper.includes('FROM `TAB_VIOLATIONS`')) {
    if (upper.includes('WHERE ATTEMPT_ID = ?') || upper.includes('WHERE `ATTEMPT_ID` = ?')) {
      const attId = parseInt(params[0], 10);
      return memoryStore.tab_violations.filter(v => v.attempt_id === attId).map(v => ({ ...v }));
    }
    return memoryStore.tab_violations.map(v => ({ ...v }));
  }

  if (upper.startsWith('INSERT INTO TAB_VIOLATIONS') || upper.startsWith('INSERT INTO `TAB_VIOLATIONS`')) {
    const newId = memoryStore.tab_violations.length ? Math.max(...memoryStore.tab_violations.map(v => v.id)) + 1 : 1;
    const violation = {
      id: newId,
      attempt_id: parseInt(params[0], 10),
      user_id: parseInt(params[1], 10),
      violation_number: parseInt(params[2], 10),
      details: params[3] || 'Page Visibility changed to hidden / window blur',
      detected_at: new Date()
    };
    memoryStore.tab_violations.push(violation);
    return { insertId: newId, affectedRows: 1 };
  }

  return [];
}
