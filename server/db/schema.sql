-- Online Exam Portal Database Schema
-- MySQL 8.0+ Compatible

CREATE DATABASE IF NOT EXISTS `exam_portal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `exam_portal`;

-- Users Table (Students & Admins)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `student_id` VARCHAR(50) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB;

-- Exams Table
CREATE TABLE IF NOT EXISTS `exams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `duration_minutes` INT NOT NULL DEFAULT 15,
  `total_marks` INT NOT NULL DEFAULT 100,
  `passing_marks` INT NOT NULL DEFAULT 40,
  `max_violations` INT NOT NULL DEFAULT 3,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `shuffle_questions` BOOLEAN NOT NULL DEFAULT TRUE,
  `shuffle_options` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_exams_subject` (`subject`),
  INDEX `idx_exams_active` (`is_active`)
) ENGINE=InnoDB;

-- Questions Table (Question Bank)
CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  `marks` INT NOT NULL DEFAULT 10,
  `explanation` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
  INDEX `idx_questions_exam` (`exam_id`),
  INDEX `idx_questions_category` (`category`)
) ENGINE=InnoDB;

-- Question Options Table (4 options per question)
CREATE TABLE IF NOT EXISTS `question_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question_id` INT NOT NULL,
  `option_text` TEXT NOT NULL,
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
  `option_order` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
  INDEX `idx_options_question` (`question_id`),
  INDEX `idx_options_correct` (`is_correct`)
) ENGINE=InnoDB;

-- Exam Attempts Table (Tracks student test session)
CREATE TABLE IF NOT EXISTS `exam_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `exam_id` INT NOT NULL,
  `start_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `end_time` TIMESTAMP NULL,
  `score` INT DEFAULT 0,
  `total_marks` INT DEFAULT 0,
  `total_questions` INT DEFAULT 0,
  `correct_answers` INT DEFAULT 0,
  `percentage` DECIMAL(5, 2) DEFAULT 0.00,
  `status` ENUM('in_progress', 'completed', 'disqualified') DEFAULT 'in_progress',
  `submission_type` ENUM('manual', 'timeout', 'tab_violation') DEFAULT 'manual',
  `tab_violations_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
  INDEX `idx_attempts_user` (`user_id`),
  INDEX `idx_attempts_exam` (`exam_id`),
  INDEX `idx_attempts_status` (`status`)
) ENGINE=InnoDB;

-- Attempt Answers Table (Tracks each answered question during an attempt)
CREATE TABLE IF NOT EXISTS `attempt_answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attempt_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `selected_option_id` INT NULL,
  `is_correct` BOOLEAN DEFAULT FALSE,
  `marks_awarded` INT DEFAULT 0,
  FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`selected_option_id`) REFERENCES `question_options`(`id`) ON DELETE SET NULL,
  INDEX `idx_attempt_answers_attempt` (`attempt_id`),
  INDEX `idx_attempt_answers_question` (`question_id`)
) ENGINE=InnoDB;

-- Tab Violations Log Table (Tracks each detected tab switch with timestamp)
CREATE TABLE IF NOT EXISTS `tab_violations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attempt_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `violation_number` INT NOT NULL,
  `detected_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `details` VARCHAR(255) DEFAULT 'Browser Page Visibility changed to hidden or window blur',
  FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_violations_attempt` (`attempt_id`),
  INDEX `idx_violations_user` (`user_id`)
) ENGINE=InnoDB;
