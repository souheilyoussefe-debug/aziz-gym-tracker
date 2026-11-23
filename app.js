// --- DATA & LOCAL STORAGE ---
const defaultProgram = [
  {
    id: "day-1",
    day: "MON",
    title: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: 60 },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 20 },
      { name: "Triceps Pushdowns", sets: 3, reps: "12-15", weight: 25 }
    ]
  },
  {
    id: "day-2",
    day: "WED",
    title: "Back & Biceps",
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "8-10", weight: 0 },
      { name: "Barbell Row", sets: 3, reps: "10-12", weight: 50 },
      { name: "Dumbbell Bicep Curls", sets: 3, reps: "12", weight: 14 }
    ]
  },
  {
    id: "day-3",
    day: "FRI",
    title: "Legs & Shoulders",
    exercises: [
      { name: "Squat", sets: 4, reps: "8-10", weight: 80 },
      { name: "Leg Press", sets: 3, reps: "12", weight: 120 },
      { name: "Lateral Raises", sets: 4, reps: "15", weight: 10 }
    ]
  }
];

let state = JSON.parse(localStorage.getItem("forge_state")) || {
  program: defaultProgram,
  history: [],
  streak: 0,
  lastWorkoutDate: null
};

let currentDayIndexForEdit = null;
let activeSessionDayIndex = 0;

// Timer variables
let timerSeconds = 90;
let timerInterval = null;

