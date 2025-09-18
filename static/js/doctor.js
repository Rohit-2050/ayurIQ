// ------------------- Sidebar Logic -------------------
const links = document.querySelectorAll('#menu .nav-link');
const sections = document.querySelectorAll('.content-section');

function showSection(sectionId) {
  // Hide all sections
  sections.forEach(section => section.classList.add('d-none'));

  // Show selected section
  document.getElementById(sectionId).classList.remove('d-none');

  // Update active link
  links.forEach(l => l.classList.remove('active'));
  links.forEach(l => {
    if (l.getAttribute('data-section') === sectionId) {
      l.classList.add('active');
    }
  });

  // If patient section is opened, refresh list
  if (sectionId === "patients") {
    initPatientList();
    showPatientList();
  }

  // If appointments section is opened, render the lists
  if (sectionId === "appointments") {
    renderCalendar();
    renderList();
  }
}

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    showSection(sectionId);
  });
});

// ------------------- Patient Management Logic -------------------

// Sample patient data with lifestyle and family history
let patients = [
  {
    name: "Rahul Kumar",
    age: 45,
    gender: "Male",
    prakriti: "Vata",
    vikriti: "Pitta",
    lifestyle: "High (meditation and diet maintain)",
    familyHistory: "Diabetes",
    lastVisit: "2025-09-10",
    complaint: "Chronic back pain"
  },
  {
    name: "Aishwarya Reddy",
    age: 32,
    gender: "Female",
    prakriti: "Kapha",
    vikriti: "Kapha",
    lifestyle: "Moderate (meditation and diet maintain)",
    familyHistory: "Asthma",
    lastVisit: "2025-09-08",
    complaint: "Frequent headaches"
  },
  {
    name: "Karthik Raj",
    age: 50,
    gender: "Male",
    prakriti: "Pitta",
    vikriti: "Vata",
    lifestyle: "Low (not following a proper plan)",
    familyHistory: "None",
    lastVisit: "2025-09-06",
    complaint: "Joint stiffness"
  },
  {
    name: "Priya Menon",
    age: 29,
    gender: "Female",
    prakriti: "Vata",
    vikriti: "Pitta",
    lifestyle: "High (meditation and diet maintain)",
    familyHistory: "Heart Disease",
    lastVisit: "2025-09-05",
    complaint: "Insomnia"
  },
  {
    name: "Vikram Nair",
    age: 40,
    gender: "Male",
    prakriti: "Kapha",
    vikriti: "Vata",
    lifestyle: "Moderate (meditation and diet maintain)",
    familyHistory: "Diabetes",
    lastVisit: "2025-09-04",
    complaint: "Digestive issues"
  },
  {
    name: "Sneha Iyer",
    age: 35,
    gender: "Female",
    prakriti: "Pitta",
    vikriti: "Kapha",
    lifestyle: "High (meditation and diet maintain)",
    familyHistory: "Thyroid",
    lastVisit: "2025-09-03",
    complaint: "Hair fall"
  },
  {
    name: "Arjun Rao",
    age: 42,
    gender: "Male",
    prakriti: "Vata",
    vikriti: "Pitta",
    lifestyle: "Low (not following a proper plan)",
    familyHistory: "Liver Disorder",
    lastVisit: "2025-09-02",
    complaint: "Fatigue"
  },
  {
    name: "Divya Shankar",
    age: 31,
    gender: "Female",
    prakriti: "Kapha",
    vikriti: "Vata",
    lifestyle: "Moderate (meditation and diet maintain)",
    familyHistory: "Digestive issues",
    lastVisit: "2025-09-01",
    complaint: "Bloating and acidity"
  },
  {
    name: "Madhav Ranganathan",
    age: 38,
    gender: "Male",
    prakriti: "Pitta",
    vikriti: "Kapha",
    lifestyle: "High (meditation and diet maintain)",
    familyHistory: "Respiratory issues",
    lastVisit: "2025-08-30",
    complaint: "Frequent cold and cough"
  },
  {
    name: "Anjali Subramanian",
    age: 28,
    gender: "Female",
    prakriti: "Vata",
    vikriti: "Pitta",
    lifestyle: "High (meditation and diet maintain)",
    familyHistory: "Skin problems",
    lastVisit: "2025-08-29",
    complaint: "Acne and rashes"
  },
  {
    name: "Siddharth Krishnan",
    age: 36,
    gender: "Male",
    prakriti: "Kapha",
    vikriti: "Vata",
    lifestyle: "Moderate (meditation and diet maintain)",
    familyHistory: "Stress-related issues",
    lastVisit: "2025-08-28",
    complaint: "Anxiety and insomnia"
  }
];


