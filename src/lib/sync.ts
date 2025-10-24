import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { CourseProgress } from '@/types';
import {
  getUnsyncedProgress,
  markProgressSynced,
  saveProgressLocally,
} from './db';
import toast from 'react-hot-toast';

/**
 * Sync Service for Offline-First Functionality
 * 
 * Handles synchronization between IndexedDB (local) and Firestore (cloud).
 * Implements automatic sync when connection is restored.
 */

let syncInProgress = false;
let onlineStatusListener: (() => void) | null = null;

/**
 * Sync all unsynced progress to Firestore
 */
export async function syncProgressToFirestore(): Promise<void> {
  if (syncInProgress) {
    return;
  }

  syncInProgress = true;

  try {
    const unsyncedProgress = await getUnsyncedProgress();

    if (unsyncedProgress.length === 0) {
      syncInProgress = false;
      return;
    }

    console.log(`Syncing ${unsyncedProgress.length} progress records...`);

    for (const progress of unsyncedProgress) {
      try {
        const docRef = doc(db, 'progress', progress.id);
        await setDoc(docRef, progress, { merge: true });
        await markProgressSynced(progress.id);
      } catch (error) {
        console.error('Error syncing progress:', error);
      }
    }

    toast.success(`Synced ${unsyncedProgress.length} progress records`);
  } catch (error) {
    console.error('Sync error:', error);
  } finally {
    syncInProgress = false;
  }
}

/**
 * Fetch progress from Firestore and save locally
 */
export async function fetchProgressFromFirestore(
  userId: string,
  courseId: string
): Promise<CourseProgress | null> {
  try {
    const progressId = `${userId}_${courseId}`;
    const docRef = doc(db, 'progress', progressId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const progress = { id: docSnap.id, ...docSnap.data() } as CourseProgress;
      await saveProgressLocally(progress);
      return progress;
    }

    return null;
  } catch (error) {
    console.error('Error fetching progress from Firestore:', error);
    return null;
  }
}

/**
 * Update lesson completion status
 */
export async function updateLessonCompletion(
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessons: number
): Promise<void> {
  const progressId = `${userId}_${courseId}`;

  try {
    // Get existing progress or create new
    const docRef = doc(db, 'progress', progressId);
    const docSnap = await getDoc(docRef);

    let completedLessons: string[] = [];
    
    if (docSnap.exists()) {
      completedLessons = docSnap.data().completedLessons || [];
    }

    // Add lesson if not already completed
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);
    const isCompleted = completedLessons.length === totalLessons;

    const progress: CourseProgress = {
      id: progressId,
      userId,
      courseId,
      completedLessons,
      lastAccessedAt: new Date(),
      completedAt: isCompleted ? new Date() : undefined,
      progressPercentage,
      synced: navigator.onLine,
    };

    // Save locally first
    await saveProgressLocally(progress);

    // Try to sync to Firestore if online
    if (navigator.onLine) {
      try {
        await setDoc(docRef, progress, { merge: true });
        await markProgressSynced(progressId);
      } catch (error) {
        console.error('Error syncing to Firestore:', error);
        toast.error('Progress saved locally, will sync when online');
      }
    } else {
      toast('Progress saved offline, will sync later', { icon: '📱' });
    }

    // Award badge if completed
    if (isCompleted) {
      await awardCompletionBadge(userId);
    }
  } catch (error) {
    console.error('Error updating lesson completion:', error);
    throw error;
  }
}

/**
 * Award badge to user for completing a course
 */
async function awardCompletionBadge(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const totalCompleted = (userData.totalCoursesCompleted || 0) + 1;
      
      const updates: any = {
        totalCoursesCompleted: totalCompleted,
      };

      // Award badges based on milestones
      const badges = userData.badges || [];
      
      if (totalCompleted === 1 && !badges.some((b: any) => b.type === 'first_course_completed')) {
        badges.push({
          type: 'first_course_completed',
          name: 'First Course Completed',
          description: 'Completed your first course',
          iconURL: '🎓',
          earnedAt: new Date(),
        });
        toast.success('🎓 Badge earned: First Course Completed!');
      }

      if (totalCompleted === 5 && !badges.some((b: any) => b.type === 'five_courses_completed')) {
        badges.push({
          type: 'five_courses_completed',
          name: 'Five Courses',
          description: 'Completed 5 courses',
          iconURL: '⭐',
          earnedAt: new Date(),
        });
        toast.success('⭐ Badge earned: Five Courses!');
      }

      if (totalCompleted === 10 && !badges.some((b: any) => b.type === 'ten_courses_completed')) {
        badges.push({
          type: 'ten_courses_completed',
          name: 'Ten Courses',
          description: 'Completed 10 courses',
          iconURL: '🏆',
          earnedAt: new Date(),
        });
        toast.success('🏆 Badge earned: Ten Courses!');
      }

      updates.badges = badges;

      await updateDoc(userRef, updates);
    }
  } catch (error) {
    console.error('Error awarding badge:', error);
  }
}

/**
 * Initialize sync service with online/offline detection
 */
export function initializeSyncService(): void {
  // Sync when app comes online
  onlineStatusListener = () => {
    if (navigator.onLine) {
      console.log('Connection restored, syncing...');
      syncProgressToFirestore();
    }
  };

  window.addEventListener('online', onlineStatusListener);

  // Initial sync if online
  if (navigator.onLine) {
    syncProgressToFirestore();
  }
}

/**
 * Cleanup sync service
 */
export function cleanupSyncService(): void {
  if (onlineStatusListener) {
    window.removeEventListener('online', onlineStatusListener);
    onlineStatusListener = null;
  }
}

/**
 * Check if app is currently online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
