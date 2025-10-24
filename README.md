# 🎓 E-LearnX — Modular E-Learning Platform (React 19 + Firebase + IndexedDB)

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)

> A scalable **e-learning MVP** built with **React 19 (Vite + TypeScript)** and **Firebase**.  
> Supports **students** and **instructors**, real-time **discussions**, **offline progress tracking** via IndexedDB, and **gamified badges**.  
> Designed for future scalability — ready for **AI-powered course recommendations** and analytics integrations.

---

## 🚀 Features Overview

### 👩‍🏫 Roles & Authentication
- 🔐 Firebase Authentication (Email/Password + Google OAuth)
- 🧭 Role-based user tagging (`student` / `instructor`)
- 🧱 Protected + dynamic routes using **React Router v6.4**

---

### 📚 Courses & Lessons

#### For Instructors:
- Create, edit, and delete courses  
- Upload thumbnails, add video links, and structure lessons

#### For Students:
- Browse, enroll, and watch lessons  
- Track progress and earn badges  

---

### 💬 Real-Time Discussions
- Firestore-powered live chat per course  
- Real-time updates via Firestore listeners  

---

### 🔄 Offline Progress & Sync
- Local caching via **IndexedDB (Dexie.js)**  
- Offline progress auto-syncs to Firestore when back online  

---

### 🏅 Gamification
- Automatic badges + achievements  
  - 🏆 *First Course Completed*  
  - 🧠 *Top Learner*  
  - 💬 *Active Participant*

---

### 💡 Recommendations
- Rule-based system using course tags  
- Future-ready for **AI-driven personalization**

---

## 🧩 Tech Stack

```text
Layer                Technology
-----------------------------------------------------
Frontend Framework   React 19 + Vite + TypeScript
UI & Styling         Tailwind CSS + Heroicons / MUI
Routing              React Router v6.4
Auth & Data          Firebase Auth + Firestore + Storage
Offline Storage      IndexedDB via Dexie.js
Video                ReactPlayer
Notifications        React-Toastify / React-Hot-Toast
Deployment           Vercel

```

project architecture 
```bash
src/
├── components/
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   └── Alert.tsx
│   └── CourseCard.tsx
│
├── context/
│   └── AuthContext.tsx         # Provides user + role globally
│
├── hooks/
│   ├── useFirestore.ts         # Firestore CRUD operations
│   ├── useOfflineSync.ts       # Dexie.js IndexedDB sync logic
│   └── useAuthGuard.ts         # Protects routes by role
│
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard/
│   │   ├── StudentDashboard.tsx
│   │   └── InstructorDashboard.tsx
│   ├── Course/
│   │   ├── CourseList.tsx
│   │   ├── CourseDetail.tsx
│   │   └── LessonPage.tsx
│   └── NotFound.tsx
│
├── config/
│   └── firebase.ts             # Firebase initialization
│
├── types/
│   ├── course.ts
│   ├── lesson.ts
│   ├── user.ts
│   └── progress.ts
│
├── App.tsx
├── main.tsx
└── index.css
```


🔐 Firebase Setup

Create a Firebase project:
👉 https://console.firebase.google.com

Enable:

Authentication → Email/Password + Google

Firestore Database

Storage (for thumbnails)

Add Firebase config:

// /src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


Create a .env file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

⚙️ Installation & Setup
# Clone repo
git clone https://github.com/yourusername/elearnx.git
cd elearnx

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build


Then open ➜ http://localhost:5173

🔄 IndexedDB Sync (Dexie.js)

Student progress is cached locally while offline.
When reconnected, the useOfflineSync hook syncs progress to Firestore.

// src/db/indexedDB.ts
import Dexie from 'dexie';

export const db = new Dexie('elearnx_db');
db.version(1).stores({
  progress: '++id, courseId, userId, completedLessons'
});

🧠 State & Data Flow
graph TD
A[AuthContext] --> B[useFirestore Hook]
B --> C[Firestore CRUD]
A --> D[ProtectedRoute]
D --> E[Pages (Dashboard, Course, Lesson)]
E --> F[useOfflineSync]
F --> G[Dexie.js Cache]
G --> B

🧱 Key Components
Component	Description
AuthContext	Provides user state + role context
useFirestore	Encapsulates all Firestore CRUD logic
useOfflineSync	Local caching + Firestore sync
CourseCard	Displays course info with thumbnail
DiscussionBoard	Real-time Firestore chat per course
ProgressBar	Tracks and visualizes lesson completion progress
🌙 UX Features

🌗 Dark/Light mode toggle

⏳ Skeleton loaders for placeholders

🔔 Toast notifications for events

📱 Responsive design (mobile-first via Tailwind CSS)

🏁 Deployment (Vercel)

Push project to GitHub

Go to Vercel Dashboard

Import the repository

Configure build:

Build Command: npm run build
Output Directory: dist


Add environment variables (same as .env)

Deploy 🎉

Optional: Add vercel.json for clean routes:

{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}

🔮 Future Roadmap

🤖 AI-powered recommendation engine (by tags + learning style)

📊 Instructor analytics dashboard

📱 PWA support for offline mobile learning

🗓️ Calendar integration for live sessions

🎯 Advanced gamification + leaderboard system

🧾 License

MIT License © 2025 [Your Name]

👨‍💻 Author

[Your Name]
Full-Stack Engineer — React • Firebase • TypeScript
📧 your.email@example.com

🌐 yourportfolio.com