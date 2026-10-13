/* ========================================================
   FitTrack - Central Configuration & API Utility
   ======================================================== */

const API_BASE = 'http://localhost:8080/api';

// Fallback in-memory state for immediate browser preview before backend is launched
const MOCK_DB = {
  workouts: [
    { id: 1, exerciseName: 'Barbell Bench Press', category: 'Strength', sets: 4, repetitions: 10, weightKg: 65.0, durationMinutes: 30, caloriesBurned: 225.0, workoutDate: '2026-10-10', notes: 'Good chest pump' },
    { id: 2, exerciseName: 'Barbell Squats', category: 'Strength', sets: 4, repetitions: 12, weightKg: 80.0, durationMinutes: 35, caloriesBurned: 270.0, workoutDate: '2026-10-11', notes: 'Focused on quad depth' },
    { id: 3, exerciseName: 'Treadmill Interval Run', category: 'Cardio', sets: 1, repetitions: 1, weightKg: 0.0, durationMinutes: 25, caloriesBurned: 210.0, workoutDate: '2026-10-12', notes: 'High intensity interval' },
    { id: 4, exerciseName: 'Pull-Ups & Rows', category: 'Strength', sets: 4, repetitions: 10, weightKg: 55.0, durationMinutes: 30, caloriesBurned: 220.0, workoutDate: '2026-10-12', notes: 'Lat engagement' },
    { id: 5, exerciseName: 'Dumbbell Bicep Curls', category: 'Strength', sets: 3, repetitions: 12, weightKg: 14.0, durationMinutes: 20, caloriesBurned: 140.0, workoutDate: '2026-10-13', notes: 'Strict form' }
  ],
  weights: [
    { id: 1, weightKg: 76.5, heightCm: 175.0, bmi: 25.0, bmiCategory: 'Overweight', recordDate: '2026-09-15', notes: 'Initial start measurement' },
    { id: 2, weightKg: 75.8, heightCm: 175.0, bmi: 24.8, bmiCategory: 'Normal weight', recordDate: '2026-09-25', notes: 'Cardio consistency' },
    { id: 3, weightKg: 74.6, heightCm: 175.0, bmi: 24.4, bmiCategory: 'Normal weight', recordDate: '2026-10-05', notes: 'Feeling lighter' },
    { id: 4, weightKg: 73.5, heightCm: 175.0, bmi: 24.0, bmiCategory: 'Normal weight', recordDate: '2026-10-13', notes: 'Healthy steady drop' }
  ],
  goals: [
    { id: 1, title: 'Reach 70 kg Target Weight', goalType: 'WEIGHT_LOSS', targetValue: 70.0, startValue: 76.5, currentValue: 73.5, unit: 'kg', targetDate: '2026-11-30', status: 'IN_PROGRESS', progressPercentage: 46, notes: 'Steady reduction' },
    { id: 2, title: 'Complete 20 Workouts this Month', goalType: 'WORKOUT_COUNT', targetValue: 20.0, startValue: 0.0, currentValue: 12.0, unit: 'workouts', targetDate: '2026-10-31', status: 'IN_PROGRESS', progressPercentage: 60, notes: 'Consistency milestone' },
    { id: 3, title: 'Bench Press 80 kg', goalType: 'STRENGTH', targetValue: 80.0, startValue: 60.0, currentValue: 65.0, unit: 'kg', targetDate: '2026-12-15', status: 'IN_PROGRESS', progressPercentage: 25, notes: 'Strength progression' }
  ]
};

let isBackendConnected = false;

/**
 * Universal Fetch wrapper with backend detection and graceful fallback
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      updateBackendStatus(true);
      if (response.status === 204) {
        return null; // No content
      }
      return await response.json();
    } else {
      throw new Error(`HTTP error ${response.status}`);
    }
  } catch (error) {
    updateBackendStatus(false);
    console.warn(`[FitTrack API Notice] Backend not reachable at ${API_BASE}${endpoint}. Using mock client store.`);
    return handleMockFallback(endpoint, options);
  }
}

/**
 * Mock Fallback Handler for zero-setup demo
 */
function handleMockFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();

  // DASHBOARD
  if (endpoint === '/dashboard/stats') {
    const totalMinutes = MOCK_DB.workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
    const totalCalories = MOCK_DB.workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const latestWeight = MOCK_DB.weights[MOCK_DB.weights.length - 1];

    return {
      totalWorkouts: MOCK_DB.workouts.length,
      totalDurationMinutes: totalMinutes,
      totalCaloriesBurned: totalCalories,
      currentWeight: latestWeight ? latestWeight.weightKg : null,
      currentBmi: latestWeight ? latestWeight.bmi : null,
      bmiCategory: latestWeight ? latestWeight.bmiCategory : 'No Record',
      activeGoalsCount: MOCK_DB.goals.filter(g => g.status === 'IN_PROGRESS').length,
      completedGoalsCount: MOCK_DB.goals.filter(g => g.status === 'COMPLETED').length,
      recentWorkouts: [...MOCK_DB.workouts].reverse().slice(0, 5),
      recentWeightRecords: [...MOCK_DB.weights].reverse().slice(0, 7),
      activeGoals: MOCK_DB.goals.filter(g => g.status === 'IN_PROGRESS')
    };
  }

  // WORKOUTS
  if (endpoint.startsWith('/workouts')) {
    if (method === 'GET') {
      return [...MOCK_DB.workouts].reverse();
    }
    if (method === 'POST') {
      const data = JSON.parse(options.body);
      data.id = Date.now();
      if (!data.caloriesBurned && data.durationMinutes) {
        data.caloriesBurned = Math.round(data.durationMinutes * 7.5 * 10) / 10;
      }
      MOCK_DB.workouts.push(data);
      return data;
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      MOCK_DB.workouts = MOCK_DB.workouts.filter(w => w.id !== id);
      return null;
    }
  }

  // WEIGHTS
  if (endpoint.startsWith('/weights')) {
    if (endpoint === '/weights/calculate-bmi' && method === 'POST') {
      const req = JSON.parse(options.body);
      const hM = req.heightCm / 100.0;
      const bmi = Math.round((req.weightKg / (hM * hM)) * 10) / 10;
      let cat = 'Normal weight';
      let rec = 'Great job! Maintain your balanced nutrition and consistent exercise routine.';
      if (bmi < 18.5) {
        cat = 'Underweight';
        rec = 'Focus on nutrient-dense meals and resistance training to build healthy muscle mass.';
      } else if (bmi >= 30.0) {
        cat = 'Obese';
        rec = 'Consult a health professional and focus on low-impact cardio, gradual diet adjustments, and consistency.';
      } else if (bmi >= 25.0) {
        cat = 'Overweight';
        rec = 'Incorporate a mix of cardiovascular exercises and moderate caloric deficit.';
      }
      return { weightKg: req.weightKg, heightCm: req.heightCm, bmi: bmi, category: cat, healthRecommendation: rec };
    }
    if (method === 'GET') {
      return [...MOCK_DB.weights].reverse();
    }
    if (method === 'POST') {
      const data = JSON.parse(options.body);
      data.id = Date.now();
      const hM = data.heightCm / 100.0;
      data.bmi = Math.round((data.weightKg / (hM * hM)) * 10) / 10;
      data.bmiCategory = data.bmi < 18.5 ? 'Underweight' : data.bmi < 25.0 ? 'Normal weight' : data.bmi < 30.0 ? 'Overweight' : 'Obese';
      MOCK_DB.weights.push(data);
      return data;
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      MOCK_DB.weights = MOCK_DB.weights.filter(w => w.id !== id);
      return null;
    }
  }

  // GOALS
  if (endpoint.startsWith('/goals')) {
    if (method === 'GET') {
      return [...MOCK_DB.goals].reverse();
    }
    if (method === 'POST') {
      const data = JSON.parse(options.body);
      data.id = Date.now();
      data.status = data.status || 'IN_PROGRESS';
      data.progressPercentage = Math.round(((data.currentValue || 0) / data.targetValue) * 100);
      MOCK_DB.goals.push(data);
      return data;
    }
    if (method === 'PATCH' && endpoint.includes('/status')) {
      const id = parseInt(endpoint.split('/')[2]);
      const data = JSON.parse(options.body);
      const goal = MOCK_DB.goals.find(g => g.id === id);
      if (goal) {
        goal.status = data.status;
        if (data.status === 'COMPLETED') goal.progressPercentage = 100;
      }
      return goal;
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/')[2]);
      MOCK_DB.goals = MOCK_DB.goals.filter(g => g.id !== id);
      return null;
    }
  }

  return [];
}

/**
 * Updates UI status pill and banner
 */
function updateBackendStatus(connected) {
  isBackendConnected = connected;
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const banner = document.getElementById('offlineBanner');

  if (statusDot && statusText) {
    if (connected) {
      statusDot.className = 'status-dot online';
      statusText.innerText = 'Backend Connected';
      if (banner) banner.style.display = 'none';
    } else {
      statusDot.className = 'status-dot offline';
      statusText.innerText = 'Preview Mode (Offline)';
      if (banner) banner.style.display = 'flex';
    }
  }
}

/**
 * Shows temporary toast message
 */
function showToast(message, isSuccess = true) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderColor = isSuccess ? 'var(--primary)' : 'var(--accent-rose)';
  toast.innerHTML = `<span>${isSuccess ? '✓' : '⚠️'}</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

/**
 * Formats date into readable string (e.g., Oct 12, 2026)
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return dateStr;
}

// Global modal helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}
