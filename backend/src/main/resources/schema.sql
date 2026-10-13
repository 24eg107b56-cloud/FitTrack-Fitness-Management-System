-- FitTrack Schema definition
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

CREATE TABLE IF NOT EXISTS weight_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    weight_kg DOUBLE NOT NULL,
    height_cm DOUBLE NOT NULL,
    bmi DOUBLE NOT NULL,
    bmi_category VARCHAR(50) NOT NULL,
    record_date DATE NOT NULL,
    notes VARCHAR(500)
);

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
