/* ========================================================
   FitTrack - Dashboard Script
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  setupEventListeners();
});

async function loadDashboardData() {
  const stats = await fetchAPI('/dashboard/stats');
  if (!stats) return;

  // 1. KPI Cards
  const totalWorkoutsEl = document.getElementById('totalWorkouts');
  if (totalWorkoutsEl) totalWorkoutsEl.innerText = stats.totalWorkouts || 0;

  const totalTimeEl = document.getElementById('totalTime');
  if (totalTimeEl) {
    const mins = stats.totalDurationMinutes || 0;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    totalTimeEl.innerText = hrs > 0 ? `${hrs}h ${remMins}m` : `${remMins}m`;
  }

  const totalCaloriesEl = document.getElementById('totalCalories');
  if (totalCaloriesEl) {
    totalCaloriesEl.innerText = Math.round(stats.totalCaloriesBurned || 0) + ' kcal';
  }

  const currentWeightBmiEl = document.getElementById('currentWeightBmi');
  const bmiBadgeEl = document.getElementById('bmiBadge');
  if (currentWeightBmiEl) {
    if (stats.currentWeight) {
      currentWeightBmiEl.innerText = `${stats.currentWeight} kg`;
      if (bmiBadgeEl) {
        bmiBadgeEl.innerText = `BMI: ${stats.currentBmi || '--'} (${stats.bmiCategory || 'Normal'})`;
        bmiBadgeEl.className = `badge badge-${getBmiBadgeClass(stats.bmiCategory)}`;
      }
    } else {
      currentWeightBmiEl.innerText = '-- kg';
      if (bmiBadgeEl) bmiBadgeEl.innerText = 'No records yet';
    }
  }

  // 2. Recent Workouts Table
  const recentWorkoutsBody = document.getElementById('recentWorkoutsTable');
  if (recentWorkoutsBody) {
    if (!stats.recentWorkouts || stats.recentWorkouts.length === 0) {
      recentWorkoutsBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--text-muted);">No workouts logged yet. Click "+ Log Workout" to start!</td></tr>`;
    } else {
      recentWorkoutsBody.innerHTML = stats.recentWorkouts.map(w => `
        <tr>
          <td>
            <strong>${escapeHtml(w.exerciseName)}</strong>
            <div style="font-size:0.78rem; color:var(--text-subtle);">${formatDate(w.workoutDate)}</div>
          </td>
          <td><span class="badge badge-${(w.category || 'strength').toLowerCase()}">${escapeHtml(w.category || 'Strength')}</span></td>
          <td>${w.sets} sets × ${w.repetitions} reps</td>
          <td>${w.weightKg ? w.weightKg + ' kg' : '--'}</td>
          <td>${w.caloriesBurned ? Math.round(w.caloriesBurned) + ' kcal' : '--'}</td>
        </tr>
      `).join('');
    }
  }

  // 3. Active Goals List
  const activeGoalsContainer = document.getElementById('activeGoalsContainer');
  if (activeGoalsContainer) {
    if (!stats.activeGoals || stats.activeGoals.length === 0) {
      activeGoalsContainer.innerHTML = `<div style="text-align:center; padding: 24px; color: var(--text-muted); font-size: 0.9rem;">No active goals yet. Click "+ Set Goal" to track your targets!</div>`;
    } else {
      activeGoalsContainer.innerHTML = stats.activeGoals.map(g => {
        const pct = g.progressPercentage || 0;
        return `
          <div class="goal-card-item">
            <div class="goal-header">
              <span class="goal-title">${escapeHtml(g.title)}</span>
              <span class="badge badge-in-progress">${pct}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${Math.min(100, Math.max(5, pct))}%;"></div>
            </div>
            <div class="goal-metrics">
              <span>Target: <strong>${g.targetValue} ${escapeHtml(g.unit || '')}</strong></span>
              <span>Due: ${formatDate(g.targetDate)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function getBmiBadgeClass(category) {
  if (!category) return 'normal';
  const c = category.toLowerCase();
  if (c.includes('under')) return 'underweight';
  if (c.includes('normal')) return 'normal';
  if (c.includes('over')) return 'overweight';
  if (c.includes('obese')) return 'obese';
  return 'normal';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setupEventListeners() {
  // Quick Log Workout Form
  const quickWorkoutForm = document.getElementById('quickWorkoutForm');
  if (quickWorkoutForm) {
    // Set default date to today
    const dateInput = document.getElementById('workoutDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    quickWorkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newWorkout = {
        exerciseName: document.getElementById('exerciseName').value.trim(),
        category: document.getElementById('workoutCategory').value,
        sets: parseInt(document.getElementById('workoutSets').value) || 0,
        repetitions: parseInt(document.getElementById('workoutReps').value) || 0,
        weightKg: parseFloat(document.getElementById('workoutWeight').value) || 0,
        durationMinutes: parseInt(document.getElementById('workoutDuration').value) || 0,
        caloriesBurned: parseFloat(document.getElementById('workoutCalories').value) || null,
        workoutDate: document.getElementById('workoutDate').value,
        notes: document.getElementById('workoutNotes').value.trim()
      };

      await fetchAPI('/workouts', {
        method: 'POST',
        body: JSON.stringify(newWorkout)
      });

      closeModal('workoutModal');
      quickWorkoutForm.reset();
      showToast('Workout successfully recorded!');
      loadDashboardData();
    });
  }

  // Quick Log Weight Form
  const quickWeightForm = document.getElementById('quickWeightForm');
  if (quickWeightForm) {
    const weightDateInput = document.getElementById('weightDate');
    if (weightDateInput) weightDateInput.value = new Date().toISOString().split('T')[0];

    quickWeightForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const weightData = {
        weightKg: parseFloat(document.getElementById('weightKg').value),
        heightCm: parseFloat(document.getElementById('heightCm').value),
        recordDate: document.getElementById('weightDate').value,
        notes: document.getElementById('weightNotes').value.trim()
      };

      await fetchAPI('/weights', {
        method: 'POST',
        body: JSON.stringify(weightData)
      });

      closeModal('weightModal');
      quickWeightForm.reset();
      showToast('Weight record and BMI updated!');
      loadDashboardData();
    });
  }
}