// Initialize patient table
function initPatientList() {
  const tbody = document.getElementById("patient-table-body");
  if (!tbody) return; // If table not present yet
  tbody.innerHTML = "";

  patients.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.lastVisit}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="showPatientProfile(${i})">View Profile</button>
        </td>
      </tr>
    `;
  });
}

// Filtering patients by search and filters
function filterPatients() {
  const search = document.getElementById("patient-search").value.toLowerCase();
  const gender = document.getElementById("filter-gender").value;
  const dosha = document.getElementById("filter-dosha").value;

  const filtered = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search);
    const matchesGender = !gender || patient.gender === gender;
    const matchesDosha =
      !dosha || patient.prakriti === dosha || patient.vikriti === dosha;
    return matchesSearch && matchesGender && matchesDosha;
  });

  const tbody = document.getElementById("patient-table-body");
  tbody.innerHTML = "";
  filtered.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.lastVisit}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="showPatientProfile(${i})">View Profile</button>
        </td>
      </tr>
    `;
  });
}

// Show list view
function showPatientList() {
  document.getElementById("patient-list-view").classList.remove("d-none");
  document.getElementById("patient-profile-view").classList.add("d-none");
  document.getElementById("add-patient-view").classList.add("d-none");
}

// Show profile view
function showPatientProfile(index) {
  const p = patients[index];

  // Fill data
  document.getElementById("profile-name").innerText = p.name;
  document.getElementById("summary-name").innerText = p.name;
  document.getElementById("summary-age").innerText = p.age;
  document.getElementById("summary-gender").innerText = p.gender;
  document.getElementById("summary-prakriti").innerText = p.prakriti;
  document.getElementById("summary-vikriti").innerText = p.vikriti;
  document.getElementById("summary-lifestyle").innerText = p.lifestyle;
  document.getElementById("summary-history").innerText = p.familyHistory;
  document.getElementById("summary-complaint").innerText = p.complaint;

  // Switch views
  document.getElementById("patient-list-view").classList.add("d-none");
  document.getElementById("patient-profile-view").classList.remove("d-none");
  document.getElementById("add-patient-view").classList.add("d-none");
}

// Show add form view
function showAddPatientForm() {
  document.getElementById("patient-list-view").classList.add("d-none");
  document.getElementById("patient-profile-view").classList.add("d-none");
  document.getElementById("add-patient-view").classList.remove("d-none");
}

// Save new patient
function saveNewPatient(event) {
  event.preventDefault();

  const newPatient = {
    name: document.getElementById("new-name").value,
    age: document.getElementById("new-age").value,
    gender: document.getElementById("new-gender").value,
    prakriti: document.getElementById("new-prakriti").value,
    vikriti: document.getElementById("new-vikriti").value,
    lifestyle: document.getElementById("new-lifestyle").value, // New field
    familyHistory: document.getElementById("disease-history").value, // New field
    complaint: document.getElementById("new-complaint").value,
    lastVisit: new Date().toISOString().split("T")[0]
  };

  patients.push(newPatient);
  initPatientList();
  showPatientList();

  document.getElementById('viewProfileBtn').addEventListener('click', function () {
    showSection('patients');
});

  // Reset form
  document.getElementById("add-patient-form").reset();
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  initPatientList();
});

