/* ========================================================
   FitTrack - BMI & Weight Tracker Script
   ======================================================== */

let allWeightRecords = [];

document.addEventListener('DOMContentLoaded', () => {
  initBmiPage();
});

async function initBmiPage() {
  const calcForm = document.getElementById('bmiCalcForm');
  if (calcForm) {
    calcForm.addEventListener('submit', handleCalculateBmi);
  }

  const logForm = document.getElementById('logWeightForm');
  if (logForm) {
    const dateInput = document.getElementById('recordDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    logForm.addEventListener('submit', handleLogWeight);
  }

  await loadWeightHistory();
}

async function loadWeightHistory() {
  const data = await fetchAPI('/weights');
  allWeightRecords = Array.isArray(data) ? data : [];
  updateLatestDisplay();
  renderWeightTable();
}

function updateLatestDisplay() {
  if (allWeightRecords.length === 0) return;

  const latest = allWeightRecords[0]; // ordered desc
  const currentWeightEl = document.getElementById('latestWeightVal');
  const latestBmiEl = document.getElementById('latestBmiVal');
  const latestCategoryEl = document.getElementById('latestCategoryBadge');

  if (currentWeightEl) currentWeightEl.innerText = `${latest.weightKg} kg`;
  if (latestBmiEl) latestBmiEl.innerText = latest.bmi;
  if (latestCategoryEl) {
    latestCategoryEl.innerText = latest.bmiCategory;
    latestCategoryEl.className = `badge badge-${getBmiBadgeClass(latest.bmiCategory)}`;
  }
}

async function handleCalculateBmi(e) {
  e.preventDefault();
  const weight = parseFloat(document.getElementById('calcWeight').value);
  const height = parseFloat(document.getElementById('calcHeight').value);

  if (!weight || !height) return;

  const res = await fetchAPI('/weights/calculate-bmi', {
    method: 'POST',
    body: JSON.stringify({ weightKg: weight, heightCm: height })
  });

  if (res) {
    displayBmiResult(res.bmi, res.category, res.healthRecommendation);
  }
}

function displayBmiResult(bmi, category, recommendation) {
  const resultCard = document.getElementById('bmiResultCard');
  const scoreEl = document.getElementById('resultBmiScore');
  const categoryEl = document.getElementById('resultCategory');
  const adviceEl = document.getElementById('resultAdvice');
  const markerEl = document.getElementById('bmiMarker');

  if (resultCard) resultCard.style.display = 'block';
  if (scoreEl) scoreEl.innerText = bmi;
  if (categoryEl) {
    categoryEl.innerText = category;
    categoryEl.className = `badge badge-${getBmiBadgeClass(category)}`;
  }
  if (adviceEl) adviceEl.innerText = recommendation;

  // Calculate needle position: 15 to 35 range (map to 0% to 100%)
  if (markerEl) {
    let pct = ((bmi - 15) / 20) * 100;
    pct = Math.max(2, Math.min(98, pct));
    markerEl.style.left = `${pct}%`;
  }
}

async function handleLogWeight(e) {
  e.preventDefault();
  const weight = parseFloat(document.getElementById('logWeightKg').value);
  const height = parseFloat(document.getElementById('logHeightCm').value);
  const recordDate = document.getElementById('recordDate').value;
  const notes = document.getElementById('recordNotes').value.trim();

  if (!weight || !height) return;

  const payload = {
    weightKg: weight,
    heightCm: height,
    recordDate: recordDate,
    notes: notes
  };

  const res = await fetchAPI('/weights', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res) {
    showToast('Weight & BMI record successfully saved!');
    closeModal('weightModal');
    document.getElementById('logWeightForm').reset();
    document.getElementById('recordDate').value = new Date().toISOString().split('T')[0];
    await loadWeightHistory();
  }
}

function renderWeightTable() {
  const tableBody = document.getElementById('weightHistoryTableBody');
  if (!tableBody) return;

  if (allWeightRecords.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 36px; color: var(--text-muted);">
          No weight entries recorded yet. Click "+ Log Weight Record" to start tracking!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = allWeightRecords.map(r => `
    <tr>
      <td><strong>${formatDate(r.recordDate)}</strong></td>
      <td><strong>${r.weightKg} kg</strong></td>
      <td>${r.heightCm} cm</td>
      <td><span style="font-size: 1.1rem; font-weight: 700;">${r.bmi}</span></td>
      <td><span class="badge badge-${getBmiBadgeClass(r.bmiCategory)}">${escapeHtml(r.bmiCategory)}</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteWeightRecord(${r.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteWeightRecord(id) {
  if (confirm('Are you sure you want to delete this weight log?')) {
    await fetchAPI(`/weights/${id}`, { method: 'DELETE' });
    showToast('Weight record deleted');
    await loadWeightHistory();
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
