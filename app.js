// =========================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9_3X-TAqDJstEwcbnTuLuvh0Ym6OY6TnQVAeq4-h1x0T6-aCNTJPXh4ozHo-E68jA/exec";
// =========================================================================

// --- CRYPTO HELPER (SHA-256 PASSWORD HASHING) ---
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// --- EXERCISE LIBRARY ---
const exerciseLibrary = {
  "Bench Press": {
    category: "Chest & Push",
    purpose: "Primary compound movement for building overall chest thickness, front deltoid strength, and triceps lockout power.",
    image: "",
    video: "https://youtu.be/rT7DgCr-3pg?si=qUI6EoMYEJsR8XzX"
  },
  "Incline Dumbbell Press": {
    category: "Chest & Push",
    purpose: "Targets the upper clavicular head of the pectorals while improving shoulder stability and unilateral balance.",
    image: "",
    video: "https://www.youtube.com/watch?v=8iPEnn-ltC8"
  },
  "Dumbbell Flyes": {
    category: "Chest & Push",
    purpose: "Isolates the pectoral muscles through a deep horizontal adduction stretch.",
    image: "",
    video: "https://www.youtube.com/watch?v=eozdVDA78K0"
  },
  "Push-ups": {
    category: "Chest & Push",
    purpose: "Bodyweight compound push building chest endurance, triceps strength, and anterior core stability.",
    image: "",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4"
  },
  "Dips": {
    category: "Chest & Push",
    purpose: "Heavy compound push targeting lower chest fibers, front delts, and triceps.",
    image: "",
    video: "https://www.youtube.com/watch?v=2z8JmcrW-As"
  },
  "Pull-ups": {
    category: "Back & Pull",
    purpose: "Builds upper-body pulling strength and widens the latissimus dorsi (lats) for a strong back.",
    image: "",
    video: "https://www.youtube.com/watch?v=eGo4IYlbE5g"
  },
  "Barbell Row": {
    category: "Back & Pull",
    purpose: "Develops mid-back thickness, rhomboids, traps, and posterior chain stability.",
    image: "",
    video: "https://www.youtube.com/watch?v=FWJR5Ve8bnQ"
  },
  "Lat Pulldowns": {
    category: "Back & Pull",
    purpose: "Targets the latissimus dorsi with controlled vertical pulling resistance.",
    image: "",
    video: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
  },
  "Seated Cable Row": {
    category: "Back & Pull",
    purpose: "Builds mid-back density, rear deltoids, and scapular retraction control.",
    image: "",
    video: "https://www.youtube.com/watch?v=GZbfZ033f74"
  },
  "Single-Arm Dumbbell Row": {
    category: "Back & Pull",
    purpose: "Unilateral pulling exercise to isolate each lat and fix left-to-right strength imbalances.",
    image: "",
    video: "https://www.youtube.com/watch?v=pYcpY20QaE8"
  },
  "Squat": {
    category: "Legs & Lower Body",
    purpose: "Full lower-body compound lift targeting quadriceps, glutes, hamstrings, and core bracing.",
    image: "",
    video: "https://www.youtube.com/watch?v=ultWZbUMPL8"
  },
  "Leg Press": {
    category: "Legs & Lower Body",
    purpose: "Allows heavy quad and glute loading with back support to maximize leg hypertrophy.",
    image: "",
    video: "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
  },
  "Romanian Deadlift (RDL)": {
    category: "Legs & Lower Body",
    purpose: "Hip-hinge movement focusing on hamstring stretch, glute power, and lower-back strength.",
    image: "",
    video: "https://www.youtube.com/watch?v=JCXUYuzwNrM"
  },
  "Bulgarian Split Squats": {
    category: "Legs & Lower Body",
    purpose: "Unilateral lower-body exercise building single-leg quad/glute strength, hip mobility, and balance.",
    image: "",
    video: "https://www.youtube.com/watch?v=2C-uNgKwPLE"
  },
  "Calf Raises": {
    category: "Legs & Lower Body",
    purpose: "Isolates the gastrocnemius and soleus muscles for ankle stability and calf development.",
    image: "",
    video: "https://www.youtube.com/watch?v=-M4-G8p8fmc"
  },
  "Overhead Press": {
    category: "Shoulders & Arms",
    purpose: "Compound vertical press building anterior/lateral deltoid strength, triceps, and core stability.",
    image: "",
    video: "https://www.youtube.com/watch?v=2yjwXTZQDDI"
  },
  "Lateral Raises": {
    category: "Shoulders & Arms",
    purpose: "Isolates the side (lateral) deltoids to build broader shoulder width.",
    image: "",
    video: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
  },
  "Dumbbell Bicep Curls": {
    category: "Shoulders & Arms",
    purpose: "Isolates the biceps brachii and brachialis to build arm size and elbow flexion strength.",
    image: "",
    video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
  },
  "Triceps Pushdowns": {
    category: "Shoulders & Arms",
    purpose: "Isolates the lateral and medial heads of the triceps with constant cable tension.",
    image: "",
    video: "https://www.youtube.com/watch?v=2-LAMcpzODU"
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

// --- SESSION & STATE MANAGEMENT ---
let currentUser = JSON.parse(localStorage.getItem("forge_current_user")) || null;
let state = { program: defaultProgram, history: [], streak: 0, lastWorkoutDate: null };

function getUserStorageKey() {
  return currentUser ? `forge_state_${currentUser.email}` : "forge_state_guest";
}

function loadUserState() {
  const saved = JSON.parse(localStorage.getItem(getUserStorageKey()));
  state = saved || {
    program: JSON.parse(JSON.stringify(defaultProgram)),
    history: [],
    streak: 0,
    lastWorkoutDate: null
  };
}

function saveState() {
  localStorage.setItem(getUserStorageKey(), JSON.stringify(state));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// --- AUTHENTICATION LOGIC ---
const authScreen = document.getElementById("auth-screen");
const appShell = document.getElementById("app-shell");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authError = document.getElementById("auth-error");

function updateAuthUI() {
  if (currentUser) {
    authScreen.style.display = "none";
    appShell.style.display = "flex";
    document.getElementById("user-display-name").textContent = currentUser.name;
    document.getElementById("user-display-email").textContent = currentUser.email;
    document.getElementById("user-avatar").textContent = currentUser.name.charAt(0).toUpperCase();
    loadUserState();
    renderAll();
  } else {
    authScreen.style.display = "flex";
    appShell.style.display = "none";
  }
}

tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  authError.textContent = "";
});

tabSignup.addEventListener("click", () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  authError.textContent = "";
});