// ---------------- Sample Data ----------------
const dietPatients = [
  { id: 1, name: "Rahul Kumar", vikriti: "Pitta", disease: "Diabetes" },
  { id: 2, name: "Aishwarya Reddy", vikriti: "Vata", disease: "Hypertension" },
  { id: 3, name: "Karthik Raj", vikriti: "Kapha", disease: "Arthritis" },
  { id: 4, name: "Priya Menon", vikriti: "Pitta", disease: "PCOS /PCOD" },
  { id: 5, name: "Vikram Nair", vikriti: "Vata", disease: "Hair Fall" },
  { id: 6, name: "Sneha Iyer", vikriti: "Kapha", disease: "Obesity" },
  { id: 7, name: "Arjun Rao", vikriti: "Pitta", disease: "Liver Disorder" },
  { id: 8, name: "Divya Shankar", vikriti: "Vata", disease: "Digestive disorder" },
  { id: 9, name: "Madhav Ranganathan", vikriti: "Kapha", disease: "Respiratory problem" },
  { id: 10, name: "Anjali Subramanian", vikriti: "Pitta", disease: "Skin problem" },
  { id: 11, name: "Siddharth Krishnan", vikriti: "Vata", disease: "Stress / Anxiety" }
];


// const foods = [
//   { id: 1, name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fats: 2, zone: "South" },
//   { id: 2, name: "Chapathi", calories: 120, protein: 3, carbs: 25, fats: 1, zone: "North" },
//   { id: 3, name: "Dosa", calories: 133, protein: 2.7, carbs: 17, fats: 5, zone: "South" },
//   { id: 4, name: "Upma", calories: 150, protein: 3, carbs: 30, fats: 4, zone: "South" },
//   { id: 5, name: "Poha", calories: 130, protein: 2.5, carbs: 28, fats: 1.5, zone: "West" },
//   { id: 6, name: "Idli", calories: 58, protein: 1.6, carbs: 12, fats: 0.4, zone: "South" }
// ];

let foods = []; // global foods array

async function loadFoodsFromBackend(patientId = null) {
  try {
    let url = "http://127.0.0.1:5000/foodsRecomm";
    let options = { method: "POST", headers: { "Content-Type": "application/json" }, body: null };

    if (patientId) {
      const patient = dietPatients.find(p => p.id == patientId);
      if (!patient) return;
      options.body = JSON.stringify({ disease: patient.disease });
    }

    const res = await fetch(url, options);
    const data = await res.json();

    if (res.ok) {
      foods = data.recommended_foods.map(f => ({
        id: f.food_id,
        name: f.food_name,
        calories: f.calories_per_100g,
        protein: f.protein_per_100g,
        carbs: f.carbs_per_100g,
        fats: f.fat_per_100g,
        zone: f.cuisine_region
      }));
      renderFoodTable();
    } else {
      console.error("Error fetching foods:", data.error);
      foods = [];
      renderFoodTable();
    }
  } catch (err) {
    console.error("Failed to fetch foods:", err);
    foods = [];
    renderFoodTable();
  }
}


// ---------------- Global State ----------------
let dietChart = { breakfast: [], lunch: [], dinner: [], snacks: [] };
const savedDietCharts = {};
let currentPopup = null;

// ---------------- Initialization ----------------
// document.addEventListener("DOMContentLoaded", () => {
//   populatePatientDropdown();
//   renderFoodTable();
// });

document.addEventListener("DOMContentLoaded", () => {
  populatePatientDropdown();
});


// ---------------- Populate patient dropdown ----------------
function populatePatientDropdown() {
  const select = document.getElementById("patientSelect");
  select.innerHTML = '<option value="">Select a Patient</option>';
  dietPatients.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
}