function saveState() {
  localStorage.setItem("forge_state", JSON.stringify(state));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// --- NAVIGATION ---
const viewTitles = {
  dashboard: "Dashboard",
  workout: "My Program",
  history: "History"
};

function switchView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove("active"));

  document.getElementById(`${viewName}-view`).classList.add("active");
  const activeBtn = document.querySelector(`.nav-link[data-view="${viewName}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  document.getElementById("page-title").textContent = viewTitles[viewName];
}

document.querySelectorAll(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.goto));
});

// --- RENDERING UI ---
function renderAll() {
  renderStats();
  renderWeekPreview();
  renderProgram();
  renderHistory();
}

function renderStats() {
  document.getElementById("stat-sessions").textContent = state.history.length;

  const totalVolume = state.history.reduce((sum, session) => sum + session.volume, 0);
  document.getElementById("stat-volume").innerHTML = `${totalVolume.toLocaleString("en-US")} <em>kg</em>`;

  document.getElementById("stat-streak").innerHTML = `${state.streak} <em>days</em>`;
  
  const heroNum = document.querySelector(".hero-number");
  if (heroNum) {
    const nextNum = String(state.history.length + 1).padStart(2, "0");
    heroNum.innerHTML = `${nextNum}<span> / WORKOUT</span>`;
  }
}

function renderWeekPreview() {
  const container = document.getElementById("week-preview");
  if (state.program.length === 0) {
    container.innerHTML = `<div class="empty-state">No days scheduled.</div>`;
    return;
  }

  container.innerHTML = state.program.map((day, index) => `
    <div class="week-item" style="cursor:pointer" onclick="openSessionModal(${index})">
      <div class="day-chip">${day.day}</div>
      <div class="week-info">
        <strong>${day.title}</strong>
        <small>${day.exercises.length} exercise(s)</small>
      </div>
      <span class="week-tag">Start ↗</span>
    </div>
  `).join("");
}

function renderProgram() {
  const container = document.getElementById("program-days");
  if (state.program.length === 0) {
    container.innerHTML = `<div class="empty-state">Click "+ Add a Day" to create your program.</div>`;
    return;
  }

  container.innerHTML = state.program.map((day, dayIndex) => `
    <div class="day-card">
      <div class="day-card-head">
        <div>
          <span class="eyebrow">${day.day}</span>
          <h4>${day.title}</h4>
        </div>
        <button class="delete-ex" title="Delete this day" onclick="deleteDay(${dayIndex})">×</button>
      </div>
      <div>
        ${day.exercises.map((ex, exIndex) => `
          <div class="exercise-row">
            <div class="exercise-symbol">◈</div>
            <div class="exercise-info">
              <strong>${ex.name}</strong>
              <small>${ex.sets} sets × ${ex.reps} reps • ${ex.weight} kg</small>
            </div>
            <button class="delete-ex" onclick="deleteExercise(${dayIndex}, ${exIndex})">×</button>
          </div>
        `).join("")}
      </div>
      <button class="add-ex" onclick="openEditModal(${dayIndex})">＋ Add an Exercise</button>
    </div>
  `).join("");
}

function renderHistory() {
  const container = document.getElementById("history-list");
  if (state.history.length === 0) {
    container.innerHTML = `<div class="empty-state">No workouts recorded yet. Start your first workout!</div>`;
    return;
  }

  container.innerHTML = state.history.map(item => `
    <div class="history-entry">
      <div class="history-date">${item.date}</div>
      <div>
        <strong>${item.title}</strong>
        <small>${item.completedExercises} exercise(s) • Volume: ${item.volume} kg</small>
      </div>
    </div>
  `).join("");
}

// --- PROGRAM MANAGEMENT ---
document.getElementById("add-day").addEventListener("click", () => {
  const dayCode = prompt("Day of the week (ex: MON, TUE, THU...):", "SAT");
  if (!dayCode) return;
  const title = prompt("Workout name (ex: Full Body, Cardio...):", "New Workout");
  if (!title) return;

  state.program.push({
    id: "day-" + Date.now(),
    day: dayCode.toUpperCase().slice(0, 3),
    title: title,
    exercises: []
  });

  saveState();
  renderAll();
  showToast("Day added to program!");
});

window.deleteDay = function(dayIndex) {
  if (confirm("Delete this training day?")) {
    state.program.splice(dayIndex, 1);
    saveState();
    renderAll();
    showToast("Day deleted");
  }
};

window.deleteExercise = function(dayIndex, exIndex) {
  state.program[dayIndex].exercises.splice(exIndex, 1);
  saveState();
  renderAll();
  showToast("Exercise deleted");
};

// --- EXERCISE MODAL ---
window.openEditModal = function(dayIndex) {
  currentDayIndexForEdit = dayIndex;
  document.getElementById("exercise-name").value = "";
  document.getElementById("exercise-sets").value = "3";
  document.getElementById("exercise-reps").value = "10-12";
  document.getElementById("exercise-weight").value = "0";
  document.getElementById("edit-modal").classList.add("show");
};

document.getElementById("save-exercise").addEventListener("click", () => {
  const name = document.getElementById("exercise-name").value.trim();
  const sets = Number(document.getElementById("exercise-sets").value);
  const reps = document.getElementById("exercise-reps").value.trim();
  const weight = Number(document.getElementById("exercise-weight").value);

  if (!name || !sets || !reps) {
    showToast("Please fill in all required fields!");
    return;
  }

  state.program[currentDayIndexForEdit].exercises.push({
    name,
    sets,
    reps,
    weight
  });

  saveState();
  renderAll();
  closeModals();
  showToast("Exercise saved!");
});

// --- WORKOUT SESSION MODAL ---
window.openSessionModal = function(dayIndex = 0) {
  if (state.program.length === 0) {
    showToast("First add a day in 'My Program'");
    return;
  }

  activeSessionDayIndex = dayIndex;
  const session = state.program[dayIndex];

  document.getElementById("session-title").textContent = `${session.day} — ${session.title}`;
  const container = document.getElementById("session-exercises");

  if (session.exercises.length === 0) {
    container.innerHTML = `<div class="empty-state">No exercises in this session.</div>`;
  } else {
    container.innerHTML = session.exercises.map((ex, i) => `
      <label class="session-exercise">
        <input type="checkbox" data-ex-index="${i}" checked>
        <div>
          <strong>${ex.name}</strong>
          <small>${ex.sets} sets × ${ex.reps} reps • ${ex.weight} kg</small>
        </div>
      </label>
    `).join("");
  }

  resetTimer();
  document.getElementById("session-modal").classList.add("show");
};

document.getElementById("start-workout").addEventListener("click", () => openSessionModal(0));
document.getElementById("hero-start").addEventListener("click", () => openSessionModal(0));

document.getElementById("finish-session").addEventListener("click", () => {
  const session = state.program[activeSessionDayIndex];
  const checkboxes = document.querySelectorAll("#session-exercises input[type='checkbox']:checked");

  if (checkboxes.length === 0) {
    showToast("Check at least one completed exercise!");
    return;
  }

  let sessionVolume = 0;
  checkboxes.forEach(cb => {
    const ex = session.exercises[Number(cb.dataset.exIndex)];
    const numericReps = parseInt(ex.reps) || 10;
    sessionVolume += ex.sets * numericReps * (ex.weight || 0);
  });

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { day: "2-digit", month: "short" }).toUpperCase();

  state.history.unshift({
    date: dateStr,
    title: session.title,
    completedExercises: checkboxes.length,
    volume: sessionVolume
  });

  // Streak update
  const todayISO = today.toISOString().split("T")[0];
  if (state.lastWorkoutDate !== todayISO) {
    state.streak += 1;
    state.lastWorkoutDate = todayISO;
  }

  saveState();
  renderAll();
  closeModals();
  showToast("Workout finished! Great job!");
});

// --- REST TIMER ---
function updateTimerDisplay() {
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const secs = String(timerSeconds % 60).padStart(2, "0");
  document.getElementById("timer-display").textContent = `${mins}:${secs}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 90;
  document.getElementById("timer-toggle").textContent = "Start";
  updateTimerDisplay();
}

document.getElementById("timer-toggle").addEventListener("click", function() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    this.textContent = "Resume";
  } else {
    this.textContent = "Pause";
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById("timer-toggle").textContent = "Start";
        showToast("Rest time is up! Let's go!");
      }
    }, 1000);
  }
});

document.getElementById("timer-minus").addEventListener("click", () => {
  timerSeconds = Math.max(0, timerSeconds - 30);
  updateTimerDisplay();
});

document.getElementById("timer-reset").addEventListener("click", resetTimer);

// --- MODAL CLOSE ---
function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("show"));
  clearInterval(timerInterval);
  timerInterval = null;
}

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", closeModals);
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModals();
  });
});

// --- INITIALIZATION ---
const options = { weekday: "long", day: "numeric", month: "long" };
document.getElementById("today-label").textContent = new Date().toLocaleDateString("en-US", options).toUpperCase();
renderAll();