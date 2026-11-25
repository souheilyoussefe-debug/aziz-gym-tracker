// --- EXERCISE LIBRARY & DEFAULT PROGRAM ---
const exerciseLibrary = {
  "Bench Press": {
    purpose: "Primary compound movement for building overall chest thickness, front deltoid strength, and triceps lockout power.",
    image: "",
    video: "https://youtu.be/rT7DgCr-3pg?si=qUI6EoMYEJsR8XzX"
  },
  "Incline Dumbbell Press": {
    purpose: "Targets the upper clavicular head of the pectorals while improving shoulder stability and unilateral balance.",
    image: "",
    video: "https://www.youtube.com/watch?v=8iPEnn-ltC8"
  },
  "Triceps Pushdowns": {
    purpose: "Isolates the lateral and medial heads of the triceps with constant cable tension for stronger pressing.",
    image: "",
    video: "https://www.youtube.com/watch?v=2-LAMcpzODU"
  },
  "Pull-ups": {
    purpose: "Builds upper-body pulling strength and widens the latissimus dorsi (lats) for a strong V-taper back.",
    image: "",
    video: "https://www.youtube.com/watch?v=eGo4IYlbE5g"
  },
  "Barbell Row": {
    purpose: "Develops mid-back thickness, rhomboids, traps, and posterior chain stability.",
    image: "",
    video: "https://www.youtube.com/watch?v=FWJR5Ve8bnQ"
  },
  "Dumbbell Bicep Curls": {
    purpose: "Isolates the biceps brachii and brachialis to build arm size and elbow flexion strength.",
    image: "",
    video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
  },
  "Squat": {
    purpose: "Full lower-body compound lift targeting quadriceps, glutes, hamstrings, and core bracing.",
    image: "",
    video: "https://www.youtube.com/watch?v=ultWZbUMPL8"
  },
  "Leg Press": {
    purpose: "Allows heavy quad and glute loading with back support to maximize leg hypertrophy.",
    image: "",
    video: "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
  },
  "Lateral Raises": {
    purpose: "Isolates the side (lateral) deltoids to create broader, wider-looking shoulders.",
    image: "",
    video: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
  }
};

const defaultProgram = [
  {
    id: "day-1",
    day: "MON",
    title: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: 60, ...exerciseLibrary["Bench Press"] },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 20, ...exerciseLibrary["Incline Dumbbell Press"] },
      { name: "Triceps Pushdowns", sets: 3, reps: "12-15", weight: 25, ...exerciseLibrary["Triceps Pushdowns"] }
    ]
  },
  {
    id: "day-2",
    day: "WED",
    title: "Back & Biceps",
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "8-10", weight: 0, ...exerciseLibrary["Pull-ups"] },
      { name: "Barbell Row", sets: 3, reps: "10-12", weight: 50, ...exerciseLibrary["Barbell Row"] },
      { name: "Dumbbell Bicep Curls", sets: 3, reps: "12", weight: 14, ...exerciseLibrary["Dumbbell Bicep Curls"] }
    ]
  },
  {
    id: "day-3",
    day: "FRI",
    title: "Legs & Shoulders",
    exercises: [
      { name: "Squat", sets: 4, reps: "8-10", weight: 80, ...exerciseLibrary["Squat"] },
      { name: "Leg Press", sets: 3, reps: "12", weight: 120, ...exerciseLibrary["Leg Press"] },
      { name: "Lateral Raises", sets: 4, reps: "15", weight: 10, ...exerciseLibrary["Lateral Raises"] }
    ]
  }
];

let state = JSON.parse(localStorage.getItem("forge_state")) || {
  program: defaultProgram,
  history: [],
  streak: 0,
  lastWorkoutDate: null
};

