/* ═══════════════════════════════════════════════════════════════════
   Productivity Haven — app.js
   All application logic: state, auth, navigation, feature renderers,
   audio engine, pomodoro timer, tasks, habits, mood, stats, settings.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── CONSTANTS ────────────────────────────────────────────────────── */
const MOTIVATIONAL = [
  "You're doing amazing! 🌸",
  "One task at a time, you've got this 🩷",
  "Future you will thank you 🌊",
  "Progress is still progress 🐱",
  "Keep going, you're closer than you think ✨",
  "A little effort every day creates big results 🌼",
  "You are capable of wonderful things 🦋",
  "Rest is productive too 🌙",
  "Small wins still count! 🎀",
  "You've got the heart of a champion 🏆",
];

const QUOTES = [
  { t: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { t: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
  { t: "Done is better than perfect.", a: "Sheryl Sandberg" },
  { t: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { t: "It always seems impossible until it's done.", a: "Nelson Mandela" },
];

const MOODS = [
  { emoji: "✨", label: "Amazing", color: "#F9E4A0" },
  { emoji: "🌸", label: "Good",    color: "#FFD6E8" },
  { emoji: "🌱", label: "Okay",    color: "#B8F0D4" },
  { emoji: "🌧",  label: "Low",    color: "#B8E0F7" },
  { emoji: "🌪",  label: "Rough",  color: "#D4B8F0" },
];

const CATS = ["Personal", "Work", "Health", "Creative", "Study", "Home"];
const PRIS = ["low", "medium", "high"];

const SOUNDS = [
  { id: "ocean", icon: "🌊", label: "Ocean Waves" },
  { id: "rain",  icon: "🌧",  label: "Rain Sounds" },
  { id: "study", icon: "☕",  label: "Study Café"  },
];

const HABIT_ICONS = [
  "🌸","💧","📚","🏃","🧘","🌿","☀️","🎨","✍️","🎵","🥗","😴","💊","🧹","🌙",
];

/* ─── LOCAL STORAGE HELPERS ────────────────────────────────────────── */
function ls(k, d) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
  catch { return d; }
}

function ss(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

/* ─── APP STATE ────────────────────────────────────────────────────── */
let state = {
  users:        ls("ph_users", []),
  currentUser:  ls("ph_user", null),
  tasks:        ls("ph_tasks", []),
  habits:       ls("ph_habits", []),
  moods:        ls("ph_moods", []),
  settings:     ls("ph_settings", { sound: true, notifs: true, dailyGoal: 5, theme: "auto" }),
  currentPage:  "dashboard",
  pomMode:      "focus",
  pomTime:      25 * 60,
  pomRunning:   false,
  pomSessions:  0,
  pomInterval:  null,
  activeSound:  null,
  soundVol:     50,
  authTab:      "login",
  taskSearch:       "",
  taskPriFilter:    "all",
  taskStatusFilter: "all",
  editTaskId:   null,
  formData:     { title: "", category: "Personal", priority: "medium", dueDate: "", notes: "" },
  showTaskForm:  false,
  showHabitForm: false,
  newHabit:      { name: "", icon: "🌸" },
};

function save() {
  ss("ph_tasks",   state.tasks);
  ss("ph_habits",  state.habits);
  ss("ph_moods",   state.moods);
  ss("ph_settings",state.settings);
  ss("ph_users",   state.users);
  ss("ph_user",    state.currentUser);
}

/* ─── THEME ─────────────────────────────────────────────────────────── */
function isNight() {
  const h = new Date().getHours();
  const theme = state.settings.theme;
  if (theme === "dark")  return true;
  if (theme === "light") return false;
  return h >= 20 || h < 6;
}

function applyTheme() {
  if (isNight()) document.body.classList.add("night");
  else           document.body.classList.remove("night");
}

/* ─── TOAST NOTIFICATIONS ───────────────────────────────────────────── */
function showToast(msg, type = "success") {
  const el = document.getElementById("toast-container");
  const colors = {
    success:    { bg: "#FFD6E8", border: "#F4A7C3", icon: "🌸" },
    motivation: { bg: "#FFF9E0", border: "#D4A820", icon: "✨" },
    error:      { bg: "#FFE4E8", border: "#D4446A", icon: "⚠️" },
  };
  const c   = colors[type] || colors.success;
  const div = document.createElement("div");
  div.className = "toast";
  div.style.background  = c.bg;
  div.style.borderColor = c.border;
  div.innerHTML = `
    <span style="font-size:20px">${c.icon}</span>
    <span style="font-size:14px;font-weight:600;color:#3D2B40;font-family:'Nunito',sans-serif">${msg}</span>
  `;
  el.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

function showMotivation() {
  showToast(MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)], "motivation");
}

/* ─── FLOATING BUBBLES ──────────────────────────────────────────────── */
function initBubbles() {
  const container = document.getElementById("bubbles-container");
  const emojis = ["🫧","🫧","🐚","⭐","🌸","💫","🫧"];
  for (let i = 0; i < 10; i++) {
    const d = document.createElement("div");
    d.className = "bubble";
    d.style.left            = Math.random() * 100 + "%";
    d.style.fontSize        = (14 + Math.random() * 18) + "px";
    d.style.animationDelay  = Math.random() * 10 + "s";
    d.style.animationDuration = (10 + Math.random() * 14) + "s";
    d.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    container.appendChild(d);
  }
}

/* ─── AUTH ──────────────────────────────────────────────────────────── */
let currentAuthTab = "login";

function switchAuthTab(tab) {
  currentAuthTab = tab;
  document.getElementById("tab-login").className    = "tab-btn" + (tab === "login"    ? " active" : "");
  document.getElementById("tab-register").className = "tab-btn" + (tab === "register" ? " active" : "");
  document.getElementById("name-field").style.display    = tab === "register" ? "block" : "none";
  document.getElementById("confirm-field").style.display = tab === "register" ? "block" : "none";
  document.getElementById("auth-heading").textContent    = tab === "login" ? "Welcome back 🩷" : "Create account";
  document.getElementById("auth-sub").textContent        = tab === "login"
    ? "Ready to be productive today?"
    : "Start your productivity journey today";
  document.getElementById("auth-btn").textContent        = tab === "login" ? "Login 🌸" : "Create account 🌸";
  document.getElementById("auth-err").style.display      = "none";
}

function handleAuth() {
  const email  = document.getElementById("auth-email").value;
  const pass   = document.getElementById("auth-password").value;
  const errEl  = document.getElementById("auth-err");
  errEl.style.display = "none";

  if (currentAuthTab === "login") {
    const u = state.users.find(u => u.email === email && u.password === pass);
    if (!u) { errEl.textContent = "Invalid email or password"; errEl.style.display = "block"; return; }
    state.currentUser = u; save(); loginSuccess();
  } else {
    const name    = document.getElementById("auth-name").value;
    const confirm = document.getElementById("auth-confirm").value;
    if (!name || !email || !pass) { errEl.textContent = "All fields required"; errEl.style.display = "block"; return; }
    if (pass !== confirm) { errEl.textContent = "Passwords don't match"; errEl.style.display = "block"; return; }
    if (state.users.find(u => u.email === email)) { errEl.textContent = "Email already registered"; errEl.style.display = "block"; return; }
    const newU = { name, email, password: pass, id: Date.now() };
    state.users.push(newU); state.currentUser = newU; save(); loginSuccess();
  }
}

function loginSuccess() {
  document.getElementById("auth-page").style.display = "none";
  document.getElementById("main-app").style.display  = "block";
  document.getElementById("nav-greeting").textContent = `Hi, ${state.currentUser.name.split(" ")[0]} 🩷`;
  renderCurrentPage();
}

function logout() {
  state.currentUser = null;
  ss("ph_user", null);
  Object.values(audioPool).forEach(a => { a.pause(); a.currentTime = 0; });
  state.activeSound   = null;
  soundPausedByTimer  = false;
  document.getElementById("auth-page").style.display = "flex";
  document.getElementById("main-app").style.display  = "none";
}

/* ─── NAVIGATION ────────────────────────────────────────────────────── */
function goPage(p) {
  state.currentPage = p;
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === p));
  document.querySelectorAll(".page").forEach(b => b.classList.remove("active"));
  const el = document.getElementById("page-" + p);
  if (el) el.classList.add("active");
  renderCurrentPage();
}

