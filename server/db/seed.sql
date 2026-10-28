-- Online Exam Portal Seed Data
-- Seed Admin & Demo Student accounts, exams, questions, and baseline analytics attempts

USE `exam_portal`;

-- Users
-- Passwords:
-- admin@examportal.com -> admin123
-- student@examportal.com -> student123
-- alex@examportal.com -> student123
-- priya@examportal.com -> student123
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `student_id`) VALUES
(1, 'System Administrator', 'admin@examportal.com', '$2a$10$tZ2642a8bAekm16N0yKx0eY2Xm3rT1kR1qO7f8k2kL3p4q5w6e7r8', 'admin', 'ADM-001'),
(2, 'Divyansh Sharma', 'student@examportal.com', '$2a$10$tZ2642a8bAekm16N0yKx0eY2Xm3rT1kR1qO7f8k2kL3p4q5w6e7r8', 'student', 'STU-2026-101'),
(3, 'Alex Johnson', 'alex@examportal.com', '$2a$10$tZ2642a8bAekm16N0yKx0eY2Xm3rT1kR1qO7f8k2kL3p4q5w6e7r8', 'student', 'STU-2026-102'),
(4, 'Priya Patel', 'priya@examportal.com', '$2a$10$tZ2642a8bAekm16N0yKx0eY2Xm3rT1kR1qO7f8k2kL3p4q5w6e7r8', 'student', 'STU-2026-103')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Exams
INSERT INTO `exams` (`id`, `title`, `subject`, `description`, `duration_minutes`, `total_marks`, `passing_marks`, `max_violations`, `is_active`, `shuffle_questions`, `shuffle_options`) VALUES
(1, 'Full-Stack Web Architecture & Node.js', 'Web Engineering', 'Assess core knowledge of Node.js event loop, Express routing, REST APIs, asynchronous execution, and security patterns.', 10, 50, 20, 3, 1, 1, 1),
(2, 'Relational Database Design & MySQL', 'Database Systems', 'Test understanding of SQL joins, indexing, ACID transactions, normalization, and relational query optimization.', 15, 50, 20, 3, 1, 1, 1),
(3, 'Data Structures & Algorithms Proficiency', 'Computer Science', 'Comprehensive evaluation of time complexities, graph traversals, dynamic programming concepts, and trees.', 12, 50, 25, 3, 1, 1, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Questions for Exam 1: Full-Stack Web Architecture & Node.js
INSERT INTO `questions` (`id`, `exam_id`, `question_text`, `category`, `difficulty`, `marks`, `explanation`) VALUES
(1, 1, 'In Node.js, which internal library is primarily responsible for providing the cross-platform asynchronous I/O event loop?', 'Node.js Internals', 'medium', 10, 'libuv is the multi-platform C library that provides the event loop, thread pool, and asynchronous I/O handling in Node.js.'),
(2, 1, 'Which HTTP status code is most appropriate when a client request fails due to lack of valid authentication credentials?', 'REST APIs', 'easy', 10, 'HTTP 401 Unauthorized indicates that the request requires user authentication credentials which were omitted or invalid.'),
(3, 1, 'What is the time complexity of looking up a value by its key in a standard JavaScript Map or Hash Table on average?', 'Data Structures', 'easy', 10, 'A hash map provides average-case O(1) constant time complexity for key lookups.'),
(4, 1, 'Which browser API provides an event when a tab changes between active and background states?', 'Browser APIs', 'medium', 10, 'The Page Visibility API fires the visibilitychange event and exposes document.visibilityState (hidden or visible).'),
(5, 1, 'What does the bcrypt algorithm utilize to protect stored passwords against rainbow table attacks?', 'Web Security', 'medium', 10, 'bcrypt combines a cryptographically generated random salt along with a configurable work factor (cost) to defeat rainbow table attacks.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

-- Options for Question 1
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(1, 'libuv', 1, 1),
(1, 'V8 Engine', 0, 2),
(1, 'OpenSSL', 0, 3),
(1, 'npm registry', 0, 4);

-- Options for Question 2
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(2, '401 Unauthorized', 1, 1),
(2, '403 Forbidden', 0, 2),
(2, '404 Not Found', 0, 3),
(2, '400 Bad Request', 0, 4);

-- Options for Question 3
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(3, 'O(1)', 1, 1),
(3, 'O(log n)', 0, 2),
(3, 'O(n)', 0, 3),
(3, 'O(n^2)', 0, 4);

-- Options for Question 4
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(4, 'Page Visibility API', 1, 1),
(4, 'Intersection Observer API', 0, 2),
(4, 'Web Workers API', 0, 3),
(4, 'Service Worker Sync API', 0, 4);

-- Options for Question 5
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(5, 'Cryptographic Salting', 1, 1),
(5, 'Symmetric DES Encryption', 0, 2),
(5, 'Base64 Obfuscation', 0, 3),
(5, 'MD5 Checksumming', 0, 4);

-- Questions for Exam 2: Relational Database Design & MySQL
INSERT INTO `questions` (`id`, `exam_id`, `question_text`, `category`, `difficulty`, `marks`, `explanation`) VALUES
(6, 2, 'Which normal form requires eliminating repeating groups and ensuring atomicity of every attribute column?', 'Normalization', 'easy', 10, 'First Normal Form (1NF) mandates atomic attributes with no repeating groups or composite columns.'),
(7, 2, 'What type of index is most commonly implemented by default in MySQL InnoDB storage engine for B-Tree storage?', 'Indexing', 'medium', 10, 'InnoDB uses B+Tree structures for clustered primary key and secondary indexes.'),
(8, 2, 'Which property of ACID transactions guarantees that database changes persist even in the event of a system crash or power outage?', 'ACID Properties', 'easy', 10, 'Durability ensures that committed transactions survive subsequent failures and power interruptions.'),
(9, 2, 'In SQL, what is the key functional difference between WHERE and HAVING clauses?', 'SQL Querying', 'medium', 10, 'WHERE filters individual rows before grouping, while HAVING filters aggregate results after GROUP BY.'),
(10, 2, 'Which isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads in standard SQL?', 'Transactions', 'hard', 10, 'Serializable is the highest isolation level that prevents dirty reads, non-repeatable reads, and phantom reads.')
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);

-- Options for Question 6
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(6, 'First Normal Form (1NF)', 1, 1),
(6, 'Second Normal Form (2NF)', 0, 2),
(6, 'Third Normal Form (3NF)', 0, 3),
(6, 'Boyce-Codd Normal Form (BCNF)', 0, 4);

-- Options for Question 7
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(7, 'B+Tree Index', 1, 1),
(7, 'Hash Index', 0, 2),
(7, 'R-Tree Index', 0, 3),
(7, 'Bitmap Index', 0, 4);

-- Options for Question 8
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(8, 'Durability', 1, 1),
(8, 'Atomicity', 0, 2),
(8, 'Consistency', 0, 3),
(8, 'Isolation', 0, 4);

-- Options for Question 9
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(9, 'WHERE filters rows before aggregation; HAVING filters groups after aggregation', 1, 1),
(9, 'HAVING applies only to numbers; WHERE applies only to strings', 0, 2),
(9, 'WHERE is only for JOINs; HAVING is only for subqueries', 0, 3),
(9, 'There is no difference; they are aliases', 0, 4);

-- Options for Question 10
INSERT INTO `question_options` (`question_id`, `option_text`, `is_correct`, `option_order`) VALUES
(10, 'Serializable', 1, 1),
(10, 'Repeatable Read', 0, 2),
(10, 'Read Committed', 0, 3),
(10, 'Read Uncommitted', 0, 4);

-- Baseline Attempts for Admin Analytics
INSERT INTO `exam_attempts` (`id`, `user_id`, `exam_id`, `score`, `total_marks`, `total_questions`, `correct_answers`, `percentage`, `status`, `submission_type`, `tab_violations_count`, `created_at`) VALUES
(1, 3, 1, 40, 50, 5, 4, 80.00, 'completed', 'manual', 0, NOW() - INTERVAL 2 DAY),
(2, 4, 1, 50, 50, 5, 5, 100.00, 'completed', 'manual', 0, NOW() - INTERVAL 1 DAY),
(3, 2, 1, 30, 50, 5, 3, 60.00, 'completed', 'tab_violation', 3, NOW() - INTERVAL 6 HOUR),
(4, 3, 2, 40, 50, 5, 4, 80.00, 'completed', 'manual', 1, NOW() - INTERVAL 12 HOUR),
(5, 4, 2, 30, 50, 5, 3, 60.00, 'completed', 'timeout', 0, NOW() - INTERVAL 4 HOUR)
ON DUPLICATE KEY UPDATE `score` = VALUES(`score`);
