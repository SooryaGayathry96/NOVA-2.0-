# NOVA 2.O — Junior Astronaut Mission Trainer
### NASA Space Apps Challenge Full-Stack Web Application

> **Mission:** Learn. Train. Explore. Become an Astronaut.  
> **Team:** NOVA 2.O  
> **Platform:** Responsive Web Application (Desktop, Tablet, Mobile)

---

## 🌟 Project Overview

**Junior Astronaut Mission Trainer** is an interactive educational platform designed for students and young space enthusiasts (ages 8–18) to experience structured astronaut training through space exploration, scientific simulations, flight missions, and knowledge evaluations.

Built for the **NASA Space Apps Challenge**, this full-stack application transforms theoretical astronomy and physics into an engaging, gamified astronaut training academy with genuine NASA data integration.

---

## 🚀 Key Features

### 1. Astronaut Command Dashboard
- Personalized trainee welcome and active session telemetry.
- Real-time career XP counter, trainee ranks (*Cadet*, *Junior Astronaut*, *Space Explorer*, *Mission Specialist*, *Commander*).
- Interactive rank progression bar calculating needed XP for the next promotion.
- "Continue Training" smart recommendation engine linking to next unfinished mission or module.
- Real-time statistics: completed missions, modules studied, certified quizzes, and unlocked badges.

