# 🌸 Productivity Haven

Productivity Haven is a cozy, distraction-free dashboard designed to bring peace to your daily workflow. I built this to replace cluttered browser tabs with a single, beautiful space that balances focus tools with soothing aesthetics.

> 🌐 **See it live:** [productivity-haventodo.vercel.app](https://productivity-haventodo.vercel.app)

---

### 🧠 Why I Built This
Most productivity apps feel clinical and overwhelming. I wanted to build a workspace that feels calm and encouraging—combining essential tracking tools like a Pomodoro timer and a task list with atmospheric ambient background audio to block out the noise.

---

## 📸 App Walkthrough & Features

All screens and modules are designed with a uniform, warm cherry-blossom aesthetic to ensure a cohesive user experience.

<table>
  <tr>
    <th width="50%">🔑 Authentication & Entry</th>
    <th width="50%">🏠 Core Interface</th>
  </tr>
  <tr>
    <td>
      <p align="center"><b>Login Screen</b></p>
      <img src="image/The Login Screen.png" alt="Login Screen" width="100%">
      <p><i>Secure entry portal for saved personalized user preferences.</i></p>
    </td>
    <td>
      <p align="center"><b>Main Dashboard Overview</b></p>
      <img src="image/The main Dashboard Overview.png" alt="Main Dashboard Overview" width="100%">
      <p><i>The central hub tracking your daily goals and quick-actions.</i></p>
    </td>
  </tr>
  <tr>
    <td>
      <p align="center"><b>Registration Screen</b></p>
      <img src="image/The Registration Screen.png" alt="Registration Screen" width="100%">
      <p><i>Clean onboarding interface for new user creation.</i></p>
    </td>
    <td>
      <p align="center"><b>Main Dashboard Overview 2</b></p>
      <img src="image/The main Dashboard Overview 2.png" alt="Main Dashboard Overview 2" width="100%">
      <p><i>Expanded modular dashboard layout tracking secondary metrics.</i></p>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th width="50%">📋 Focus & Task Management</th>
    <th width="50%">💫 Habit Building & Self-Care</th>
  </tr>
  <tr>
    <td>
      <p align="center"><b>Task Manager Panel</b></p>
      <img src="image/The Task Manager Panel.png" alt="Task Manager" width="100%">
      <p><i>An interactive tracker to organize priorities and checklists.</i></p>
    </td>
    <td>
      <p align="center"><b>Habits Tracker Panel</b></p>
      <img src="image/The Habits Tracker panel.png" alt="Habits Tracker" width="100%">
      <p><i>Keep consistency alive with daily streak completions.</i></p>
    </td>
  </tr>
  <tr>
    <td>
      <p align="center"><b>Focus Mode View</b></p>
      <img src="image/The Focus Mode view.png" alt="Focus Mode View" width="100%">
      <p><i>A distraction-free view isolating your single most critical objective.</i></p>
    </td>
    <td>
      <p align="center"><b>Mood Journal Screen</b></p>
      <img src="image/The Mood Journal screen.png" alt="Mood Journal" width="100%">
      <p><i>Log emotional states over time to practice daily mindfulness.</i></p>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th width="50%">🍅 Time Management</th>
    <th width="50%">📊 Analytics & Progress</th>
  </tr>
  <tr>
    <td>
      <p align="center"><b>Pomodoro Timer Tab</b></p>
      <img src="image/The Pomodoro Timer tab.png" alt="Pomodoro Timer" width="100%">
      <p><i>Intent-driven custom countdown timer for focused work sprints.</i></p>
    </td>
    <td>
      <p align="center"><b>Statistics & History Panel</b></p>
      <img src="image/The Statistics & History panel.png" alt="Statistics & History" width="100%">
      <p><i>Review weekly productivity trends and compiled execution metrics.</i></p>
    </td>
  </tr>
</table>

### 🗺️ Project Architecture Map
Unlike heavy framework setups, this app is built to be fast, lightweight, modular, and easy to read. Here is how the source tree is organized:

```text
productivity-haven/
│
├── 📁 image/               # Application preview screenshots used in documentation
├── 📁 sounds/              # Internal storage holding loopable ambient background tracks (.mp3)
│
├── 📄 index.html           # Core skeleton structuring the dashboard views and modules
├── 📄 style.css            # Custom cherry-blossom variable themes & responsive interfaces
├── 📄 script.js            # Main engine handling sound routing, timers, and state logic
├── 📄 .gitignore           # Cleans up track lists and system files from tracking
└── 📄 README.md            # Project documentation and feature walkthrough