// ---------------- Handle patient change ----------------
function handlePatientChange() {
  const patientId = document.getElementById("patientSelect").value;
  const patient = dietPatients.find(p => p.id == patientId);

  if (patient) {
    document.getElementById("patientName").innerText = patient.name;
    document.getElementById("patientVikriti").innerText = patient.vikriti;
    document.getElementById("patientDisease").innerText = patient.disease;
  } else {
    document.getElementById("patientName").innerText = "-";
    document.getElementById("patientVikriti").innerText = "-";
    document.getElementById("patientDisease").innerText = "-";
  }

  // Reset current meal planner
  resetMealPlanner();
  renderSavedCharts();

  // ✅ Fetch foods for this patient
  if (patientId) loadFoodsFromBackend(patientId);
}


// ---------------- Reset meal planner ----------------
function resetMealPlanner() {
  dietChart = { breakfast: [], lunch: [], dinner: [], snacks: [] };
  ["breakfast", "lunch", "dinner", "snacks"].forEach(meal => {
    document.getElementById(meal).innerHTML = "";
  });
}

// ---------------- Food Table Rendering ----------------
function renderFoodTable(filteredFoods = foods) {
  const tbody = document.getElementById("foodTableBody");
  tbody.innerHTML = "";

  filteredFoods.forEach(food => {
    tbody.innerHTML += `
      <tr>
        <td>${food.name}</td>
        <td>${food.calories}</td>
        <td>${food.protein}</td>
        <td>${food.carbs}</td>
        <td>${food.fats}</td>
        <td>${food.zone}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="showMealSelector(event, ${food.id})">
            Add
          </button>
        </td>
      </tr>
    `;
  });
}

// ---------------- Filtering Foods ----------------
function filterFoods() {
  const query = document.getElementById("foodSearch").value.toLowerCase();
  const zone = document.getElementById("zoneFilter").value;

  const filtered = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(query);
    const matchesZone = !zone || food.zone === zone;
    return matchesSearch && matchesZone;
  });

  renderFoodTable(filtered);
}

// ---------------- Floating Meal Selector ----------------
function showMealSelector(event, foodId) {
  // Remove any existing popup
  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }

  // Create popup
  const popup = document.createElement('div');
  popup.classList.add('meal-selector-floating');
  popup.innerHTML = `
    <button class="btn btn-sm btn-outline-primary" onclick="addFoodToMeal('${foodId}', 'breakfast')">Breakfast</button>
    <button class="btn btn-sm btn-outline-primary" onclick="addFoodToMeal('${foodId}', 'lunch')">Lunch</button>
    <button class="btn btn-sm btn-outline-primary" onclick="addFoodToMeal('${foodId}', 'dinner')">Dinner</button>
    <button class="btn btn-sm btn-outline-primary" onclick="addFoodToMeal('${foodId}', 'snacks')">Snacks</button>
  `;

  document.body.appendChild(popup);

  // Position floating popup near button
  const rect = event.target.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  currentPopup = popup;

  // Close popup when clicking outside
  document.addEventListener('click', function handler(e) {
    if (!popup.contains(e.target) && e.target !== event.target) {
      popup.remove();
      currentPopup = null;
      document.removeEventListener('click', handler);
    }
  });
}

// ---------------- Add & Remove Foods ----------------
function addFoodToMeal(foodId, mealType) {
  const food = foods.find(f => f.id == foodId);
  if (!food) return;

  dietChart[mealType].push(food);
  renderMealSection(mealType);

  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }
}