// Automatically enrich/update any previously saved exercises with the correct preset data
state.program.forEach(day => {
  day.exercises.forEach(ex => {
    const preset = exerciseLibrary[ex.name];
    if (preset) {
      ex.purpose = preset.purpose;
      ex.image = preset.image;
      ex.video = preset.video;
    }
  });
});

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
  if (!toast) return;
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

  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) targetView.classList.add("active");
  
  const activeBtn = document.querySelector(`.nav-link[data-view="${viewName}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = viewTitles[viewName];
}

document.querySelectorAll(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.goto));
});

// --- EXERCISE GUIDE MODAL ---
function formatYouTubeEmbed(url) {
  if (!url) return "";
  if (url.includes("embed/")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

window.openExerciseGuide = function(dayIndex, exIndex) {
  const ex = state.program[dayIndex].exercises[exIndex];
  const guideTitle = document.getElementById("guide-title");
  const guidePurpose = document.getElementById("guide-purpose");
  const imgEl = document.getElementById("guide-img");
  const videoWrapper = document.getElementById("guide-video-wrapper");
  const videoEl = document.getElementById("guide-video");
  const guideModal = document.getElementById("guide-modal");

  if (guideTitle) guideTitle.textContent = ex.name;
  if (guidePurpose) guidePurpose.textContent = ex.purpose || "Builds strength, control, and muscular endurance in the targeted muscle group.";
  
  if (imgEl) {
    if (ex.image) {
      imgEl.style.display = "block";
      imgEl.src = ex.image;
    } else {
      imgEl.style.display = "none";
      imgEl.src = "";
    }
  }

  if (videoWrapper && videoEl) {
    if (ex.video) {
      videoWrapper.style.display = "block";
      videoEl.src = formatYouTubeEmbed(ex.video);
    } else {
      videoWrapper.style.display = "none";
      videoEl.src = "";
    }
  }

  if (guideModal) guideModal.classList.add("show");
};

function closeGuideModal() {
  const guideModal = document.getElementById("guide-modal");
  const videoEl = document.getElementById("guide-video");
  if (guideModal) guideModal.classList.remove("show");
  if (videoEl) videoEl.src = "";
}

document.querySelectorAll("[data-close-guide]").forEach(btn => {
  btn.addEventListener("click", closeGuideModal);
});

// --- RENDERING UI ---
function renderAll() {
  renderStats();
  renderWeekPreview();
  renderProgram();
  renderHistory();
}

function renderStats() {
  const statSessions = document.getElementById("stat-sessions");
  if (statSessions) statSessions.textContent = state.history.length;

  const totalVolume = state.history.reduce((sum, session) => sum + session.volume, 0);
  const statVolume = document.getElementById("stat-volume");
  if (statVolume) statVolume.innerHTML = `${totalVolume.toLocaleString("en-US")} <em>kg</em>`;

  const statStreak = document.getElementById("stat-streak");
  if (statStreak) statStreak.innerHTML = `${state.streak} <em>days</em>`;

  const heroNum = document.querySelector(".hero-number");
  if (heroNum) {
    const nextNum = String(state.history.length + 1).padStart(2, "0");
    heroNum.innerHTML = `${nextNum}<span> / WORKOUT</span>`;
  }
}

function renderWeekPreview() {
  const container = document.getElementById("week-preview");
  if (!container) return;
  
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
  if (!container) return;

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
            <div class="exercise-info" onclick="openExerciseGuide(${dayIndex}, ${exIndex})">
              <strong>${ex.name}</strong>
              <small>${ex.sets} sets × ${ex.reps} reps • ${ex.weight} kg</small>
            </div>
            <button type="button" class="info-btn" onclick="openExerciseGuide(${dayIndex}, ${exIndex})">Guide</button>
            <button type="button" class="delete-ex" onclick="deleteExercise(${dayIndex}, ${exIndex})">×</button>
          </div>
        `).join("")}
      </div>
      <button type="button" class="add-ex" onclick="openEditModal(${dayIndex})">＋ Add an Exercise</button>
    </div>
  `).join("");
}

function renderHistory() {
  const container = document.getElementById("history-list");
  if (!container) return;

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
const addDayBtn = document.getElementById("add-day");
if (addDayBtn) {
  addDayBtn.addEventListener("click", () => {
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
}

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
  const exName = document.getElementById("exercise-name");
  const exSets = document.getElementById("exercise-sets");
  const exReps = document.getElementById("exercise-reps");
  const exWeight = document.getElementById("exercise-weight");
  const exPurpose = document.getElementById("exercise-purpose");
  const exImage = document.getElementById("exercise-image");
  const exVideo = document.getElementById("exercise-video");
  const editModal = document.getElementById("edit-modal");

  if (exName) exName.value = "";
  if (exSets) exSets.value = "3";
  if (exReps) exReps.value = "10-12";
  if (exWeight) exWeight.value = "0";
  if (exPurpose) exPurpose.value = "";
  if (exImage) exImage.value = "";
  if (exVideo) exVideo.value = "";
  if (editModal) editModal.classList.add("show");
};

const saveExerciseBtn = document.getElementById("save-exercise");
if (saveExerciseBtn) {
  saveExerciseBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("exercise-name");
    const setsInput = document.getElementById("exercise-sets");
    const repsInput = document.getElementById("exercise-reps");
    const weightInput = document.getElementById("exercise-weight");
    const purposeInput = document.getElementById("exercise-purpose");
    const imageInput = document.getElementById("exercise-image");
    const videoInput = document.getElementById("exercise-video");

    const name = nameInput ? nameInput.value.trim() : "";
    const sets = setsInput ? Number(setsInput.value) : 3;
    const reps = repsInput ? repsInput.value.trim() : "10-12";
    const weight = weightInput ? Number(weightInput.value) : 0;
    const preset = exerciseLibrary[name];

    const purpose = purposeInput && purposeInput.value.trim() ? purposeInput.value.trim() : (preset ? preset.purpose : "");
    const image = imageInput && imageInput.value.trim() ? imageInput.value.trim() : (preset ? preset.image : "");
    const video = videoInput && videoInput.value.trim() ? videoInput.value.trim() : (preset ? preset.video : "");

    if (!name || !sets || !reps) {
      showToast("Please fill in all required fields!");
      return;
    }

    state.program[currentDayIndexForEdit].exercises.push({
      name,
      sets,
      reps,
      weight,
      purpose,
      image,
      video
    });

    saveState();
    renderAll();
    closeModals();
    showToast("Exercise saved!");
  });
}

// --- WORKOUT SESSION MODAL ---
window.openSessionModal = function(dayIndex = 0) {
  if (state.program.length === 0) {
    showToast("First add a day in 'My Program'");
    return;
  }

  activeSessionDayIndex = dayIndex;
  const session = state.program[dayIndex];

  const sessionTitle = document.getElementById("session-title");
  if (sessionTitle) sessionTitle.textContent = `${session.day} — ${session.title}`;
  
  const container = document.getElementById("session-exercises");
  if (!container) return;

  if (session.exercises.length === 0) {
    container.innerHTML = `<div class="empty-state">No exercises in this session.</div>`;
  } else {
    container.innerHTML = session.exercises.map((ex, i) => `
      <div class="session-exercise">
        <input type="checkbox" data-ex-index="${i}" checked>
        <div class="exercise-info" onclick="openExerciseGuide(${dayIndex}, ${i})">
          <strong>${ex.name}</strong>
          <small>${ex.sets} sets × ${ex.reps} reps • ${ex.weight} kg</small>
        </div>
        <button type="button" class="info-btn" onclick="openExerciseGuide(${dayIndex}, ${i})">Guide</button>
      </div>
    `).join("");
  }

  resetTimer();
  const sessionModal = document.getElementById("session-modal");
  if (sessionModal) sessionModal.classList.add("show");
};

const startWorkoutBtn = document.getElementById("start-workout");
if (startWorkoutBtn) {
  startWorkoutBtn.addEventListener("click", () => openSessionModal(0));
}

const heroStartBtn = document.getElementById("hero-start");
if (heroStartBtn) {
  heroStartBtn.addEventListener("click", () => openSessionModal(0));
}

const finishSessionBtn = document.getElementById("finish-session");
if (finishSessionBtn) {
  finishSessionBtn.addEventListener("click", () => {
    const session = state.program[activeSessionDayIndex];
    const checkboxes = document.querySelectorAll("#session-exercises input[type='checkbox']:checked");

    if (checkboxes.length === 0) {
      showToast("Check at least one completed exercise!");
      return;
    }

    let sessionVolume = 0;
    checkboxes.forEach(cb => {
      const exIndex = Number(cb.dataset.exIndex);
      const ex = session.exercises[exIndex];
      if (ex) {
        const numericReps = parseInt(ex.reps) || 10;
        sessionVolume += ex.sets * numericReps * (ex.weight || 0);
      }
    });

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { day: "2-digit", month: "short" }).toUpperCase();

    state.history.unshift({
      date: dateStr,
      title: session.title,
      completedExercises: checkboxes.length,
      volume: sessionVolume
    });

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
}

// --- REST TIMER ---
function updateTimerDisplay() {
  const display = document.getElementById("timer-display");
  if (!display) return;
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const secs = String(timerSeconds % 60).padStart(2, "0");
  display.textContent = `${mins}:${secs}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 90;
  const timerToggle = document.getElementById("timer-toggle");
  if (timerToggle) timerToggle.textContent = "Start";
  updateTimerDisplay();
}

