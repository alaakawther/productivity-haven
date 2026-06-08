# 🌸 Productivity Haven

Productivity Haven is a cozy, distraction-free dashboard designed to bring peace to your daily workflow. I built this to replace cluttered browser tabs with a single, beautiful space that balances focus tools with soothing aesthetics.

> 🌐 **See it live:** [productivity-haventodo.vercel.app](https://productivity-haventodo.vercel.app)

---

### 🧠 Why I Built This
Most productivity apps feel clinical and overwhelming. I wanted to build a workspace that feels calm and encouraging—combining essential tracking tools like a Pomodoro timer and a task list with atmospheric ambient background audio to block out the noise.

---

## 📸 App Walkthrough & Features

### 🏠 The Dashboard & Welcome Screen
A welcoming gateway that tracks daily goals, provides motivational boosts, and manages your ambient soundscapes seamlessly.
![Welcome Screen](assets/login.png)
![Dashboard Overview](assets/dashboard.png)

### 📋 Task Management & Single-Task Focus
An interactive task manager to organize priorities, coupled with a clean "Focus Mode" view that removes layout clutter so you can work on one thing at a time.
![Task Manager Interface](assets/tasks.png)
![Distraction-Free Focus Mode](assets/focus.png)

### 🍅 Pomodoro Timer
A minimal, intent-driven countdown timer built with structural intervals for focused work sprints and short or long breaks.
![Pomodoro Timer Interface](assets/pomodoro.png)

### 💫 Habit Building & Self-Care
Keep consistency alive with a dynamic habit tracker, and use the mini mood journal to log your emotional well-being and review weekly progress metrics.
![Habit Tracking Panel](assets/habits.png)
![Mood Tracker & Journaling](assets/mood.png)

---

### 🗂️ How the Code is Organized
Unlike heavy framework setups, this app is built to be fast, lightweight, and easy to read:

* `index.html` — Handles the layouts and views for the dashboard modules.
* `style.css` — Controls the custom cherry-blossom theme variables and responsive interfaces.
* `script.js` — Coordinates the audio player routing, task priorities, and timer states.
* `sounds/` — Storage directory holding the ambient loopable `.mp3` tracks.
* `assets/` — Application preview assets and documentation images.

---

### 🚀 Running the Project Locally
Because modern web browsers block background audio from playing directly from a local file path, you'll need to open the project using a simple local environment link.

**Using VS Code (Easiest)**
1. Install the **Live Server** extension from the marketplace.
2. Right-click your `index.html` file and select **Open with Live Server**.

**Using the Command Line**
If you prefer the terminal, run either of these inside the project folder:
* Python: `python -m http.server 8080` (then go to `http://localhost:8080`)
* Node.js: `npx serve .`

---

### 🛠️ The Tech Behind It
* **Languages:** Semantic HTML5, responsive CSS3 using custom properties, and modern Vanilla JavaScript (ES6+).
* **Hosting:** Deployed instantly using Vercel, hooked up to automatically update whenever I push changes to GitHub.

---

Made with 🩷 by **Alaa Kawther Zaiter**