function renderMealSection(mealType) {
  const container = document.getElementById(mealType);
  container.innerHTML = "";

  dietChart[mealType].forEach((food, index) => {
    container.innerHTML += `
      <div class="meal-item">
        <span>${food.name}</span>
        <button onclick="removeFoodFromMeal('${mealType}', ${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });
}

function removeFoodFromMeal(mealType, index) {
  dietChart[mealType].splice(index, 1);
  renderMealSection(mealType);
}

// ---------------- Save Diet Chart ----------------
function saveDietChart() {
  const patientId = document.getElementById("patientSelect").value;
  if (!patientId) {
    alert("Please select a patient before saving.");
    return;
  }

  if (!savedDietCharts[patientId]) {
    savedDietCharts[patientId] = [];
  }

  savedDietCharts[patientId].push(JSON.parse(JSON.stringify(dietChart)));
  resetMealPlanner();
  renderSavedCharts();
  alert("Diet chart saved successfully!");
}

// ---------------- Saved Charts Rendering ----------------
function renderSavedCharts() {
  const patientId = document.getElementById("patientSelect").value;
  const container = document.getElementById("savedDietCharts");

  if (!container) return;

  if (!patientId) {
    container.innerHTML = `<p class="text-muted">Select a patient to view saved diet charts.</p>`;
    return;
  }

  const lists = savedDietCharts[patientId];
  const patient = dietPatients.find(p => p.id == patientId) || { name: 'Unknown', vikriti: '-', disease: '-' };

  if (!lists || lists.length === 0) {
    container.innerHTML = `<p class="text-muted">No diet charts saved yet for <strong>${patient.name}</strong>.</p>`;
    return;
  }

  let html = `<h5>Saved Diet Charts for ${patient.name}</h5><div class="saved-diet-list mt-2">`;
  lists.forEach((chart, idx) => {
    html += `
      <div class="diet-entry">
        <div>
          <strong>${patient.name}</strong>
          <div class="text-muted small">Diet Chart #${idx + 1}</div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-success me-2" onclick="viewDietChart('${patientId}', ${idx})">View</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteSavedChart('${patientId}', ${idx})">Delete</button>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function deleteSavedChart(patientId, index) {
  if (!savedDietCharts[patientId]) return;
  if (!confirm('Delete this diet chart?')) return;
  savedDietCharts[patientId].splice(index, 1);
  renderSavedCharts();
}

// ---------------- Ensure Modal Exists ----------------
function ensureDietChartModal() {
  if (document.getElementById('dietChartModal')) return;

  const modalHtml = `
  <div class="modal fade" id="dietChartModal" tabindex="-1" aria-labelledby="dietChartModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dietChartModalLabel">Diet Chart Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="dietChartModalBody"></div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" id="printDietChartBtn">
            <i class="fas fa-print"></i> Print
          </button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('printDietChartBtn').addEventListener('click', printDietChart);
}

// ---------------- View Diet Chart Modal ----------------
function viewDietChart(patientId, chartIndex) {
  ensureDietChartModal();

  if (!savedDietCharts[patientId] || !savedDietCharts[patientId][chartIndex]) {
    alert('Diet chart not found.');
    return;
  }

  const patient = dietPatients.find(p => p.id == patientId) || { name: 'Unknown', vikriti: '-', disease: '-' };
  const chart = savedDietCharts[patientId][chartIndex];

  let content = `
    <div class="diet-chart-print">
      <h4>${patient.name} — Diet Chart #${chartIndex + 1}</h4>
      <div class="row mb-2">
        <div class="col"><strong>Vikriti:</strong> ${patient.vikriti}</div>
        <div class="col"><strong>Disease:</strong> ${patient.disease}</div>
        <div class="col text-end"><strong>Saved on:</strong> ${new Date().toLocaleString()}</div>
      </div>
      <hr/>
  `;

  function mealTable(mealName, items) {
    if (!items || items.length === 0) return `<p class="text-muted">No items for ${mealName}.</p>`;
    let rows = items.map(i => `
      <tr>
        <td>${i.name}</td>
        <td class="text-end">${i.calories ?? '-'}</td>
        <td class="text-end">${i.protein ?? '-'}</td>
        <td class="text-end">${i.carbs ?? '-'}</td>
        <td class="text-end">${i.fats ?? '-'}</td>
      </tr>
    `).join('');
    return `
      <h5 style="margin-top:12px;">${mealName}</h5>
      <div class="table-responsive">
        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th>Dish</th>
              <th class="text-end">Calories</th>
              <th class="text-end">Protein (g)</th>
              <th class="text-end">Carbs (g)</th>
              <th class="text-end">Fats (g)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  content += mealTable('Breakfast', chart.breakfast);
  content += mealTable('Lunch', chart.lunch);
  content += mealTable('Dinner', chart.dinner);
  content += mealTable('Snacks', chart.snacks);

  content += `</div>`;

  document.getElementById('dietChartModalBody').innerHTML = content;
  const modalEl = document.getElementById('dietChartModal');
  const bsModal = new bootstrap.Modal(modalEl, { backdrop: 'static' });
  bsModal.show();
}

// ---------------- Print Diet Chart ----------------
function printDietChart() {
  const modalBody = document.getElementById("dietChartModalBody");
  if (!modalBody) return;

  const printContent = modalBody.innerHTML;
  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(`
    <html>
      <head>
        <title>Print Diet Chart</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #222; }
          h4 { text-align:center; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 6px 8px; border: 1px solid #ddd; }
          thead th { background: #f8f9fa; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 400);
}
// ---------------- Food Database Logic ----------------
let foodDatabaseData = []; // To store fetched food data

async function loadFoods() {
  const tbody = document.getElementById("food-table-body");
  if (!tbody) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/foods");
    foodDatabaseData = await res.json();
    renderFoodDatabase(foodDatabaseData);
  } catch (error) {
    console.error("Failed to load food data:", error);
    tbody.innerHTML = '<tr><td colspan="17" class="text-danger">Failed to load food data.</td></tr>';
  }
}

function renderFoodDatabase(data) {
  const tbody = document.getElementById("food-table-body");
  tbody.innerHTML = "";
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="17" class="text-center">No foods found.</td></tr>';
    return;
  }
  data.forEach(food => {
    const row = `
      <tr>
        <td>${food.food_id}</td>
        <td>${food.food_name}</td>
        <td>${food.category}</td>
        <td>${food.cuisine_region}</td>
        <td>${food.is_veg ? "Yes" : "No"}</td>
        <td>${food.calories_per_100g}</td>
        <td>${food.protein_per_100g}</td>
        <td>${food.carbs_per_100g}</td>
        <td>${food.fat_per_100g}</td>
        <td>${food.rasa}</td>
        <td>${food.guna}</td>
        <td>${food.virya}</td>
        <td>${food.vipaka}</td>
        <td>${food.dosha_effect}</td>
        <td>${food.digestibility}</td>
        <td>${food.recommended_for_conditions}</td>
        <td>${food.meal_type}</td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function filterFoodDatabase() {
  const search = document.getElementById("foodDbSearch").value.toLowerCase();
  const zone = document.getElementById("foodDbZoneFilter").value;

  const filtered = foodDatabaseData.filter(food => {
    const matchesSearch = food.food_name.toLowerCase().includes(search);
    const matchesZone = !zone || food.cuisine_region === zone;
    return matchesSearch && matchesZone;
  });

  renderFoodDatabase(filtered);
}

// Initial food database load when the section is shown
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class' && mutation.target.id === 'food-database' && !mutation.target.classList.contains('d-none')) {
        loadFoods();
      }
    }
  });
  const foodDbSection = document.getElementById('food-database');
  if (foodDbSection) {
    observer.observe(foodDbSection, { attributes: true });
  }
});