const timerToggleBtn = document.getElementById("timer-toggle");
if (timerToggleBtn) {
  timerToggleBtn.addEventListener("click", function() {
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
          const toggle = document.getElementById("timer-toggle");
          if (toggle) toggle.textContent = "Start";
          showToast("Rest time is up! Let's go!");
        }
      }, 1000);
    }
  });
}

const timerMinusBtn = document.getElementById("timer-minus");
if (timerMinusBtn) {
  timerMinusBtn.addEventListener("click", () => {
    timerSeconds = Math.max(0, timerSeconds - 30);
    updateTimerDisplay();
  });
}

const timerResetBtn = document.getElementById("timer-reset");
if (timerResetBtn) {
  timerResetBtn.addEventListener("click", resetTimer);
}

// --- MODAL CLOSE ---
function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("show"));
  closeGuideModal();
  clearInterval(timerInterval);
  timerInterval = null;
}

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", closeModals);
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      if (backdrop.id === "guide-modal") {
        closeGuideModal();
      } else {
        closeModals();
      }
    }
  });
});

// --- INITIALIZATION ---
const todayLabel = document.getElementById("today-label");
if (todayLabel) {
  const options = { weekday: "long", day: "numeric", month: "long" };
  todayLabel.textContent = new Date().toLocaleDateString("en-US", options).toUpperCase();
}
renderAll();
