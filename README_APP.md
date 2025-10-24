# LearnHub - E-Learning Platform MVP

A modern, scalable e-learning platform built with React 19, Firebase, and IndexedDB for offline-first functionality.

## 🚀 Features

### Authentication
- Email/Password sign up and login
- Google OAuth integration
- Role-based access (Student/Instructor)
- Protected routes

### For Students
- Browse and search courses
- Enroll in courses
- Track learning progress
- Watch video lessons
- Participate in course discussions
- Earn badges for achievements
- View recommended courses
- Offline learning with automatic sync

### For Instructors
- Create and manage courses
- Upload course content (videos, materials)
- Track student enrollments
- View analytics and insights

### Technical Features
- **Offline-First**: IndexedDB caching with Dexie.js
- **Real-time**: Firestore real-time listeners for discussions
- **Responsive**: Mobile-first design with Tailwind CSS
- **Gamification**: Badge system for student engagement
- **Video Player**: ReactPlayer for embedded lessons
- **Progress Tracking**: Automatic sync between local and cloud
- **Modern UI**: Beautiful design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Offline Storage**: IndexedDB with Dexie.js
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router with protected routes
- **Video**: ReactPlayer
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Basic knowledge of React and TypeScript

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

Follow the detailed guide in `FIREBASE_SETUP.md` to:
- Create a Firebase project
- Enable Authentication (Email/Password + Google)
- Set up Firestore Database
- Configure Storage
- Set security rules

### 3. Configure Firebase

Edit `src/lib/firebase.ts` and replace with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn components
│   ├── Navbar.tsx
│   ├── CourseCard.tsx
│   ├── ProtectedRoute.tsx
│   └── OfflineIndicator.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── lib/              # Utilities and services
│   ├── firebase.ts   # Firebase configuration
│   ├── db.ts         # IndexedDB setup
│   ├── sync.ts       # Sync service
│   └── utils.ts
├── pages/            # Route pages
│   ├── HomePage.tsx
│   ├── AuthPage.tsx
│   ├── CoursesPage.tsx
│   ├── StudentDashboard.tsx
│   └── InstructorDashboard.tsx
├── types/            # TypeScript types
│   └── index.ts
└── App.tsx          # Main app component
```

## 🎯 Key Features Explained

### Offline-First Architecture

The app uses IndexedDB to cache progress locally and syncs with Firestore when online:

```typescript
// Save progress locally
await saveProgressLocally(progress);

// Sync to Firestore when online
if (navigator.onLine) {
  await syncProgressToFirestore();
}
```

### Real-Time Discussions

Course discussions use Firestore's real-time listeners:

```typescript
const unsubscribe = onSnapshot(discussionsQuery, (snapshot) => {
  const discussions = snapshot.docs.map(doc => doc.data());
  setDiscussions(discussions);
});
```

### Badge System

Students earn badges for achievements:
- 🎓 First Course Completed
- ⭐ Five Courses
- 🏆 Ten Courses
- 📚 Top Learner

### Course Recommendations

Rule-based filtering suggests related courses based on:
- Shared tags
- Similar instructors
- Completion patterns

## 🔐 Security

### Firestore Security Rules

Rules ensure:
- Users can only edit their own data
- Instructors can manage their courses
- Students can only access enrolled courses
- All reads/writes are authenticated

### Authentication

- Passwords are handled securely by Firebase Auth
- Session tokens are managed automatically
- Google OAuth uses secure token exchange

## 📱 Responsive Design

The platform is fully responsive with:
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for tablets and desktops
- Adaptive navigation

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Configure environment variables (Firebase config)
4. Deploy!

### Configure Firebase for Production

1. Add your production domain to Authorized Domains
2. Update Firestore security rules if needed
3. Set up Firebase indexes for queries

## 🎨 Customization

### Design System

Colors and styles are defined in:
- `src/index.css` - CSS variables
- `tailwind.config.ts` - Tailwind configuration

### Components

All shadcn components can be customized in `src/components/ui/`

## 🐛 Common Issues

### Authentication Errors

**Issue**: "Firebase: Error (auth/unauthorized-domain)"
**Fix**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Offline Sync Issues

**Issue**: Progress not syncing
**Fix**: Check browser console for errors, verify Firestore rules

### Video Playback Issues

**Issue**: Videos not loading
**Fix**: Ensure video URLs are accessible and CORS is configured

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🆘 Support

For issues and questions:
1. Check `FIREBASE_SETUP.md` for setup help
2. Review Firebase Console logs
3. Check browser console for errors
4. Review Firestore security rules

---

**Built with ❤️ using React, Firebase, and modern web technologies**