// ========== DATA ==========
let appointmentsData = [
  {
    id: 1,
    patientName: "John Smith",
    date: "2025-09-17",
    time: "10:00 AM",
    reason: "Follow-up for chronic back pain"
  },
  {
    id: 2,
    patientName: "Jane Doe",
    date: "2025-09-20",
    time: "02:30 PM",
    reason: "New patient consultation"
  },
  {
    id: 3,
    patientName: "Michael Johnson",
    date: "2025-09-25",
    time: "11:00 AM",
    reason: "Ayurvedic diet consultation"
  }
];

// ========== VIEW TOGGLE ==========
const calendarViewBtn = document.getElementById('calendarViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const calendarView = document.getElementById('calendarView');
const listView = document.getElementById('listView');

calendarViewBtn.addEventListener('click', () => {
  calendarView.classList.remove('d-none');
  listView.classList.add('d-none');
  calendarViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
  listView.classList.remove('d-none');
  calendarView.classList.add('d-none');
  listViewBtn.classList.add('active');
  calendarViewBtn.classList.remove('active');
});

// ========== MODAL CONTROLS ==========
const addAppointmentBtn = document.getElementById('addAppointmentBtn');
const addAppointmentModal = new bootstrap.Modal(document.getElementById('addAppointmentModal'));

addAppointmentBtn.addEventListener('click', () => addAppointmentModal.show());

// ========== FORM SUBMISSION ==========
const saveAppointmentBtn = document.getElementById('saveAppointmentBtn');
saveAppointmentBtn.addEventListener('click', () => {
  const patientName = document.getElementById('patientNameSelect').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const reason = document.getElementById('appointmentReason').value;

  if (!patientName || !date || !time || !reason) {
    return alert('All fields required');
  }

  const newAppointment = {
    id: Date.now(),
    patientName,
    date,
    time,
    reason
  };

  appointmentsData.push(newAppointment);

  renderCalendar();
  renderList();
  addAppointmentModal.hide();
  document.getElementById('addAppointmentForm').reset();
});

// ========== RENDER FUNCTIONS ==========
function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  calendarGrid.innerHTML = '';
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayAppointments = appointmentsData.filter(
      a => new Date(a.date).getDate() === d && new Date(a.date).getMonth() === month && new Date(a.date).getFullYear() === year
    );

    let apptHtml = '';
    dayAppointments.forEach(a => {
      apptHtml += `<div class="appointment-item" onclick="showDetails(${a.id})">${a.time} - ${a.patientName}</div>`;
    });

    const col = document.createElement('div');
    col.className = 'col-md-2 calendar-day';

    // Add this line to check for appointments and apply the new class
    if (dayAppointments.length > 0) {
      col.classList.add('has-appointment');
    }

    col.innerHTML = `<h6>${d}</h6>${apptHtml}`;
    calendarGrid.appendChild(col);
  }
}

