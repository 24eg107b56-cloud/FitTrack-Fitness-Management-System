-- ========================================================
-- FitTrack - Fitness Management System Database Schema & Data
-- Database: MySQL
-- ========================================================

CREATE DATABASE IF NOT EXISTS fittrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fittrack_db;

-- 1. Table: workouts
CREATE TABLE IF NOT EXISTS workouts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Strength',
    sets INT NOT NULL,
    repetitions INT NOT NULL,
    weight_kg DOUBLE DEFAULT 0.0,
    duration_minutes INT DEFAULT 0,
    calories_burned DOUBLE DEFAULT 0.0,
    workout_date DATE NOT NULL,
    notes VARCHAR(500)
);

-- 2. Table: weight_records
CREATE TABLE IF NOT EXISTS weight_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    weight_kg DOUBLE NOT NULL,
    height_cm DOUBLE NOT NULL,
    bmi DOUBLE NOT NULL,
    bmi_category VARCHAR(50) NOT NULL,
    record_date DATE NOT NULL,
    notes VARCHAR(500)
);

-- 3. Table: fitness_goals
CREATE TABLE IF NOT EXISTS fitness_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    goal_type VARCHAR(50) DEFAULT 'GENERAL',
    target_value DOUBLE NOT NULL,
    start_value DOUBLE DEFAULT 0.0,
    current_value DOUBLE DEFAULT 0.0,
    unit VARCHAR(20) DEFAULT 'kg',
    target_date DATE,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS',
    notes VARCHAR(500)
);

-- ========================================================
-- Sample Initial Data (Seed Data)
-- ========================================================

-- Sample Workouts
INSERT INTO workouts (exercise_name, category, sets, repetitions, weight_kg, duration_minutes, calories_burned, workout_date, notes)
VALUES 
('Barbell Bench Press', 'Strength', 4, 10, 65.0, 30, 225.0, '2026-10-10', 'Good form, increased weight on last set'),
('Barbell Squats', 'Strength', 4, 12, 80.0, 35, 270.0, '2026-10-11', 'Deep squats, focused on quad engagement'),
('Treadmill Running', 'Cardio', 1, 1, 0.0, 25, 210.0, '2026-10-12', 'Paced 9 km/h with 2% incline interval'),
('Pull-Ups & Lat Pulldown', 'Strength', 4, 10, 55.0, 30, 220.0, '2026-10-12', 'Upper back focus, strict form'),
('Dumbbell Bicep Curls', 'Strength', 3, 12, 14.0, 20, 140.0, '2026-10-13', 'Controlled negatives');

-- Sample Weight Records
INSERT INTO weight_records (weight_kg, height_cm, bmi, bmi_category, record_date, notes)
VALUES 
(76.5, 175.0, 25.0, 'Overweight', '2026-09-15', 'Initial weight measurement'),
(75.8, 175.0, 24.8, 'Normal weight', '2026-09-25', 'After 10 days of consistent cardio'),
(74.6, 175.0, 24.4, 'Normal weight', '2026-10-05', 'Feeling more energetic'),
(73.5, 175.0, 24.0, 'Normal weight', '2026-10-13', 'Target weight progressing well');

-- Sample Fitness Goals
INSERT INTO fitness_goals (title, goal_type, target_value, start_value, currentValue, unit, target_date, status, notes)
VALUES 
('Reach 70 kg Target Weight', 'WEIGHT_LOSS', 70.0, 76.5, 73.5, 'kg', '2026-11-30', 'IN_PROGRESS', 'Healthy steady weight reduction'),
('Complete 20 Workouts this Month', 'WORKOUT_COUNT', 20.0, 0.0, 12.0, 'workouts', '2026-10-31', 'IN_PROGRESS', 'Consistency challenge'),
('Bench Press 80 kg', 'STRENGTH', 80.0, 60.0, 65.0, 'kg', '2026-12-15', 'IN_PROGRESS', 'Strength milestone target');
