-- ========================================================
-- Online Exam Portal - Seed Data
-- 1 Admin, 2 Students, 1 Sample Exam with 10+ Questions
-- ========================================================

USE `exam_portal`;

-- 1. Users
-- Demo Passwords:
-- admin@portal.com    -> admin123  (Role: admin)
-- student1@portal.com -> student123 (Role: student)
-- student2@portal.com -> student123 (Role: student)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`) VALUES
(1, 'Administrator', 'admin@portal.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
(2, 'Alex Turner', 'student1@portal.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student'),
(3, 'Sarah Connor', 'student2@portal.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Exams (1 Primary Sample Exam with 10 Questions + 2 Additional Exams for Cross-Exam Analytics)
INSERT INTO `exams` (`id`, `title`, `subject`, `description`, `duration_minutes`, `total_marks`, `passing_marks`, `max_violations`, `is_active`, `shuffle_questions`, `shuffle_options`) VALUES
(1, 'Full-Stack Web Engineering & Node.js', 'Computer Science', 'Comprehensive evaluation of Node.js event loop, asynchronous non-blocking I/O, RESTful status codes, browser Page Visibility API, and security.', 10, 50, 20, 3, 1, 1, 1),
(2, 'Relational Database Architecture & MySQL', 'Database Systems', 'Assessment of SQL indexing, ACID properties, query joins, transactions, and relational schema normalization.', 15, 50, 20, 3, 1, 1, 1),
(3, 'Data Structures & Algorithmic Complexity', 'Algorithms', 'Evaluation of asymptotic runtime analysis, complete binary trees, graph traversals, and dynamic programming.', 12, 50, 25, 3, 1, 1, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 3. 10 Comprehensive Questions for Exam 1
INSERT INTO `questions` (`id`, `exam_id`, `question_text`, `category`, `difficulty`, `marks`, `explanation`) VALUES
(1, 1, 'In Node.js, which multi-platform C library is responsible for providing the non-blocking event loop, thread pool, and asynchronous I/O?', 'Node.js Internals', 'medium', 5, 'libuv is the multi-platform support library written in C that handles the event loop and asynchronous operations in Node.js.'),
(2, 1, 'Which HTTP status code should a REST API return when a request lacks valid authentication credentials?', 'REST APIs', 'easy', 5, 'HTTP 401 Unauthorized indicates that the request has not been applied because it lacks valid authentication credentials.'),
(3, 1, 'Which browser API enables web applications to detect when a tab becomes inactive or minimized by the user?', 'Browser APIs', 'medium', 5, 'The Page Visibility API provides the document.visibilityState property and fires the visibilitychange event when the user switches tabs.'),
(4, 1, 'What is the average time complexity for searching a key in a standard JavaScript Map (Hash Table)?', 'Data Structures', 'easy', 5, 'Hash tables provide an average time complexity of O(1) for lookup, insertion, and deletion.'),
(5, 1, 'Why is bcrypt preferred over raw SHA-256 for storing user passwords in database tables?', 'Security', 'medium', 5, 'bcrypt incorporates a configurable work factor (key derivation iterations) and automatic cryptographic salting to resist brute-force and rainbow table attacks.'),
(6, 1, 'In Express.js, what must a custom middleware function call to pass control to the next middleware in the execution stack?', 'Express.js', 'easy', 5, 'Calling the next() function passes control to the next matching middleware layer or route handler.'),
(7, 1, 'Which database isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?', 'Databases', 'hard', 5, 'Serializable is the highest transaction isolation level, preventing dirty reads, non-repeatable reads, and phantom reads.'),
(8, 1, 'Which data structure does Breadth-First Search (BFS) utilize during graph exploration?', 'Algorithms', 'easy', 5, 'BFS explores nodes level-by-level using a First-In-First-Out (FIFO) Queue.'),
(9, 1, 'In standard SQL, how does the HAVING clause differ functionally from the WHERE clause?', 'SQL Querying', 'medium', 5, 'WHERE filters rows before aggregation occurs, whereas HAVING filters aggregated grouped rows produced by GROUP BY.'),
(10, 1, 'What is the height of a balanced Complete Binary Tree containing N nodes?', 'Data Structures', 'medium', 5, 'The height of a balanced complete binary tree with N nodes is ⌊log₂ N⌋.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

-- 4. Options for Questions (4 options per question, exactly 1 marked correct)
INSERT INTO `options` (`id`, `question_id`, `option_text`, `is_correct`, `option_order`) VALUES
-- Question 1 Options
(1, 1, 'libuv', 1, 1),
(2, 1, 'V8 JavaScript Engine', 0, 2),
(3, 1, 'OpenSSL Native Wrapper', 0, 3),
(4, 1, 'npm Package Manager', 0, 4),

-- Question 2 Options
(5, 2, '401 Unauthorized', 1, 1),
(6, 2, '403 Forbidden', 0, 2),
(7, 2, '404 Not Found', 0, 3),
(8, 2, '400 Bad Request', 0, 4),

-- Question 3 Options
(9, 3, 'Page Visibility API', 1, 1),
(10, 3, 'Intersection Observer API', 0, 2),
(11, 3, 'Web Workers API', 0, 3),
(12, 3, 'Broadcast Channel API', 0, 4),

-- Question 4 Options
(13, 4, 'O(1) Constant Time', 1, 1),
(14, 4, 'O(log N) Logarithmic Time', 0, 2),
(15, 4, 'O(N) Linear Time', 0, 3),
(16, 4, 'O(N²) Quadratic Time', 0, 4),

-- Question 5 Options
(17, 5, 'It incorporates cryptographic salting and an adaptive computational work factor (cost)', 1, 1),
(18, 5, 'It encrypts passwords with symmetric two-way DES keys', 0, 2),
(19, 5, 'It applies Base64 encoding for compression', 0, 3),
(20, 5, 'It produces an 8-bit checksum value', 0, 4),

-- Question 6 Options
(21, 6, 'next()', 1, 1),
(22, 6, 'res.continue()', 0, 2),
(23, 6, 'req.forward()', 0, 3),
(24, 6, 'return done()', 0, 4),

-- Question 7 Options
(25, 7, 'Serializable', 1, 1),
(26, 7, 'Repeatable Read', 0, 2),
(27, 7, 'Read Committed', 0, 3),
(28, 7, 'Read Uncommitted', 0, 4),

-- Question 8 Options
(29, 8, 'FIFO Queue', 1, 1),
(30, 8, 'LIFO Stack', 0, 2),
(31, 8, 'Priority Max-Heap', 0, 3),
(32, 8, 'Self-Balancing Red-Black Tree', 0, 4),

-- Question 9 Options
(33, 9, 'WHERE filters rows prior to aggregation, while HAVING filters grouped results post-aggregation', 1, 1),
(34, 9, 'HAVING is only used for string comparisons, while WHERE handles numerical comparisons', 0, 2),
(35, 9, 'WHERE can only be used with JOINs, while HAVING is reserved for UNIONs', 0, 3),
(36, 9, 'There is no difference; they are interchangeable aliases', 0, 4),

-- Question 10 Options
(37, 10, '⌊log₂ N⌋', 1, 1),
(38, 10, 'N / 2', 0, 2),
(39, 10, '2ᴺ', 0, 3),
(40, 10, 'N log N', 0, 4)
ON DUPLICATE KEY UPDATE `option_text` = VALUES(`option_text`);

-- 5. Seed Attempts for Analytics Display
INSERT INTO `attempts` (`id`, `user_id`, `exam_id`, `started_at`, `submitted_at`, `violations`, `auto_submitted`, `submission_type`, `score`, `total_marks`, `percentage`, `status`) VALUES
(1, 2, 1, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 8 MINUTE, 0, 0, 'manual', 45, 50, 90.00, 'completed'),
(2, 3, 1, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 9 MINUTE, 1, 0, 'manual', 40, 50, 80.00, 'completed'),
(3, 2, 2, NOW() - INTERVAL 12 HOUR, NOW() - INTERVAL 12 HOUR + INTERVAL 14 MINUTE, 0, 0, 'manual', 35, 50, 70.00, 'completed'),
(4, 3, 2, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 6 HOUR + INTERVAL 15 MINUTE, 0, 1, 'timeout', 30, 50, 60.00, 'completed'),
(5, 2, 1, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR + INTERVAL 4 MINUTE, 3, 1, 'tab_violation', 20, 50, 40.00, 'completed')
ON DUPLICATE KEY UPDATE `score` = VALUES(`score`);

-- 6. Seed Answers for Question Accuracy Calculations
INSERT INTO `answers` (`attempt_id`, `question_id`, `selected_option_id`, `is_correct`, `marks_awarded`) VALUES
-- Attempt 1 Answers
(1, 1, 1, 1, 5), (1, 2, 5, 1, 5), (1, 3, 9, 1, 5), (1, 4, 13, 1, 5), (1, 5, 17, 1, 5),
(1, 6, 21, 1, 5), (1, 7, 25, 1, 5), (1, 8, 29, 1, 5), (1, 9, 33, 1, 5), (1, 10, 38, 0, 0),
-- Attempt 2 Answers
(2, 1, 1, 1, 5), (2, 2, 5, 1, 5), (2, 3, 9, 1, 5), (2, 4, 13, 1, 5), (2, 5, 18, 0, 0),
(2, 6, 21, 1, 5), (2, 7, 26, 0, 0), (2, 8, 29, 1, 5), (2, 9, 33, 1, 5), (2, 10, 37, 1, 5),
-- Attempt 5 Answers (Auto-submitted due to tab violations)
(5, 1, 1, 1, 5), (5, 2, 5, 1, 5), (5, 3, 9, 1, 5), (5, 4, 13, 1, 5), (5, 5, NULL, 0, 0),
(5, 6, NULL, 0, 0), (5, 7, NULL, 0, 0), (5, 8, NULL, 0, 0), (5, 9, NULL, 0, 0), (5, 10, NULL, 0, 0)
ON DUPLICATE KEY UPDATE `marks_awarded` = VALUES(`marks_awarded`);

-- 7. Tab Violations for Attempt 5
INSERT INTO `tab_violations` (`attempt_id`, `user_id`, `violation_number`, `detected_at`, `details`) VALUES
(5, 2, 1, NOW() - INTERVAL 3 HOUR + INTERVAL 1 MINUTE, 'Tab switched to external window (Warning 1/2)'),
(5, 2, 2, NOW() - INTERVAL 3 HOUR + INTERVAL 2 MINUTE, 'Window focus lost / blurred (Warning 2/2)'),
(5, 2, 3, NOW() - INTERVAL 3 HOUR + INTERVAL 3 MINUTE, 'Tab switched 3rd time - Automatic test submission triggered')
ON DUPLICATE KEY UPDATE `details` = VALUES(`details`);