function renderList() {
  const tbody = document.getElementById('appointmentsTableBody');
  tbody.innerHTML = '';
  appointmentsData.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.patientName}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${a.reason}</td>
      <td><button class="btn btn-sm btn-info" onclick="showDetails(${a.id})">View Details</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ========== SHOW DETAILS ==========
window.showDetails = function(id) {
  const appt = appointmentsData.find(a => a.id === id);
  if (!appt) return;
  document.getElementById('detailPatientName').innerText = appt.patientName;
  document.getElementById('detailDate').innerText = appt.date;
  document.getElementById('detailTime').innerText = appt.time;
  document.getElementById('detailReason').innerText = appt.reason;

  const detailsModal = new bootstrap.Modal(document.getElementById('appointmentDetailsModal'));
  detailsModal.show();
}

// Global user settings object
let userSettings = {
  name: "Dr. Varsha",
  title: "Nutrition Specialist",
  bio: "Helping patients achieve a balanced and healthy lifestyle.",
  defaultPage: "dashboard",
  darkModeEnabled: false
};

// Load settings into the form
function loadSettings() {
  document.getElementById("doctorName").value = userSettings.name;
  document.getElementById("doctorTitle").value = userSettings.title;
  document.getElementById("doctorBio").value = userSettings.bio;
  document.getElementById("defaultPage").value = userSettings.defaultPage;
  document.getElementById("darkModeToggle").checked = userSettings.darkModeEnabled;

  document.body.classList.toggle("dark-mode", userSettings.darkModeEnabled);
}

// Show "Saved" alert
function showSaveAlert() {
  const alertBox = document.getElementById("saveAlert");
  alertBox.classList.remove("d-none");
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 2000);
}

