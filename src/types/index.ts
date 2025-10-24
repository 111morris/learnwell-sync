// User and Authentication Types
export type UserRole = 'student' | 'instructor';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  badges: Badge[];
  totalCoursesCompleted: number;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailURL: string;
  instructorId: string;
  instructorName: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  totalLessons: number;
  duration: number; // in minutes
  enrolledCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoURL: string;
  order: number;
  duration: number; // in minutes
  createdAt: Date;
}

// Progress Types
export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessedAt: Date;
  completedAt?: Date;
  progressPercentage: number;
  synced: boolean; // for IndexedDB sync status
}

// Enrollment Type
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

// Discussion Types
export interface Discussion {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  message: string;
  createdAt: Date;
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  message: string;
  createdAt: Date;
}

// Badge Types
export type BadgeType = 
  | 'first_course_completed'
  | 'top_learner'
  | 'five_courses_completed'
  | 'ten_courses_completed'
  | 'course_creator'
  | 'popular_instructor';

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  iconURL: string;
  earnedAt: Date;
}

// Recommendation Types
export interface CourseRecommendation {
  course: Course;
  score: number;
  reason: string;
}
