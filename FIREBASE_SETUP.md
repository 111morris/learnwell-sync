# Firebase Setup Guide for LearnHub

This guide will walk you through setting up Firebase for your LearnHub e-learning platform.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter your project name (e.g., "LearnHub")
4. Follow the setup wizard (you can disable Google Analytics for development)

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (</>)
2. Register your app with a nickname (e.g., "LearnHub Web")
3. Copy the Firebase configuration object
4. Open `src/lib/firebase.ts` and replace the config with your values:

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

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Enable **Email/Password** sign-in method
3. Enable **Google** sign-in method:
   - Click on Google
   - Toggle "Enable"
   - Add your support email
   - Save

### Optional: Configure Email Templates

1. Go to **Authentication** > **Templates**
2. Customize email verification and password reset templates

## Step 4: Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Start in **production mode** (we'll add security rules next)
3. Choose a location closest to your users

### Create Collections

Create the following collections manually or let the app create them:

- `users` - User profiles
- `courses` - Course information
- `lessons` - Course lessons
- `enrollments` - Student enrollments
- `progress` - Student progress tracking
- `discussions` - Course discussions

## Step 5: Set Up Firestore Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns a document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated() && getUserRole() == 'instructor';
      allow update, delete: if isAuthenticated() && 
        resource.data.instructorId == request.auth.uid;
    }
    
    // Lessons collection
    match /lessons/{lessonId} {
      allow read: if true; // Public read
      allow create, update, delete: if isAuthenticated() && 
        getUserRole() == 'instructor';
    }
    
    // Enrollments collection
    match /enrollments/{enrollmentId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Progress collection
    match /progress/{progressId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow write: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Discussions collection
    match /discussions/{discussionId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

## Step 6: Set Up Firebase Storage

1. Go to **Storage** > **Get started**
2. Start in **production mode**
3. Choose the same location as Firestore

### Set Up Storage Rules

1. Go to **Storage** > **Rules**
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /course-thumbnails/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /course-videos/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /user-photos/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Configure Authorized Domains

1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your development URL: `localhost`
3. Add your Lovable preview URL (found in your Lovable project)
4. Add your production domain when deployed

## Step 8: Test the Setup

1. Start your development server
2. Try to sign up with email/password
3. Check if the user appears in **Authentication** > **Users**
4. Check if a user profile is created in **Firestore** > **users** collection

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to Authorized domains in Authentication settings

### Issue: "Missing or insufficient permissions"
**Solution:** Check your Firestore security rules and make sure they match the rules above

### Issue: Google Sign-in not working
**Solution:** 
- Verify Google sign-in is enabled in Authentication
- Check that you added a support email
- Make sure your domain is in Authorized domains

## Data Structure Reference

### User Document
```typescript
{
  uid: string,
  email: string,
  role: 'student' | 'instructor',
  displayName: string,
  photoURL?: string,
  createdAt: Timestamp,
  badges: Badge[],
  totalCoursesCompleted: number
}
```

### Course Document
```typescript
{
  id: string,
  title: string,
  description: string,
  thumbnailURL: string,
  instructorId: string,
  instructorName: string,
  tags: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp,
  totalLessons: number,
  duration: number,
  enrolledCount: number
}
```

### Lesson Document
```typescript
{
  id: string,
  courseId: string,
  title: string,
  description: string,
  videoURL: string,
  order: number,
  duration: number,
  createdAt: Timestamp
}
```

## Next Steps

After completing the Firebase setup:

1. ✅ Test authentication (email/password and Google)
2. ✅ Create a course as an instructor
3. ✅ Enroll in a course as a student
4. ✅ Test offline functionality
5. ✅ Monitor usage in Firebase Console

## Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth/web/start)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage/web/start)

---

**Need Help?** Check the Firebase Console logs and browser console for detailed error messages.