// Profile form submit
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  userSettings.name = document.getElementById("doctorName").value;
  userSettings.title = document.getElementById("doctorTitle").value;
  userSettings.bio = document.getElementById("doctorBio").value;
  showSaveAlert();
});

// Preferences form submit
document.getElementById("preferencesForm").addEventListener("submit", function (e) {
  e.preventDefault();
  userSettings.defaultPage = document.getElementById("defaultPage").value;
  userSettings.darkModeEnabled = document.getElementById("darkModeToggle").checked;

  document.body.classList.toggle("dark-mode", userSettings.darkModeEnabled);
  showSaveAlert();
});

// Sidebar Navigation
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  const settingsLink = document.getElementById("settingsLink");
  const settingsPage = document.getElementById("settings");

  // All main content sections
  const allSections = document.querySelectorAll("#dashboard, #appointments, #dietchart, #reports, #settings");

  // Sidebar click event
  settingsLink.addEventListener("click", function (e) {
    e.preventDefault();

    // Hide all other sections
    allSections.forEach(section => section.classList.add("d-none"));

    // Show only settings section
    settingsPage.classList.remove("d-none");

    // Highlight active link
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
    this.classList.add("active");
  });
});

// ========== REPORTS LOGIC ==========

// Demo reports data
let reportsData = [
  { id: 1, patientName: 'John Doe', date: '2025-09-15', reportType: 'Blood Test', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 2, patientName: 'Jane Smith', date: '2025-09-16', reportType: 'X-Ray', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 3, patientName: 'Mike Johnson', date: '2025-09-17', reportType: 'MRI', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

const reportsTableBody = document.querySelector('#reportsTable tbody');
const addReportModalEl = document.getElementById('addReportModal');
const addReportModal = new bootstrap.Modal(addReportModalEl);
const viewReportModalEl = document.getElementById('viewReportModal');
const viewReportModal = new bootstrap.Modal(viewReportModalEl);
const addReportForm = document.getElementById('addReportForm');
const addReportBtn = document.getElementById('addReportBtn');

// Render table
function renderReports() {
  reportsTableBody.innerHTML = '';
  reportsData.forEach((report, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${report.patientName}</td>
      <td>${report.date}</td>
      <td>${report.reportType}</td>
      <td>
        <button class="btn btn-info btn-sm" onclick="viewReport(${report.id})">View</button>
        <button class="btn btn-primary btn-sm" onclick="downloadReport(${report.id})">Download</button>
        <button class="btn btn-danger btn-sm" onclick="deleteReport(${report.id})">Delete</button>
      </td>
    `;
    reportsTableBody.appendChild(tr);
  });
}

// Show Add Report modal
addReportBtn.addEventListener('click', () => {
  addReportForm.reset();
  addReportModal.show();
});

// Handle Add Report form
addReportForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const patientName = document.getElementById('patientName').value.trim();
  const reportType = document.getElementById('reportType').value.trim();
  const reportDate = document.getElementById('reportDate').value;
  
  if (patientName && reportType && reportDate) {
    reportsData.push({
      id: Date.now(), // Generate a unique ID
      patientName,
      date: reportDate,
      reportType,
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    });
    renderReports();
    addReportModal.hide();
  }
});

// View Report
window.viewReport = function(id) {
  const report = reportsData.find(r => r.id === id);
  if (report) {
    document.getElementById('viewReportFrame').src = report.url;
    viewReportModal.show();
  }
}

// Download Report
window.downloadReport = function(id) {
  const report = reportsData.find(r => r.id === id);
  if (report) {
    const a = document.createElement('a');
    a.href = report.url;
    a.download = `${report.patientName}_${report.reportType}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Delete Report
window.deleteReport = function(id) {
  if (confirm('Are you sure you want to delete this report?')) {
    reportsData = reportsData.filter(r => r.id !== id);
    renderReports();
  }
}

// Initial render of the reports table
renderReports();