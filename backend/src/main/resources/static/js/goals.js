/* ========================================================
   FitTrack - Goals Page Script
   ======================================================== */

let allGoals = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initGoalsPage();
});

async function initGoalsPage() {
  const form = document.getElementById('goalForm');
  if (form) {
    // default target date 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    const dateInput = document.getElementById('targetDate');
    if (dateInput) dateInput.value = d.toISOString().split('T')[0];

    form.addEventListener('submit', handleGoalSubmit);
  }

  // Filter pills
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.status || 'all';
      renderGoalsGrid();
    });
  });

  await loadGoals();
}

async function loadGoals() {
  const data = await fetchAPI('/goals');
  allGoals = Array.isArray(data) ? data : [];
  updateGoalStats();
  renderGoalsGrid();
}

function updateGoalStats() {
  const activeCount = allGoals.filter(g => g.status === 'IN_PROGRESS').length;
  const completedCount = allGoals.filter(g => g.status === 'COMPLETED').length;

  const activeEl = document.getElementById('kpiActiveGoals');
  const completedEl = document.getElementById('kpiCompletedGoals');

  if (activeEl) activeEl.innerText = activeCount;
  if (completedEl) completedEl.innerText = completedCount;
}

function renderGoalsGrid() {
  const container = document.getElementById('goalsGrid');
  if (!container) return;

  const filtered = allGoals.filter(g => {
    if (currentFilter === 'all') return true;
    return (g.status || '').toLowerCase() === currentFilter.toLowerCase();
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); color: var(--text-muted);">
        No goals found. Click "+ Set New Goal" to start planning your fitness achievements!
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(g => {
    const isCompleted = g.status === 'COMPLETED';
    const pct = isCompleted ? 100 : (g.progressPercentage || 0);

    return `
      <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="goal-header">
            <span class="badge ${isCompleted ? 'badge-completed' : 'badge-in-progress'}">
              ${isCompleted ? 'Completed' : 'In Progress'}
            </span>
            <small style="color: var(--text-subtle);">Due: ${formatDate(g.targetDate)}</small>
          </div>

          <h3 style="font-size: 1.18rem; margin: 8px 0 12px; color: var(--text-main); font-weight: 700;">
            ${escapeHtml(g.title)}
          </h3>

          <div class="progress-container">
            <div class="progress-bar" style="width: ${Math.min(100, Math.max(5, pct))}%;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-top: 6px; color: var(--text-muted);">
            <span>Current: <strong>${g.currentValue || 0} ${escapeHtml(g.unit || '')}</strong></span>
            <span>Target: <strong>${g.targetValue} ${escapeHtml(g.unit || '')}</strong></span>
          </div>

          ${g.notes ? `<p style="font-size: 0.85rem; color: var(--text-subtle); margin-top: 10px;">${escapeHtml(g.notes)}</p>` : ''}
        </div>

        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <div>
            ${!isCompleted ? `
              <button class="btn btn-secondary btn-sm" onclick="promptUpdateProgress(${g.id}, ${g.currentValue || 0}, '${escapeHtml(g.unit || '')}')">Update</button>
              <button class="btn btn-primary btn-sm" onclick="markGoalCompleted(${g.id})">Complete</button>
            ` : `
              <button class="btn btn-secondary btn-sm" onclick="reopenGoal(${g.id})">Reopen</button>
            `}
          </div>
          <button class="btn btn-danger btn-sm" onclick="deleteGoal(${g.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

async function handleGoalSubmit(e) {
  e.preventDefault();

  const payload = {
    title: document.getElementById('goalTitle').value.trim(),
    goalType: document.getElementById('goalType').value,
    targetValue: parseFloat(document.getElementById('targetValue').value),
    startValue: parseFloat(document.getElementById('startValue').value) || 0,
    currentValue: parseFloat(document.getElementById('currentValue').value) || 0,
    unit: document.getElementById('goalUnit').value.trim(),
    targetDate: document.getElementById('targetDate').value,
    status: 'IN_PROGRESS',
    notes: document.getElementById('goalNotes').value.trim()
  };

  const res = await fetchAPI('/goals', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res) {
    showToast('Goal created successfully!');
    closeModal('goalModal');
    document.getElementById('goalForm').reset();
    await loadGoals();
  }
}

async function promptUpdateProgress(id, currentVal, unit) {
  const newVal = prompt(`Update current value (in ${unit}):`, currentVal);
  if (newVal !== null && newVal.trim() !== '') {
    const val = parseFloat(newVal);
    if (!isNaN(val)) {
      await fetchAPI(`/goals/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ currentValue: val })
      });
      showToast('Goal progress updated');
      await loadGoals();
    }
  }
}

async function markGoalCompleted(id) {
  await fetchAPI(`/goals/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'COMPLETED' })
  });
  showToast('Goal marked as completed! 🎉');
  await loadGoals();
}

async function reopenGoal(id) {
  await fetchAPI(`/goals/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'IN_PROGRESS' })
  });
  showToast('Goal reopened to In Progress');
  await loadGoals();
}

async function deleteGoal(id) {
  if (confirm('Are you sure you want to delete this fitness goal?')) {
    await fetchAPI(`/goals/${id}`, { method: 'DELETE' });
    showToast('Goal deleted');
    await loadGoals();
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
