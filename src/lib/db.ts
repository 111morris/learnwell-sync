import Dexie, { Table } from 'dexie';
import { CourseProgress } from '@/types';

/**
 * IndexedDB Database using Dexie.js
 * 
 * This provides offline-first capabilities and syncs with Firestore when online.
 * Course progress is cached locally and synchronized in the background.
 */

class LearnHubDatabase extends Dexie {
  courseProgress!: Table<CourseProgress, string>;

  constructor() {
    super('LearnHubDB');
    
    this.version(1).stores({
      courseProgress: 'id, userId, courseId, lastAccessedAt, synced',
    });
  }
}

export const localDB = new LearnHubDatabase();

/**
 * Save progress to IndexedDB
 */
export async function saveProgressLocally(progress: CourseProgress): Promise<void> {
  await localDB.courseProgress.put(progress);
}

/**
 * Get progress from IndexedDB
 */
export async function getProgressLocally(
  userId: string,
  courseId: string
): Promise<CourseProgress | undefined> {
  return await localDB.courseProgress
    .where({ userId, courseId })
    .first();
}

/**
 * Get all unsynced progress records
 */
export async function getUnsyncedProgress(): Promise<CourseProgress[]> {
  return await localDB.courseProgress
    .where('synced')
    .equals(0)
    .toArray();
}

/**
 * Mark progress as synced
 */
export async function markProgressSynced(progressId: string): Promise<void> {
  await localDB.courseProgress.update(progressId, { synced: true });
}

/**
 * Get all progress for a user
 */
export async function getAllUserProgress(userId: string): Promise<CourseProgress[]> {
  return await localDB.courseProgress
    .where('userId')
    .equals(userId)
    .toArray();
}

/**
 * Clear all local data (useful for logout)
 */
export async function clearLocalData(): Promise<void> {
  await localDB.courseProgress.clear();
}
