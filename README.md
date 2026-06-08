# 🌸 Productivity Haven

A cozy, all-in-one productivity web app — built and designed by **Alaa Kawther Zaiter**.

## ✨ Features

| Section | What it does |
|---|---|
| 🏠 Dashboard | Daily overview with mood check-in, goal progress & quote of the day |
| 📋 Tasks | Add, filter, search & complete tasks with priority levels |
| 🎯 Focus Mode | One task at a time, distraction-free |
| 🍅 Pomodoro | Built-in focus/break timer with session tracking |
| 💫 Habits | Daily habit tracker with streak counting 🔥 |
| 🌸 Mood Journal | Track your emotional wellbeing day by day |
| 📊 Statistics | Weekly charts, mood history & habit streaks |
| 🎵 Ambient Sounds | Ocean waves, rain & study café — all loopable |

## 🗂️ Project Structure

```
productivity-haven/
├── index.html        ← The entire app (single file)
├── sounds/
│   ├── ocean.mp3     ← Ocean waves ambience
│   ├── rain.mp3      ← Rainfall sounds
│   └── cafe.mp3      ← Study café chatter
└── README.md
```

## 🚀 Getting Started

Open `index.html` in a browser. Because browsers block local audio files by default, you'll need a local server for the sounds to work:

**VS Code (recommended)**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**Python**
```bash
python3 -m http.server 8080
# Visit http://localhost:8080
```

**Node.js**
```bash
npx serve .
```

## 🌐 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/productivity-haven.git
git push -u origin main
```

Then: **Settings → Pages → Source: main → Save**

Your app will be live at `https://YOUR_USERNAME.github.io/productivity-haven/`

---

Made with 🩷 by **Alaa Kawther Zaiter**