function renderCurrentPage() {
  const p = state.currentPage;
  if      (p === "dashboard") renderDashboard();
  else if (p === "tasks")     renderTasks();
  else if (p === "focus")     renderFocus();
  else if (p === "pomodoro")  renderPomodoro();
  else if (p === "habits")    renderHabits();
  else if (p === "mood")      renderMood();
  else if (p === "stats")     renderStats();
  else if (p === "settings")  renderSettings();
}

/* ─── DATE HELPERS ──────────────────────────────────────────────────── */
function todayStr() { return new Date().toDateString(); }
function completedToday()  { return state.tasks.filter(t => t.completedDate === todayStr()).length; }
function completedTotal()  { return state.tasks.filter(t => t.completed).length; }

/* ─── DASHBOARD ─────────────────────────────────────────────────────── */
function renderDashboard() {
  const el   = document.getElementById("page-dashboard");
  const h    = new Date().getHours();
  const greet = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  const name  = state.currentUser?.name?.split(" ")[0] || "friend";
  const total = state.tasks.length;
  const comp  = completedTotal();
  const rate  = total > 0 ? Math.round((comp / total) * 100) : 0;
  const ctoday   = completedToday();
  const goal     = state.settings.dailyGoal;
  const goalPct  = Math.min(100, Math.round((ctoday / goal) * 100));
  const q        = QUOTES[new Date().getDay() % QUOTES.length];
  const pending  = state.tasks.filter(t => !t.completed).slice(0, 4);
  const todayMood = state.moods.find(m => m.date === todayStr());

  el.innerHTML = `
  <div style="margin-bottom:2rem">
    <h1 class="page-title">Good ${greet}, ${name} 🌸</h1>
    <p class="subtitle">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
  </div>

  <div class="quote-card" style="background:${isNight() ? "linear-gradient(135deg,#2D1F45,#1A2D40)" : "linear-gradient(135deg,#FFF0F7,#EEF8FF)"}">
    <div style="position:absolute;right:20px;top:12px;font-size:50px;opacity:.12;pointer-events:none">✨</div>
    <p style="font-family:'Playfair Display',serif;font-style:italic;font-size:16px;color:var(--text);line-height:1.6;margin:0 0 8px">"${q.t}"</p>
    <p style="color:var(--text-mid);font-size:13px;margin:0;font-weight:600">— ${q.a}</p>
  </div>

  <div class="grid-stats">
    ${[
      { l: "Total Tasks",     v: total,             i: "📋", bg: isNight() ? "#2D1F2E" : "#FFD6E8" },
      { l: "Completed",       v: comp,              i: "✅", bg: isNight() ? "#1A3020" : "#E8F8EE" },
      { l: "Completion",      v: rate + "%",        i: "📈", bg: isNight() ? "#2A2010" : "#FFF9E0" },
      { l: "Today's Goal",    v: ctoday + "/" + goal, i: "🎯", bg: isNight() ? "#1A2035" : "#DDF4FF" },
      { l: "Focus Sessions",  v: state.pomSessions, i: "🍅", bg: isNight() ? "#281A3D" : "#EEE6FF" },
    ].map(s => `
    <div class="stat-card" style="background:${s.bg}">
      <div style="font-size:22px;margin-bottom:8px">${s.i}</div>
      <div class="stat-num">${s.v}</div>
      <div class="stat-label">${s.l}</div>
    </div>`).join("")}
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">🎯 Daily Goal Progress</div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:13px;color:var(--text-mid)">Tasks today</span>
        <span style="font-size:13px;font-weight:700;color:var(--text)">${ctoday}/${goal}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${goalPct}%"></div></div>
      <p style="font-size:12px;color:var(--text-mid);margin:6px 0 0">
        ${goalPct >= 100 ? "🎉 Goal achieved! Amazing!" : "🌸 " + (goal - ctoday) + " more to go!"}
      </p>
    </div>
    <div class="card">
      <div class="card-title">🌸 How are you feeling?</div>
      <div style="display:flex;gap:6px">
        ${MOODS.map(m => `
        <button class="mood-btn ${todayMood?.mood === m.label ? "sel" : ""}"
          onclick="logMoodDash('${m.label}','${m.emoji}')"
          style="${todayMood?.mood === m.label ? "background:" + m.color + ";border-color:" + m.color : ""}">
          <div style="font-size:22px">${m.emoji}</div>
          <div style="font-size:9px;font-weight:600;color:var(--text-mid);margin-top:4px">${m.label}</div>
        </button>`).join("")}
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">📋 Upcoming Tasks</div>
      ${pending.length === 0
        ? '<p style="color:var(--text-light);font-size:14px;text-align:center;padding:1rem 0">All done! 🎉 Amazing!</p>'
        : pending.map(t => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
            <span class="priority-badge priority-${t.priority}">${t.priority}</span>
            <span style="font-size:14px;color:var(--text);flex:1">${t.title}</span>
          </div>`).join("")}
    </div>
    <div class="card">
      <div class="card-title">🎵 Relaxation Sounds</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        ${SOUNDS.map(s => `
        <button class="sound-btn ${state.activeSound === s.id ? "active" : ""}" onclick="toggleSound('${s.id}')">
          <div style="font-size:24px">${s.icon}</div>
          <div style="font-size:10px;font-weight:600;color:var(--text);margin-top:4px">${s.label}</div>
        </button>`).join("")}
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span>🔊</span>
        <input type="range" min="0" max="100" value="${state.soundVol}"
          oninput="updateVolume(+this.value);document.getElementById('vol-pct').textContent=this.value+'%'"
          style="flex:1;accent-color:#F4A7C3">
        <span id="vol-pct" style="font-size:12px;color:var(--text-mid);min-width:35px">${state.soundVol}%</span>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-top:1.5rem">
    <button class="btn-primary" onclick="showMotivation()" style="padding:13px 30px;font-size:14px;font-weight:700">✨ Get a Motivational Boost</button>
  </div>`;
}

function logMoodDash(mood, emoji) {
  const today = todayStr();
  state.moods = state.moods.filter(m => m.date !== today);
  state.moods.push({ date: today, mood, emoji, note: "" });
  save(); showToast(`Mood logged: ${emoji} ${mood}`); renderDashboard();
}

/* ─── AUDIO ENGINE ──────────────────────────────────────────────────── */
const AUDIO_FILES = {
  ocean: "sounds/ocean.mp3",
  rain:  "sounds/rain.mp3",
  study: "sounds/cafe.mp3",
};

const SOUND_LABELS = {
  ocean: "🌊 Ocean Waves",
  rain:  "🌧 Rain Sounds",
  study: "☕ Study Café",
};

const audioPool = {};

function getAudio(id) {
  if (!audioPool[id]) {
    audioPool[id]      = new Audio(AUDIO_FILES[id]);
    audioPool[id].loop = true;
  }
  return audioPool[id];
}

let soundPausedByTimer = false;

function updateNowPlaying() {
  const badge  = document.getElementById("now-playing");
  if (!badge) return;
  const playing = state.activeSound && !soundPausedByTimer;
  if (playing) {
    badge.textContent    = "🎵 " + SOUND_LABELS[state.activeSound];
    badge.style.display  = "inline-block";
  } else {
    badge.style.display  = "none";
  }
}

function _playAudio(id) {
  const a = getAudio(id);
  a.volume = state.soundVol / 100;
  const p  = a.play();
  if (p && p.catch) {
    p.catch(() => {
      const unlock = () => { a.play().catch(() => {}); document.removeEventListener("click", unlock); };
      document.addEventListener("click", unlock, { once: true });
      showToast("Click anywhere to start sound 🔊", "motivation");
    });
  }
}

function toggleSound(id) {
  if (state.activeSound === id) {
    getAudio(id).pause();
    getAudio(id).currentTime = 0;
    state.activeSound = null;
    soundPausedByTimer = false;
    updateNowPlaying();
    renderCurrentPage();
    return;
  }
  if (state.activeSound) {
    getAudio(state.activeSound).pause();
    getAudio(state.activeSound).currentTime = 0;
  }
  state.activeSound  = id;
  soundPausedByTimer = false;
  _playAudio(id);
  updateNowPlaying();
  renderCurrentPage();
}

function soundOnFocusStart() {
  if (state.activeSound && soundPausedByTimer) {
    soundPausedByTimer = false;
    _playAudio(state.activeSound);
    updateNowPlaying();
  }
}

function soundOnFocusEnd() {
  if (state.activeSound && !soundPausedByTimer) {
    soundPausedByTimer = true;
    getAudio(state.activeSound).pause();
    updateNowPlaying();
  }
}

function updateVolume(v) {
  state.soundVol = v;
  Object.values(audioPool).forEach(a => (a.volume = v / 100));
}

/* ─── TASKS ─────────────────────────────────────────────────────────── */
function renderTasks() {
  const el = document.getElementById("page-tasks");
  const filtered = state.tasks.filter(t => {
    if (state.taskSearch && !t.title.toLowerCase().includes(state.taskSearch.toLowerCase())) return false;
    if (state.taskPriFilter !== "all" && t.priority !== state.taskPriFilter) return false;
    if (state.taskStatusFilter === "active"    &&  t.completed) return false;
    if (state.taskStatusFilter === "completed" && !t.completed) return false;
    return true;
  });

  el.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
    <h1 class="page-title">Tasks 📋</h1>
    <button class="btn-primary"
      onclick="state.showTaskForm=!state.showTaskForm;state.editTaskId=null;state.formData={title:'',category:'Personal',priority:'medium',dueDate:'',notes:''};renderTasks()"
      style="padding:11px 22px;font-size:14px">+ Add Task</button>
  </div>

  ${state.showTaskForm ? `
  <div class="card" style="margin-bottom:1.5rem">
    <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:1rem">${state.editTaskId ? "Edit Task" : "New Task"} 🌸</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="grid-column:1/-1">
        <label class="form-label">Task title</label>
        <input class="form-input" id="ft-title" value="${state.formData.title}" placeholder="What needs to get done?" oninput="state.formData.title=this.value">
      </div>
      <div>
        <label class="form-label">Category</label>
        <select class="form-select" id="ft-cat" onchange="state.formData.category=this.value">
          ${CATS.map(c => `<option value="${c}"${state.formData.category === c ? " selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div>
        <label class="form-label">Priority</label>
        <select class="form-select" onchange="state.formData.priority=this.value">
          ${PRIS.map(p => `<option value="${p}"${state.formData.priority === p ? " selected" : ""}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join("")}
        </select>
      </div>
      <div>
        <label class="form-label">Due date</label>
        <input class="form-input" type="date" value="${state.formData.dueDate}" onchange="state.formData.dueDate=this.value">
      </div>
      <div>
        <label class="form-label">Notes</label>
        <input class="form-input" value="${state.formData.notes}" placeholder="Any notes..." oninput="state.formData.notes=this.value">
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:1rem">
      <button class="btn-primary" onclick="saveTask()" style="padding:10px 22px;font-size:14px">${state.editTaskId ? "Update 🌸" : "Add Task 🌸"}</button>
      <button class="btn-ghost" onclick="state.showTaskForm=false;state.editTaskId=null;renderTasks()" style="padding:10px 18px;font-size:14px">Cancel</button>
    </div>
  </div>` : ""}

  <div class="filter-row">
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input class="search-input" value="${state.taskSearch}" placeholder="Search tasks..." oninput="state.taskSearch=this.value;renderTasks()">
    </div>
    <select class="filter-sel" onchange="state.taskPriFilter=this.value;renderTasks()">
      <option value="all"${state.taskPriFilter === "all" ? " selected" : ""}>All priorities</option>
      ${PRIS.map(p => `<option value="${p}"${state.taskPriFilter === p ? " selected" : ""}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join("")}
    </select>
    <select class="filter-sel" onchange="state.taskStatusFilter=this.value;renderTasks()">
      <option value="all"${state.taskStatusFilter === "all" ? " selected" : ""}>All tasks</option>
      <option value="active"${state.taskStatusFilter === "active" ? " selected" : ""}>Active</option>
      <option value="completed"${state.taskStatusFilter === "completed" ? " selected" : ""}>Completed</option>
    </select>
  </div>

  ${filtered.length === 0
    ? `<div style="text-align:center;padding:4rem;color:var(--text-light)"><div style="font-size:48px;margin-bottom:12px">🌸</div><p>No tasks found</p></div>`
    : filtered.map(t => `
    <div class="task-item" style="${t.completed ? "opacity:0.6" : ""}">
      <button class="task-check ${t.completed ? "done" : ""}" onclick="toggleTask(${t.id})">
        ${t.completed ? '<span style="color:#fff;font-size:14px">✓</span>' : ""}
      </button>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap">
          <span style="font-size:14px;font-weight:${t.completed ? 400 : 600};color:var(--text);${t.completed ? "text-decoration:line-through" : ""}">${t.title}</span>
          <span class="priority-badge priority-${t.priority}">${t.priority}</span>
          <span class="tag">${t.category}</span>
        </div>
        ${t.dueDate ? `<div style="font-size:11px;color:var(--text-light)">📅 ${new Date(t.dueDate + "T00:00:00").toLocaleDateString()}</div>` : ""}
        ${t.notes   ? `<div style="font-size:11px;color:var(--text-light)">📝 ${t.notes}</div>` : ""}
      </div>
      <div style="display:flex;gap:6px">
        <button onclick="startEditTask(${t.id})" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:transparent;cursor:pointer;font-size:14px">✏️</button>
        <button onclick="deleteTask(${t.id})"    style="width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:transparent;cursor:pointer;font-size:14px">🗑️</button>
      </div>
    </div>`).join("")}`;
}

function saveTask() {
  const d = state.formData;
  if (!d.title.trim()) return;
  if (state.editTaskId) {
    state.tasks   = state.tasks.map(t => t.id === state.editTaskId ? { ...t, ...d } : t);
    showToast("Task updated 🌸");
    state.editTaskId = null;
  } else {
    state.tasks.push({ ...d, id: Date.now(), completed: false, createdAt: new Date().toISOString() });
    showToast("Task added! You're on a roll 🌸");
  }
  state.formData     = { title: "", category: "Personal", priority: "medium", dueDate: "", notes: "" };
  state.showTaskForm = false;
  save(); renderTasks();
}

function toggleTask(id) {
  state.tasks = state.tasks.map(t => {
    if (t.id !== id) return t;
    const c = !t.completed;
    if (c) showMotivation();
    return { ...t, completed: c, completedDate: c ? todayStr() : null };
  });
  save(); renderTasks();
}

function deleteTask(id) { state.tasks = state.tasks.filter(t => t.id !== id); save(); renderTasks(); showToast("Task removed"); }

function startEditTask(id) {
  const t = state.tasks.find(t => t.id === id); if (!t) return;
  state.formData   = { title: t.title, category: t.category, priority: t.priority, dueDate: t.dueDate || "", notes: t.notes || "" };
  state.editTaskId = id;
  state.showTaskForm = true;
  renderTasks();
}

/* ─── FOCUS MODE ────────────────────────────────────────────────────── */
let focusModeActive = false;

function renderFocus() {
  const el      = document.getElementById("page-focus");
  const pending = state.tasks.filter(t => !t.completed);

  if (pending.length > 0 && state.activeSound && soundPausedByTimer) {
    soundPausedByTimer = false;
    _playAudio(state.activeSound);
    updateNowPlaying();
  }

  el.innerHTML = `
  <div style="text-align:center">
    <h1 class="page-title" style="text-align:center">Focus Mode 🎯</h1>
    <p class="subtitle" style="text-align:center">One task at a time, you've got this</p>
    <div class="card" style="max-width:600px;margin:0 auto;padding:3rem 2rem;text-align:center">
      ${pending.length === 0 ? `
        <div style="font-size:60px;margin-bottom:16px">🎉</div>
        <h2 style="font-family:'Playfair Display',serif;color:var(--text)">All done!</h2>
        <p style="color:var(--text-mid)">You've completed all your tasks!</p>` : `
        <div style="font-size:60px;margin-bottom:16px">🎯</div>
        <h2 style="font-size:22px;font-weight:700;color:var(--text);margin-bottom:8px">${pending[0].title}</h2>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:1.5rem">
          <span class="priority-badge priority-${pending[0].priority}">${pending[0].priority} priority</span>
          <span class="tag">${pending[0].category}</span>
        </div>
        ${pending[0].notes ? `<p style="color:var(--text-mid);font-size:14px">${pending[0].notes}</p>` : ""}
        <p style="color:var(--text-light);font-size:13px;margin-bottom:1rem">Task 1 of ${pending.length}</p>
        <button class="btn-primary" onclick="completeFocusTask(${pending[0].id})" style="padding:12px 28px;font-size:14px">Mark Complete 🌸</button>`}
    </div>
    <div class="card" style="max-width:600px;margin:1.5rem auto 0;padding:1.4rem">
      <div class="card-title">🎵 Focus Sounds</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        ${SOUNDS.map(s => `
        <button class="sound-btn ${state.activeSound === s.id && !soundPausedByTimer ? "active" : ""}" onclick="toggleSound('${s.id}')">
          <div style="font-size:24px">${s.icon}</div>
          <div style="font-size:10px;font-weight:600;color:var(--text);margin-top:4px">${s.label}</div>
          ${state.activeSound === s.id && !soundPausedByTimer ? '<div style="font-size:9px;color:#D4A820;margin-top:2px">▶ Playing</div>' : ""}
        </button>`).join("")}
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span>🔊</span>
        <input type="range" min="0" max="100" value="${state.soundVol}" oninput="updateVolume(+this.value)" style="flex:1;accent-color:#F4A7C3">
        <span style="font-size:12px;color:var(--text-mid);min-width:35px">${state.soundVol}%</span>
      </div>
    </div>
  </div>`;
}

function completeFocusTask(id) {
  toggleTask(id);
  const remaining = state.tasks.filter(t => !t.completed).length;
  if (remaining === 0) soundOnFocusEnd();
  renderFocus();
}

/* ─── POMODORO ──────────────────────────────────────────────────────── */
let pomInterval = null;

function renderPomodoro() {
  const el    = document.getElementById("page-pomodoro");
  const modes = {
    focus:      { l: "Focus",       d: 25 * 60, c: "#F4A7C3" },
    shortBreak: { l: "Short Break", d: 5  * 60, c: "#5BAAD4" },
    longBreak:  { l: "Long Break",  d: 15 * 60, c: "#D4B8F0" },
  };
  const cur  = modes[state.pomMode];
  const mins = String(Math.floor(state.pomTime / 60)).padStart(2, "0");
  const secs = String(state.pomTime % 60).padStart(2, "0");
  const prog = 1 - (state.pomTime / cur.d);
  const R = 100, circ = 2 * Math.PI * R;

  el.innerHTML = `
  <div style="text-align:center">
    <h1 class="page-title" style="text-align:center">Pomodoro Timer 🍅</h1>
    <p class="subtitle" style="text-align:center">Focus in sessions, rest with intention</p>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:2rem">
      ${Object.entries(modes).map(([k, v]) => `
      <button class="pom-mode-btn ${state.pomMode === k ? "active" : ""}" onclick="setPomMode('${k}')"
        style="${state.pomMode === k ? "background:" + v.c + ";color:#fff;border-color:transparent" : ""}">${v.l}</button>`).join("")}
    </div>
    <div style="position:relative;display:inline-block;margin-bottom:2rem">
      <svg width="260" height="260" viewBox="0 0 260 260">
        <circle cx="130" cy="130" r="${R}" fill="none" stroke="${isNight() ? "rgba(200,170,220,0.1)" : "rgba(180,140,190,0.12)"}" stroke-width="12"/>
        <circle cx="130" cy="130" r="${R}" fill="none" stroke="${cur.c}" stroke-width="12" stroke-linecap="round"
          stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - prog)}"
          transform="rotate(-90 130 130)" style="transition:stroke-dashoffset 1s ease"/>
      </svg>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
        <div style="font-family:'Playfair Display',serif;font-size:44px;font-weight:600;color:var(--text);line-height:1">${mins}:${secs}</div>
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:var(--text-mid);margin-top:4px;text-transform:uppercase">${cur.l}</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;margin-bottom:2rem">
      <button class="btn-primary" onclick="togglePom()" style="padding:14px 36px;font-size:16px;background:${cur.c}">${state.pomRunning ? "⏸ Pause" : "▶ Start"}</button>
      <button class="btn-ghost"   onclick="resetPom()"  style="padding:14px 24px;font-size:15px">↺ Reset</button>
    </div>
    <div class="card" style="max-width:600px;margin:0 auto 1.5rem">
      <div class="card-title">🎵 Relaxation Sounds</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        ${SOUNDS.map(s => `
        <button class="sound-btn ${state.activeSound === s.id ? "active" : ""}" onclick="toggleSound('${s.id}')">
          <div style="font-size:28px">${s.icon}</div>
          <div style="font-size:11px;font-weight:600;color:var(--text);margin-top:4px">${s.label}</div>
        </button>`).join("")}
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span>🔊</span>
        <input type="range" min="0" max="100" value="${state.soundVol}" oninput="updateVolume(+this.value)" style="flex:1;accent-color:#F4A7C3">
        <span style="font-size:12px;color:var(--text-mid);min-width:35px">${state.soundVol}%</span>
      </div>
    </div>
    <p style="color:var(--text-mid);font-size:14px">🍅 Sessions today: <strong style="color:var(--text)">${state.pomSessions}</strong></p>
  </div>`;
}

function setPomMode(m) {
  const d = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  clearInterval(pomInterval); pomInterval = null;
  state.pomMode    = m;
  state.pomTime    = d[m];
  state.pomRunning = false;
  soundOnFocusEnd();
  renderPomodoro();
}

function togglePom() {
  state.pomRunning = !state.pomRunning;
  if (state.pomRunning) {
    if (state.pomMode === "focus") soundOnFocusStart();
    pomInterval = setInterval(() => {
      state.pomTime--;
      if (state.pomTime <= 0) {
        clearInterval(pomInterval); pomInterval = null;
        state.pomRunning = false;
        soundOnFocusEnd();
        if      (state.pomMode === "focus")      { state.pomSessions++; setPomMode("shortBreak"); }
        else if (state.pomMode === "shortBreak") { setPomMode("longBreak"); }
        else                                     { setPomMode("focus"); }
        showMotivation(); return;
      }
      renderPomodoro();
    }, 1000);
  } else {
    clearInterval(pomInterval); pomInterval = null;
    soundOnFocusEnd();
  }
  renderPomodoro();
}

function resetPom() {
  const d = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  clearInterval(pomInterval); pomInterval = null;
  state.pomTime    = d[state.pomMode];
  state.pomRunning = false;
  soundOnFocusEnd();
  renderPomodoro();
}

/* ─── HABITS ────────────────────────────────────────────────────────── */
function renderHabits() {
  const el    = document.getElementById("page-habits");
  const today = todayStr();

  function streak(h) {
    let s = 0, d = new Date();
    while (true) {
      if (h.checkIns && h.checkIns.includes(d.toDateString())) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  }

  el.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
    <h1 class="page-title">Habits 💫</h1>
    <button class="btn-primary" onclick="state.showHabitForm=!state.showHabitForm;renderHabits()" style="padding:11px 22px;font-size:14px">+ New Habit</button>
  </div>

  ${state.showHabitForm ? `
  <div class="card" style="margin-bottom:1.5rem">
    <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:1rem">New Habit 🌱</div>
    <input class="form-input" id="habit-name" placeholder="Habit name..." value="${state.newHabit.name}" oninput="state.newHabit.name=this.value" style="margin-bottom:12px">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
      ${HABIT_ICONS.map(ic => `
      <button onclick="state.newHabit.icon='${ic}';renderHabits()"
        style="width:36px;height:36px;border-radius:50%;border:2px solid ${state.newHabit.icon === ic ? "#F4A7C3" : "var(--border)"};background:${state.newHabit.icon === ic ? "#FFD6E8" : "transparent"};cursor:pointer;font-size:18px">${ic}</button>`).join("")}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-primary" onclick="addHabit()"  style="padding:10px 22px;font-size:14px">Add Habit 🌸</button>
      <button class="btn-ghost"   onclick="state.showHabitForm=false;renderHabits()" style="padding:10px 18px;font-size:14px">Cancel</button>
    </div>
  </div>` : ""}

  ${state.habits.length === 0
    ? `<div style="text-align:center;padding:4rem;color:var(--text-light)"><div style="font-size:48px;margin-bottom:12px">🌱</div><p>Start building healthy habits today!</p></div>`
    : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">
        ${state.habits.map(h => {
          const doneToday = h.checkIns && h.checkIns.includes(today);
          const s = streak(h);
          return `<div class="habit-card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <span style="font-size:36px">${h.icon}</span>
              <div style="display:flex;align-items:center;gap:4px"><span style="font-size:16px">🔥</span><span style="font-size:14px;font-weight:700;color:var(--text)">${s} days</span></div>
            </div>
            <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:3px">${h.name}</div>
            <div style="font-size:12px;color:var(--text-mid);margin-bottom:1rem">Total: ${(h.checkIns || []).length} days</div>
            <div style="display:flex;gap:8px">
              <button onclick="checkInHabit(${h.id})" ${doneToday ? "disabled" : ""}
                style="flex:1;padding:10px;border-radius:50px;border:none;background:${doneToday ? "rgba(180,140,190,0.15)" : "linear-gradient(135deg,#F4A7C3,#D4B8F0)"};color:${doneToday ? "var(--text-mid)" : "#fff"};font-weight:700;cursor:${doneToday ? "default" : "pointer"};font-family:'Nunito',sans-serif;font-size:14px">
                ${doneToday ? "✓ Done Today" : "Check In"}
              </button>
              <button onclick="deleteHabit(${h.id})" style="width:38px;height:38px;border-radius:50%;border:1px solid var(--border);background:transparent;cursor:pointer;font-size:14px">🗑️</button>
            </div>
          </div>`;}).join("")}
      </div>`}`;
}

function addHabit() {
  if (!state.newHabit.name) return;
  state.habits.push({ ...state.newHabit, id: Date.now(), checkIns: [], streak: 0 });
  state.newHabit = { name: "", icon: "🌸" };
  state.showHabitForm = false;
  save(); renderHabits();
  showToast("Habit added! Let's build great patterns 🌸");
}

function checkInHabit(id) {
  const today = todayStr();
  state.habits = state.habits.map(h => {
    if (h.id !== id || (h.checkIns && h.checkIns.includes(today))) return h;
    const ci = [...(h.checkIns || []), today];
    let s = 0, d = new Date();
    while (true) { if (ci.includes(d.toDateString())) { s++; d.setDate(d.getDate() - 1); } else break; }
    showToast(`${h.icon} ${h.name} — ${s} day streak! 🔥`);
    return { ...h, checkIns: ci, streak: s };
  });
  save(); renderHabits();
}

function deleteHabit(id) { state.habits = state.habits.filter(h => h.id !== id); save(); renderHabits(); }

/* ─── MOOD JOURNAL ──────────────────────────────────────────────────── */
function renderMood() {
  const el        = document.getElementById("page-mood");
  const today     = todayStr();
  const todayMood = state.moods.find(m => m.date === today);

  el.innerHTML = `
  <h1 class="page-title">Mood Tracker 🌸</h1>
  <p class="subtitle">Check in with yourself every day</p>
  <div class="card" style="max-width:700px;margin-bottom:1.5rem">
    <div style="font-family:'Playfair Display',serif;font-size:20px;color:var(--text);margin-bottom:1.5rem">How are you feeling today?</div>
    <div style="display:flex;gap:10px;margin-bottom:1.2rem;flex-wrap:wrap">
      ${MOODS.map(m => `
      <button class="mood-btn" onclick="logMood('${m.label}','${m.emoji}')"
        style="${todayMood?.mood === m.label ? "background:" + m.color + ";border-color:" + m.color : ""}">
        <div style="font-size:40px;margin-bottom:6px">${m.emoji}</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${m.label}</div>
      </button>`).join("")}
    </div>
    <textarea id="mood-note" placeholder="Add a note about your day... (optional)" rows="3"
      style="width:100%;padding:12px 16px;border-radius:14px;border:1.5px solid var(--border);background:${isNight() ? "#231A35" : "#FFF0F7"};color:var(--text);font-size:14px;font-family:'Nunito',sans-serif;outline:none;resize:vertical;box-sizing:border-box"
    >${todayMood?.note || ""}</textarea>
  </div>
  <h2 style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:1rem">Your Journal 📖</h2>
  ${state.moods.slice().reverse().slice(0, 15).map(m => `
  <div style="display:flex;align-items:center;gap:12px;padding:1rem 1.2rem;background:var(--card);border-radius:16px;border:1px solid var(--border);margin-bottom:8px">
    <div style="width:44px;height:44px;border-radius:50%;background:${MOODS.find(x => x.label === m.mood)?.color || "#FFD6E8"};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${m.emoji}</div>
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px">
        <span style="font-weight:700;color:#F4A7C3">${m.mood}</span>
        <span style="font-size:11px;color:var(--text-light)">${new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
      ${m.note ? `<p style="margin:0;font-size:13px;color:var(--text-mid)">${m.note}</p>` : ""}
    </div>
  </div>`).join("")}
  ${state.moods.length === 0 ? '<p style="color:var(--text-light);text-align:center;padding:2rem">No mood entries yet. Start tracking today! 🌸</p>' : ""}`;
}

function logMood(mood, emoji) {
  const today = todayStr();
  const note  = document.getElementById("mood-note")?.value || "";
  state.moods = state.moods.filter(m => m.date !== today);
  state.moods.push({ date: today, mood, emoji, note, timestamp: new Date().toISOString() });
  save(); showToast(`Mood logged: ${emoji} ${mood}`); renderMood();
}

/* ─── STATISTICS ────────────────────────────────────────────────────── */
function renderStats() {
  const el    = document.getElementById("page-stats");
  const total = state.tasks.length;
  const comp  = completedTotal();
  const rate  = total > 0 ? Math.round((comp / total) * 100) : 0;
  const now   = new Date();
  const days  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const weekData = days.map((_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i));
    return state.tasks.filter(t => t.completedDate === d.toDateString()).length;
  });
  const maxW       = Math.max(...weekData, 1);
  const topStreak  = state.habits.length > 0 ? Math.max(...state.habits.map(h => h.streak || 0)) : 0;

  el.innerHTML = `
  <h1 class="page-title">Statistics 📊</h1>
  <div class="grid-stats" style="margin-bottom:1.5rem">
    ${[
      { l: "Total Tasks",    v: total,                 i: "📋" },
      { l: "Completed",      v: comp,                  i: "✅" },
      { l: "Completion Rate",v: rate + "%",             i: "📈" },
      { l: "Focus Sessions", v: state.pomSessions,     i: "🍅" },
      { l: "Top Streak",     v: topStreak + "d 🔥",    i: "💫" },
      { l: "Mood Entries",   v: state.moods.length,    i: "🌸" },
    ].map(s => `
    <div class="stat-card">
      <div style="font-size:22px;margin-bottom:8px">${s.i}</div>
      <div class="stat-num">${s.v}</div>
      <div class="stat-label">${s.l}</div>
    </div>`).join("")}
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">📅 Tasks completed this week</div>
      <div class="bar-chart">
        ${weekData.map((v, i) => `
        <div class="bar-col">
          <div class="bar" style="height:${(v / maxW) * 85 + 6}px;background:${v > 0 ? "linear-gradient(180deg,#F4A7C3,#D4B8F0)" : "var(--border)"}"></div>
          <span style="font-size:9px;color:var(--text-light);font-weight:600">${days[i]}</span>
        </div>`).join("")}
      </div>
    </div>
    <div class="card">
      <div class="card-title">🎯 Tasks by priority</div>
      ${["high","medium","low"].map(p => {
        const count  = state.tasks.filter(t => t.priority === p).length;
        const colors = { high: "#D4446A", medium: "#E8C840", low: "#5BAAD4" };
        return `<div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:13px;color:var(--text-mid);font-weight:600;text-transform:capitalize">${p}</span>
            <span style="font-size:13px;font-weight:700;color:var(--text)">${count}</span>
          </div>
          <div style="background:var(--border);border-radius:50px;height:8px">
            <div style="width:${total > 0 ? (count / total * 100) : 0}%;height:100%;background:${colors[p]};border-radius:50px;transition:width .5s"></div>
          </div>
        </div>`;}).join("")}
    </div>
  </div>
  <div class="card">
    <div class="card-title">🌸 Recent mood history</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${state.moods.slice(-14).map(m => `
      <div class="mini-mood">
        <div class="mood-circle" style="background:${MOODS.find(x => x.label === m.mood)?.color || "#FFD6E8"}">${m.emoji}</div>
        <span style="font-size:9px;color:var(--text-light)">${new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>`).join("")}
      ${state.moods.length === 0 ? '<p style="color:var(--text-light);font-size:14px">No mood data yet 🌸</p>' : ""}
    </div>
  </div>`;
}

/* ─── SETTINGS ──────────────────────────────────────────────────────── */
function renderSettings() {
  const el = document.getElementById("page-settings");
  const s  = state.settings;
  el.innerHTML = `
  <h1 class="page-title">Settings ⚙️</h1>
  <div style="max-width:700px">
    <div class="card" style="margin-bottom:1rem">
      <div class="card-title">👤 Account</div>
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#F4A7C3,#D4B8F0);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;font-weight:700;flex-shrink:0">
          ${state.currentUser?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <p style="margin:0;font-weight:700;color:var(--text)">${state.currentUser?.name}</p>
          <p style="margin:0;font-size:13px;color:var(--text-mid)">${state.currentUser?.email}</p>
        </div>
      </div>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <div class="card-title">🎨 Appearance</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div><p style="margin:0 0 2px;font-weight:600;color:var(--text)">Theme</p><p style="margin:0;font-size:12px;color:var(--text-mid)">Choose your visual style</p></div>
        <select class="filter-sel" onchange="updateSetting('theme',this.value)">
          <option value="auto" ${s.theme === "auto"  ? "selected" : ""}>Auto</option>
          <option value="light"${s.theme === "light" ? "selected" : ""}>Light</option>
          <option value="dark" ${s.theme === "dark"  ? "selected" : ""}>Dark</option>
        </select>
      </div>
    </div>
    <div class="card" style="margin-bottom:1.5rem">
      <div class="card-title">⚡ Preferences</div>
      ${[
        { k: "sound",  l: "Sound effects", d: "Play sounds for actions" },
        { k: "notifs", l: "Notifications",  d: "Receive task reminders"  },
      ].map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <div><p style="margin:0 0 2px;font-weight:600;color:var(--text)">${p.l}</p><p style="margin:0;font-size:12px;color:var(--text-mid)">${p.d}</p></div>
        <div class="toggle" onclick="toggleSetting('${p.k}')" style="background:${s[p.k] ? "#F4A7C3" : "var(--border)"}">
          <div class="toggle-knob" style="left:${s[p.k] ? "25px" : "3px"}"></div>
        </div>
      </div>`).join("")}
      <div>
        <p style="margin:0 0 6px;font-weight:600;color:var(--text)">Daily goal target</p>
        <p style="margin:0 0 8px;font-size:12px;color:var(--text-mid)">Number of tasks to complete daily</p>
        <input type="number" min="1" max="50" value="${s.dailyGoal}" onchange="updateSetting('dailyGoal',+this.value)"
          style="width:80px;padding:8px 12px;border-radius:12px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-family:'Nunito',sans-serif;font-size:15px;outline:none">
      </div>
    </div>
    <button class="btn-primary" onclick="showToast('Settings saved! 🌸')" style="width:100%;padding:16px;font-size:16px">Save settings 🌸</button>
  </div>`;
}

function updateSetting(k, v) { state.settings[k] = v; save(); applyTheme(); renderSettings(); }
function toggleSetting(k)    { state.settings[k] = !state.settings[k]; save(); renderSettings(); }

/* ─── INIT ──────────────────────────────────────────────────────────── */
function init() {
  initBubbles();
  applyTheme();
  if (state.currentUser) loginSuccess();
}

init();