// Handle Sign Up
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.textContent = "";

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;
  const submitBtn = document.getElementById("signup-submit");

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  try {
    const passwordHash = await hashPassword(password);
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "signup", name, email, passwordHash })
    });
    const result = await response.json();

    if (result.status === "success") {
      currentUser = { name: result.name, email: result.email };
      localStorage.setItem("forge_current_user", JSON.stringify(currentUser));
      updateAuthUI();
      showToast(`Welcome to FORGE, ${result.name}!`);
    } else {
      authError.textContent = result.message || "Sign up failed.";
    }
  } catch (err) {
    authError.textContent = "Connection error. Check network or script permissions.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
});

// Handle Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.textContent = "";

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;
  const submitBtn = document.getElementById("login-submit");

  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  try {
    const passwordHash = await hashPassword(password);
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", email, passwordHash })
    });
    const result = await response.json();

    if (result.status === "success") {
      currentUser = { name: result.name, email: result.email };
      localStorage.setItem("forge_current_user", JSON.stringify(currentUser));
      updateAuthUI();
      showToast(`Welcome back, ${result.name}!`);
    } else {
      authError.textContent = result.message || "Invalid email or password.";
    }
  } catch (err) {
    authError.textContent = "Connection error. Check network or script permissions.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Log In";
  }
});

// Handle Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("forge_current_user");
  currentUser = null;
  updateAuthUI();
  showToast("Logged out safely.");
});

// --- POPULATE PRESET EXERCISE DROPDOWN ---
function populateExerciseSelect() {
  const select = document.getElementById("exercise-preset");
  if (!select) return;

  const categories = {};
  Object.entries(exerciseLibrary).forEach(([name, data]) => {
    const cat = data.category || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  });

  Object.entries(categories).forEach(([cat, names]) => {
    const group = document.createElement("optgroup");
    group.label = cat;
    names.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      group.appendChild(option);
    });
    select.appendChild(group);
  });

  select.addEventListener("change", () => {
    const selectedName = select.value;
    const nameInput = document.getElementById("exercise-name");
    const purposeInput = document.getElementById("exercise-purpose");
    const imageInput = document.getElementById("exercise-image");
    const videoInput = document.getElementById("exercise-video");

    if (selectedName && exerciseLibrary[selectedName]) {
      const preset = exerciseLibrary[selectedName];
      nameInput.value = selectedName;
      purposeInput.value = preset.purpose || "";
      imageInput.value = preset.image || "";
      videoInput.value = preset.video || "";
    } else {
      nameInput.value = "";
      purposeInput.value = "";
      imageInput.value = "";
      videoInput.value = "";
    }
  });
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
  document.getElementById("guide-title").textContent = ex.name;
  document.getElementById("guide-purpose").textContent = ex.purpose || "Builds strength, control, and muscular endurance.";
  
  const imgEl = document.getElementById("guide-img");
  if (ex.image) {
    imgEl.style.display = "block";
    imgEl.src = ex.image;
  } else {
    imgEl.style.display = "none";
    imgEl.src = "";
  }

  const videoWrapper = document.getElementById("guide-video-wrapper");
  const videoEl = document.getElementById("guide-video");
  if (ex.video) {
    videoWrapper.style.display = "block";
    videoEl.src = formatYouTubeEmbed(ex.video);
  } else {
    videoWrapper.style.display = "none";
    videoEl.src = "";
  }

  document.getElementById("guide-modal").classList.add("show");
};