### 2. Space Learning Academy (10 Full Curriculum Modules)
- **Module 1: Introduction to Space** (Kármán line, near-vacuum environment).
- **Module 2: The Solar System** (The Sun, inner & outer realms).
- **Module 3: Planets and Moons** (Planetary extremes, ocean moons Europa & Enceladus).
- **Module 4: Gravity and Orbital Mechanics** (Perpetual freefall, Kepler's three laws).
- **Module 5: Spacecraft and Rockets** (Newton's Third Law, staging, Tsiolkovsky equation).
- **Module 6: International Space Station (ISS)** (Orbital science, microgravity bone density counteraction).
- **Module 7: Astronaut Life & Living in Space** (Space nutrition, sleeping tethered, spacewalk prep).
- **Module 8: Space Exploration & Deep Space** (Perseverance, James Webb, Artemis Lunar Gateway).
- **Module 9: Space Safety & Emergency Protocols** (Rapid decompression, solar flares, Whipple shields).
- **Module 10: Basic Space Science & Astrophysics** (Electromagnetic spectrum, stellar lifecycles).

### 3. Mission Control (Simulated Flight Missions)
- **Mission A: Space Orientation & Planetary Survey** (Atmospheric & surface sensor telemetry matching).
- **Mission B: Zero Gravity Dynamics** (Inertia, mass vs. weight, Newton’s Third Law thruster pulses).
- **Mission C: Orbital Navigation & ISS Rendezvous** (Hohmann transfer burns, range-rate closing corridor).
- **Mission D: Emergency Life Support Response** (Real-time critical scenario decisions: hull breaches, radiation storms, toxic coolant leaks).
- **Mission E: Mars Surface Exploration Lab** (Jezero Crater clay mineralogy, UV Raman spectrometer, biosignature preservation).
- **Backend-Evaluated Scoring**: Prevents cheating, validates telemetry server-side, awards XP, and prevents duplicate farming.

### 4. Interactive Space Simulator & Comparative Gravity Lab
- Real-time browser Canvas animation of the Sun, all 8 planets, and lunar orbit with adjustable simulation speed.
- Interactive planetary lock: inspect radius, orbital period, surface gravity ($m/s^2$ and relative $g$), temperatures, and atmospheric composition.
- **Comparative Gravity & Jump Calculator**: Enter your Earth weight (kg) to calculate your exact weight and vertical jump height on any celestial body!

### 5. Knowledge Quiz Engine
- Multiple-choice questions testing astronautic fundamentals.
- Server-side score evaluation (correct indices are kept on the backend).
- Comprehensive results breakdown with clear scientific explanations for each question.
- Unlocks the **Quiz Champion** badge for a 100% score.

### 6. NASA Cosmic Explorer (NASA Open APIs Integration)
- **Astronomy Picture of the Day (APOD)**: Daily high-resolution space photography, title, detailed scientific description, date, and source attribution.
- **NASA Image and Video Library API**: Search live imagery across JPL, JSC, Kennedy, and Goddard archives (Mars, Apollo, James Webb, ISS, Nebulae) with high-res modal lightbox.
- Resilient offline fallback with verified NASA James Webb archive records.

### 7. Gamification & Flight Leaderboard
- Real database registered user rankings sorted by total verified flight XP.
- Displays rank tier, callsign, avatar, and completed missions count.
- Dynamic highlights for the currently logged-in user.

### 8. Web Audio Telemetry Synthesizer
- Built using Web Audio API (zero audio file dependencies).
- Synthesizes space radio beeps, telemetry clicks, thruster launch sweeps, alert sirens, and celebration fanfares with an instant mute toggle in the navbar.

### 9. Protected Admin Dashboard
- Restricted by JWT role authorization (`role: 'admin'`).
- Platform analytics: total registered cadets, completed missions, quiz attempts, average scores, and XP distributed.
- Enrolled trainee directory with user roles and enlistment dates.
- Interactive forms to deploy new missions and publish curriculum modules.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express.js, TypeScript, REST API |
| **Database** | MongoDB, Mongoose, In-Memory Mongo Engine Fallback (Zero Config) |
| **Security** | JWT (JSON Web Tokens), bcrypt password hashing, role-based authorization |
| **External APIs** | NASA APOD API, NASA Image and Video Library (`images-api.nasa.gov`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### 1. Unified Single-Port Launch (Recommended)
The project includes a production build pre-configured to run both the API and the React single-page frontend on port `5000`:

```powershell
# From the root directory:
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in any browser.

---

### 2. Dual-Server Development Mode (Optional)
If you wish to run the Vite HMR dev server and Express API concurrently:

**Terminal 1 (Backend API):**
```powershell
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```powershell
cd client
npm run dev
# Running on http://localhost:3000 (proxies /api to port 5000)
```

---

## 🔑 Pre-Seeded Test Credentials

The database automatically seeds with default test accounts for instant evaluation:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Cadet Trainee** | `cadet@nova.space` | `Cadet@12345` | Ground School, Missions, Quizzes, Simulator, Leaderboard |
| **Flight Director** | `admin@nova.space` | `Admin@12345` | Full Academy Access + Admin Command Center |

*(You can also use the convenient "One-Click Quick Login" buttons on the Sign In page or register a new cadet profile with custom callsign and flight helmet avatar).*

---

## 📁 Project Architecture

```
Junior Astronaut Mission Trainer/
├── server/
│   ├── src/
│   │   ├── config/ (MongoDB connection + in-memory fallback)
│   │   ├── models/ (User, Module, Mission, Quiz, QuizAttempt, UserProgress, Achievement, UserAchievement)
│   │   ├── routes/ (auth, users, dashboard, modules, missions, quizzes, progress, leaderboard, nasa, admin)
│   │   ├── middleware/ (authenticateToken, requireAdmin)
│   │   ├── utils/ (xpCalculator, seedData)
│   │   └── index.ts (Express app entry point + static frontend hosting)
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/ (Navbar, Sidebar, Footer, SolarSystemSim)
│   │   ├── context/ (AuthContext, AudioContext)
│   │   ├── pages/ (Landing, Login, Register, Dashboard, LearningAcademy, ModuleDetail, MissionControl, MissionDetail, SpaceSimulatorPage, QuizList, QuizPage, ProgressTracker, Leaderboard, NasaExplorer, Profile, AdminDashboard)
│   │   ├── services/ (api.ts)
│   │   ├── types/ (index.ts)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json (root scripts)
└── README.md
```

---

## 📜 Acceptance Criteria Verification

- [x] **Secure Authentication**: Registration, login, JWT bearer session, password hashing with bcrypt.
- [x] **MongoDB Persistence**: In-memory MongoDB embedded engine auto-starts if local MongoDB is not running, ensuring 100% out-of-the-box functionality without external dependencies.
- [x] **10 Educational Modules**: Full scientifically verified ground school curriculum.
- [x] **5 Flight Missions (A–E)**: Planet identification, microgravity momentum, orbital docking, emergency life-support, and Mars rover exploration.
- [x] **Server-side Validation**: All quiz answers and mission telemetry are calculated on the backend to prevent score manipulation.
- [x] **Duplicate Reward Prevention**: Re-taking already completed missions or quizzes does not award duplicate XP.
- [x] **Interactive Space Simulator**: Canvas-based orbital mechanics and comparative gravity weight calculator.
- [x] **NASA API Integration**: APOD and NASA Image & Video Library searches with authentic attribution.
- [x] **Real Leaderboard**: Ranks actual registered database users.
- [x] **Protected Admin Terminal**: Role-based access control protecting platform analytics and content publishing.
- [x] **Zero Broken Links / No Fake Controls**: All UI buttons, audio controls, and navigation tabs are fully functional.

---

**NOVA 2.O — Train Today. Explore Tomorrow.**  
*NASA Space Apps Challenge*
