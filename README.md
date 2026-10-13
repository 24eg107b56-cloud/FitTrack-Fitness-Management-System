# FitTrack – Fitness Management System 🏋️‍♂️⚡

[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Data JPA](https://img.shields.io/badge/Spring%20Data-JPA-blue.svg)](https://spring.io/projects/spring-data-jpa)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-blue.svg)](https://www.mysql.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-yellow.svg)]()

> FitTrack is a Java Full Stack web application developed to help users monitor and manage their daily fitness activities. The main objective of this project is to provide a simple and user-friendly platform for tracking workouts, recording body weight, calculating Body Mass Index (BMI), and monitoring fitness goals.

---

## 📌 Project Abstract

FitTrack reduces the need for manual fitness records and helps users maintain consistency in their workout routines. The system is developed using **HTML, CSS, and JavaScript** for the frontend, **Java and Spring Boot** for the backend, and **MySQL** for database management. Spring Data JPA is used to perform database operations, while REST APIs enable communication between the frontend and backend.

The application allows users to record exercise details such as exercise name, category, sets, repetitions, and workout date. It also enables users to maintain weight records, calculate BMI based on height and weight, and view their fitness progress over time. The dashboard presents important fitness information in an organized and accessible format.

---

## 🌟 Key Features

1. **Dashboard Overview**
   - High-level KPIs: Total Workouts, Active Exercise Duration, Total Calories Burned, and Latest BMI.
   - Recent workout session stream with category badges.
   - Active fitness goals tracker with visual progress bars.
   - Real-time backend connection status indicator (with automatic graceful client fallback).

2. **Workout Tracking (`/workouts`)**
   - Log exercises with category (*Strength*, *Cardio*, *HIIT*, *Flexibility*).
   - Track sets, repetitions, weights lifted (kg), duration, and energy burned (kcal).
   - Auto-calorie estimation based on duration (~7.5 kcal/min) or manual override.
   - Search and filter workouts by category or exercise keyword.

3. **Body Weight & BMI Calculator (`/bmi-weight`)**
   - Real-time Body Mass Index (BMI) calculator:
     $$\text{BMI} = \frac{\text{Weight (kg)}}{(\text{Height (m)})^2}$$
   - Visual color-coded WHO spectrum meter:
     - **Underweight**: $< 18.5$
     - **Normal Weight**: $18.5 - 24.9$
     - **Overweight**: $25.0 - 29.9$
     - **Obese**: $\ge 30.0$
   - Tailored health recommendations and diet/exercise tips based on BMI category.
   - Weight history log with automatic BMI calculation upon saving.

4. **Fitness Goals Management (`/goals`)**
   - Define custom targets (Weight Loss, Muscle Gain, Workout Frequency, Strength Milestone).
   - Animated progress percentage bars.
   - Target date countdown and completion status.
   - Quick "Update Progress" and "Mark Completed" actions.

---

## 🏗️ Project Architecture & Directory Structure

The project is structured with a clear separation between frontend, backend, and database:

```
FitTrack-Fitness-Management-System/
├── backend/                               # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fittrack/
│   │   │   │   ├── FitTrackApplication.java       # Spring Boot main class
│   │   │   │   ├── config/
│   │   │   │   │   └── WebConfig.java             # Global CORS configuration
│   │   │   │   ├── controller/
│   │   │   │   │   ├── WorkoutController.java     # /api/workouts endpoints
│   │   │   │   │   ├── WeightRecordController.java# /api/weights endpoints
│   │   │   │   │   ├── GoalController.java        # /api/goals endpoints
│   │   │   │   │   └── DashboardController.java   # /api/dashboard endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── DashboardStatsDTO.java
│   │   │   │   │   ├── BmiCalculationRequest.java
│   │   │   │   │   └── BmiCalculationResponse.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── Workout.java               # JPA Entity: workouts
│   │   │   │   │   ├── WeightRecord.java          # JPA Entity: weight_records
│   │   │   │   │   └── Goal.java                  # JPA Entity: fitness_goals
│   │   │   │   ├── repository/
│   │   │   │   │   ├── WorkoutRepository.java
│   │   │   │   │   ├── WeightRecordRepository.java
│   │   │   │   │   └── GoalRepository.java
│   │   │   │   └── service/
│   │   │   │       ├── WorkoutService.java
│   │   │   │       ├── WeightRecordService.java
│   │   │   │       ├── GoalService.java
│   │   │   │       └── DashboardService.java
│   │   │   └── resources/
│   │   │       ├── application.properties         # Database and server config
│   │   │       └── schema.sql                     # SQL DDL script
│   ├── pom.xml                                    # Maven dependencies
│   ├── mvnw / mvnw.cmd                            # Maven Wrapper scripts
│   └── .mvn/wrapper/maven-wrapper.properties
│
├── frontend/                              # Responsive Web Client (HTML/CSS/JS)
│   ├── index.html                                 # Dashboard page
│   ├── workouts.html                              # Workout tracking page
│   ├── bmi-weight.html                            # Weight & BMI calculator page
│   ├── goals.html                                 # Fitness goals page
│   ├── css/
│   │   └── style.css                              # Modern fitness dark/vibrant styling
│   └── js/
│       ├── config.js                              # API client & local mock fallback
│       ├── dashboard.js                           # Dashboard metrics controller
│       ├── workouts.js                            # Workout CRUD controller
│       ├── bmi.js                                 # BMI calculation & history controller
│       └── goals.js                               # Goals management controller
│
├── database/
│   └── fittrack_schema.sql                        # MySQL schema & initial seed data
├── .gitignore
└── README.md
```

---

## 🔌 REST API Endpoints

| Resource | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Aggregated dashboard stats & recent activities |
| **Workouts** | `GET` | `/api/workouts` | Retrieve all workouts (supports `category` filter) |
| | `GET` | `/api/workouts/{id}` | Get single workout by ID |
| | `GET` | `/api/workouts/recent` | Get top 5 recent workouts |
| | `POST` | `/api/workouts` | Create a new workout entry |
| | `PUT` | `/api/workouts/{id}` | Update existing workout entry |
| | `DELETE` | `/api/workouts/{id}` | Delete a workout |
| **Weights & BMI** | `GET` | `/api/weights` | Retrieve weight log history |
| | `GET` | `/api/weights/latest` | Retrieve latest weight & BMI record |
| | `POST` | `/api/weights` | Log weight (auto-calculates BMI & category) |
| | `POST` | `/api/weights/calculate-bmi`| Calculate standalone BMI with health advice |
| | `DELETE` | `/api/weights/{id}` | Delete a weight log |
| **Goals** | `GET` | `/api/goals` | Retrieve all goals (supports `status` filter) |
| | `POST` | `/api/goals` | Create a new goal |
| | `PUT` | `/api/goals/{id}` | Update existing goal details |
| | `PATCH` | `/api/goals/{id}/progress` | Update current progress value |
| | `PATCH` | `/api/goals/{id}/status` | Update goal status (`IN_PROGRESS`/`COMPLETED`) |
| | `DELETE` | `/api/goals/{id}` | Delete a goal |

---

## 🗄️ Database Setup (MySQL)

1. **Start MySQL Server** and open MySQL Workbench or CLI:
   ```bash
   mysql -u root -p
   ```

2. **Execute the Database Script**:
   Run the SQL file provided in `database/fittrack_schema.sql`:
   ```sql
   SOURCE database/fittrack_schema.sql;
   ```
   *This creates `fittrack_db` and seeds initial test workouts, weight records, and goals.*

3. **Configure MySQL Credentials**:
   In [backend/src/main/resources/application.properties](file:///C:/Users/upend/.gemini/antigravity/scratch/FitTrack-Fitness-Management-System/backend/src/main/resources/application.properties), adjust your MySQL username and password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/fittrack_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```

> 💡 **Zero-Setup Quick Trial:** If MySQL is not installed on your system, you can uncomment the H2 in-memory database configuration in `application.properties` to run immediately with zero database installation.

---

## 🚀 Running the Application

### 1. Start Backend (Spring Boot)
Navigate to the `backend/` directory:

```bash
cd backend
```

Using Maven Wrapper:
- **On Windows:**
  ```cmd
  mvnw.cmd spring-boot:run
  ```
- **On Linux / macOS:**
  ```bash
  ./mvnw spring-boot:run
  ```

*(Or if you have Maven installed: `mvn spring-boot:run`)*

The REST API backend will start on **`http://localhost:8080/api`**.

---

### 2. Open Frontend
The frontend is built with pure HTML, CSS, and Vanilla JavaScript and does not require complex build steps or Node packages.

- Simply open `frontend/index.html` in any web browser (Chrome, Edge, Firefox, Safari).
- Or run with VS Code **Live Server** / any static server:
  ```bash
  cd frontend
  # Optional: npx serve or python -m http.server 3000
  ```

*The frontend includes intelligent auto-detection: if the Spring Boot backend is active, it seamlessly executes live REST calls to MySQL; if opened standalone, it activates interactive local preview mode.*

---

## 🔮 Future Enhancements

As outlined in the system roadmap:
- 🔐 **User Authentication & Authorization**: Spring Security with JWT tokens for multi-user support.
- 🥗 **Nutrition & Macro Tracking**: Calorie intake, protein, carbohydrates, and water tracker.
- 📊 **Visual Analytics**: Interactive line and bar charts using Chart.js for long-term weight trends.
- 🤖 **AI Workout Recommendations**: Personalized exercise routines based on BMI and goals.

---

## 📄 License
This project is open-source and developed for educational and portfolio demonstration of Java Full Stack Development.
