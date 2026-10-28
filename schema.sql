-- ========================================================
-- Online Exam Portal - Database Schema (MySQL 8.0+)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `exam_portal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `exam_portal`;

-- Drop existing tables if needed for a clean install
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `tab_violations`;
DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `attempt_answers`;
DROP TABLE IF EXISTS `attempts`;
DROP TABLE IF EXISTS `exam_attempts`;
DROP TABLE IF EXISTS `options`;
DROP TABLE IF EXISTS `question_options`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table (Admin and Student accounts)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB;

-- 2. Exams Table
CREATE TABLE `exams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `duration_minutes` INT NOT NULL DEFAULT 10,
  `total_marks` INT NOT NULL DEFAULT 50,
  `passing_marks` INT NOT NULL DEFAULT 20,
  `max_violations` INT NOT NULL DEFAULT 3,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `shuffle_questions` BOOLEAN NOT NULL DEFAULT TRUE,
  `shuffle_options` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_exams_subject` (`subject`),
  INDEX `idx_exams_active` (`is_active`)
) ENGINE=InnoDB;

-- 3. Questions Table (Question Bank)
CREATE TABLE `questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  `marks` INT NOT NULL DEFAULT 5,
  `explanation` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
  INDEX `idx_questions_exam` (`exam_id`),
  INDEX `idx_questions_category` (`category`)
) ENGINE=InnoDB;

-- 4. Options Table (4 Options per Question)
CREATE TABLE `options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question_id` INT NOT NULL,
  `option_text` TEXT NOT NULL,
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
  `option_order` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
  INDEX `idx_options_question` (`question_id`),
  INDEX `idx_options_correct` (`is_correct`)
) ENGINE=InnoDB;

-- 5. Attempts Table (Stores session, timer enforcement, violations, and student shuffled orders)
CREATE TABLE `attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `exam_id` INT NOT NULL,
  `started_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` TIMESTAMP NULL,
  `violations` INT NOT NULL DEFAULT 0,
  `auto_submitted` BOOLEAN NOT NULL DEFAULT FALSE,
  `submission_type` ENUM('manual', 'timeout', 'tab_violation') NOT NULL DEFAULT 'manual',
  `score` INT NOT NULL DEFAULT 0,
  `total_marks` INT NOT NULL DEFAULT 0,
  `percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('in_progress', 'completed') NOT NULL DEFAULT 'in_progress',
  `question_order` TEXT NULL, -- Shuffled question IDs JSON array: [5, 2, 8, 1, ...]
  `option_order` TEXT NULL,   -- Shuffled option IDs map JSON: {"1": [4, 2, 1, 3], ...}
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
  INDEX `idx_attempts_user` (`user_id`),
  INDEX `idx_attempts_exam` (`exam_id`),
  INDEX `idx_attempts_status` (`status`)
) ENGINE=InnoDB;

-- 6. Answers Table (Student choices for each question)
CREATE TABLE `answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attempt_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `selected_option_id` INT NULL,
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
  `marks_awarded` INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`selected_option_id`) REFERENCES `options`(`id`) ON DELETE SET NULL,
  INDEX `idx_answers_attempt` (`attempt_id`),
  INDEX `idx_answers_question` (`question_id`)
) ENGINE=InnoDB;

-- 7. Tab Violations Log Table
CREATE TABLE `tab_violations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attempt_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `violation_number` INT NOT NULL,
  `detected_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `details` VARCHAR(255) DEFAULT 'Browser Page Visibility changed to hidden or window blur',
  FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_violations_attempt` (`attempt_id`),
  INDEX `idx_violations_user` (`user_id`)
) ENGINE=InnoDB;

-- Compatibility Views for seamless query aliases
CREATE OR REPLACE VIEW `exam_attempts` AS SELECT * FROM `attempts`;
CREATE OR REPLACE VIEW `question_options` AS SELECT * FROM `options`;
CREATE OR REPLACE VIEW `attempt_answers` AS SELECT * FROM `answers`;
