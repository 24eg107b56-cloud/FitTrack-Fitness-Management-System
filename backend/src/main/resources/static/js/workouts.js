/* ========================================================
   FitTrack - Workouts Page Script
   ======================================================== */

let allWorkouts = [];
let currentCategoryFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initWorkoutsPage();
});

async function initWorkoutsPage() {
  // Set default date
  const dateInput = document.getElementById('workoutDate');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  // Auto-estimate calories on duration input change
  const durInput = document.getElementById('workoutDuration');
  const calInput = document.getElementById('workoutCalories');
  if (durInput && calInput) {
    durInput.addEventListener('input', () => {
      const mins = parseInt(durInput.value) || 0;
      if (mins > 0 && !calInput.dataset.manual) {
        calInput.value = Math.round(mins * 7.5);
      }
    });
    calInput.addEventListener('input', () => {
      calInput.dataset.manual = 'true';
    });
  }

  // Category filter pills
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategoryFilter = pill.dataset.category || 'all';
      renderWorkoutsTable();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchWorkouts');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderWorkoutsTable();
    });
  }

  // Form submission
  const form = document.getElementById('workoutForm');
  if (form) {
    form.addEventListener('submit', handleWorkoutSubmit);
  }

  await loadWorkouts();
}

async function loadWorkouts() {
  const data = await fetchAPI('/workouts');
  allWorkouts = Array.isArray(data) ? data : [];
  updateWorkoutMetrics();
  renderWorkoutsTable();
}

function updateWorkoutMetrics() {
  const totalCountEl = document.getElementById('kpiTotalWorkouts');
  const totalMinsEl = document.getElementById('kpiTotalMinutes');
  const totalCalsEl = document.getElementById('kpiTotalCalories');

  if (totalCountEl) totalCountEl.innerText = allWorkouts.length;

  const totalMinutes = allWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
  if (totalMinsEl) {
    const hrs = Math.floor(totalMinutes / 60);
    const remMins = totalMinutes % 60;
    totalMinsEl.innerText = hrs > 0 ? `${hrs}h ${remMins}m` : `${remMins}m`;
  }

  const totalCalories = allWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  if (totalCalsEl) totalCalsEl.innerText = Math.round(totalCalories) + ' kcal';
}

function renderWorkoutsTable() {
  const tableBody = document.getElementById('workoutsTableBody');
  if (!tableBody) return;

  const searchQuery = (document.getElementById('searchWorkouts')?.value || '').toLowerCase();

  const filtered = allWorkouts.filter(w => {
    const matchesCategory = currentCategoryFilter === 'all' || 
      (w.category && w.category.toLowerCase() === currentCategoryFilter.toLowerCase());
    const matchesSearch = !searchQuery || 
      (w.exerciseName && w.exerciseName.toLowerCase().includes(searchQuery)) ||
      (w.notes && w.notes.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
          No matching workouts found. Click "+ Add Workout" to record a new session!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(w => `
    <tr>
      <td><strong>${formatDate(w.workoutDate)}</strong></td>
      <td>
        <strong>${escapeHtml(w.exerciseName)}</strong>
        ${w.notes ? `<div style="font-size:0.8rem; color:var(--text-subtle);">${escapeHtml(w.notes)}</div>` : ''}
      </td>
      <td>
        <span class="badge badge-${(w.category || 'strength').toLowerCase()}">
          ${escapeHtml(w.category || 'Strength')}
        </span>
      </td>
      <td>${w.sets} sets × ${w.repetitions} reps</td>
      <td>${w.weightKg ? w.weightKg + ' kg' : '--'}</td>
      <td>
        <div>${w.durationMinutes ? w.durationMinutes + ' mins' : '--'}</div>
        <small style="color:var(--text-muted);">${w.caloriesBurned ? Math.round(w.caloriesBurned) + ' kcal' : ''}</small>
      </td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteWorkout(${w.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function handleWorkoutSubmit(e) {
  e.preventDefault();

  const workoutPayload = {
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

  const res = await fetchAPI('/workouts', {
    method: 'POST',
    body: JSON.stringify(workoutPayload)
  });

  if (res) {
    showToast('Workout successfully saved!');
    closeModal('workoutModal');
    document.getElementById('workoutForm').reset();
    document.getElementById('workoutCalories').removeAttribute('data-manual');
    document.getElementById('workoutDate').value = new Date().toISOString().split('T')[0];
    await loadWorkouts();
  }
}

async function deleteWorkout(id) {
  if (confirm('Are you sure you want to delete this workout entry?')) {
    await fetchAPI(`/workouts/${id}`, { method: 'DELETE' });
    showToast('Workout deleted');
    await loadWorkouts();
  }
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