function closeGuideModal() {
  document.getElementById("guide-modal").classList.remove("show");
  document.getElementById("guide-video").src = "";
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

// --- PROGRAM & EXERCISE MANAGEMENT ---
let currentDayIndexForEdit = null;
let activeSessionDayIndex = 0;
let timerSeconds = 90;
let timerInterval = null;

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

window.openEditModal = function(dayIndex) {
  currentDayIndexForEdit = dayIndex;
  document.getElementById("exercise-preset").value = "";
  document.getElementById("exercise-name").value = "";
  document.getElementById("exercise-sets").value = "3";
  document.getElementById("exercise-reps").value = "10-12";
  document.getElementById("exercise-weight").value = "0";
  document.getElementById("exercise-purpose").value = "";
  document.getElementById("exercise-image").value = "";
  document.getElementById("exercise-video").value = "";
  document.getElementById("edit-modal").classList.add("show");
};

document.getElementById("save-exercise").addEventListener("click", () => {
  if (currentDayIndexForEdit === null) return;

  const name = document.getElementById("exercise-name").value.trim();
  const sets = parseInt(document.getElementById("exercise-sets").value) || 3;
  const reps = document.getElementById("exercise-reps").value.trim() || "10";
  const weight = parseFloat(document.getElementById("exercise-weight").value) || 0;
  const purpose = document.getElementById("exercise-purpose").value.trim();
  const image = document.getElementById("exercise-image").value.trim();
  const video = document.getElementById("exercise-video").value.trim();

  if (!name) {
    alert("Please enter or select an exercise name.");
    return;
  }

  const preset = exerciseLibrary[name] || {};
  state.program[currentDayIndexForEdit].exercises.push({
    name,
    sets,
    reps,
    weight,
    purpose: purpose || preset.purpose || "Builds overall muscular strength and stability.",
    image: image || preset.image || "",
    video: video || preset.video || ""
  });

  saveState();
  renderAll();
  document.getElementById("edit-modal").classList.remove("show");
  showToast("Exercise added!");
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("show"));
    stopTimer();
  });
});

// --- WORKOUT SESSION & TIMER ---
document.getElementById("hero-start").addEventListener("click", () => openSessionModal(0));
document.getElementById("start-workout").addEventListener("click", () => openSessionModal(0));

window.openSessionModal = function(dayIndex) {
  activeSessionDayIndex = dayIndex;
  const day = state.program[dayIndex];
  if (!day) return;

  document.getElementById("session-title").textContent = `${day.day} — ${day.title}`;
  const exercisesContainer = document.getElementById("session-exercises");

  if (day.exercises.length === 0) {
    exercisesContainer.innerHTML = `<div class="empty-state">No exercises in this workout. Add some in My Program first!</div>`;
  } else {
    exercisesContainer.innerHTML = day.exercises.map((ex, i) => `
      <div class="session-exercise">
        <input type="checkbox" id="sess-ex-${i}" data-index="${i}">
        <div>
          <strong>${ex.name}</strong>
          <small>${ex.sets} sets × ${ex.reps} reps • ${ex.weight} kg</small>
        </div>
        <button type="button" class="info-btn" onclick="openExerciseGuide(${dayIndex}, ${i})">Guide</button>
      </div>
    `).join("");
  }

  document.getElementById("session-modal").classList.add("show");
  resetTimer();
};

function updateTimerDisplay() {
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const secs = String(timerSeconds % 60).padStart(2, "0");
  document.getElementById("timer-display").textContent = `${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return;
  document.getElementById("timer-toggle").textContent = "Pause";
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
      showToast("Rest time is up! Get back to work!");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("timer-toggle").textContent = "Start";
}

function resetTimer() {
  stopTimer();
  timerSeconds = 90;
  updateTimerDisplay();
}

document.getElementById("timer-toggle").addEventListener("click", () => timerInterval ? stopTimer() : startTimer());
document.getElementById("timer-minus").addEventListener("click", () => { timerSeconds = Math.max(0, timerSeconds - 30); updateTimerDisplay(); });
document.getElementById("timer-reset").addEventListener("click", resetTimer);

document.getElementById("finish-session").addEventListener("click", () => {
  const day = state.program[activeSessionDayIndex];
  if (!day) return;

  let sessionVolume = 0;
  day.exercises.forEach(ex => {
    const avgReps = parseInt(ex.reps) || 10;
    sessionVolume += (ex.sets * avgReps * ex.weight);
  });

  const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const todayDateKey = new Date().toDateString();
  if (state.lastWorkoutDate !== todayDateKey) {
    state.streak += 1;
    state.lastWorkoutDate = todayDateKey;
  }

  state.history.unshift({
    date: todayStr,
    title: `${day.day}: ${day.title}`,
    completedExercises: day.exercises.length,
    volume: sessionVolume
  });

  saveState();
  renderAll();
  document.getElementById("session-modal").classList.remove("show");
  stopTimer();
  showToast("Workout completed & saved!");
});

// Initialize
populateExerciseSelect();
updateAuthUI();
