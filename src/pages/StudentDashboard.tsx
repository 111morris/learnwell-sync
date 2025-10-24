import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { CourseCard } from '@/components/CourseCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Course, CourseProgress, Enrollment } from '@/types';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

const StudentDashboard = () => {
  const { userProfile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchEnrolledCourses();
    }
  }, [userProfile]);

  const fetchEnrolledCourses = async () => {
    if (!userProfile) return;

    try {
      // Get enrollments
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('userId', '==', userProfile.uid)
      );
      const enrollmentsSnap = await getDocs(enrollmentsQuery);
      const enrollments = enrollmentsSnap.docs.map((doc) => doc.data()) as Enrollment[];

      // Get courses
      const courseIds = enrollments.map((e) => e.courseId);
      if (courseIds.length > 0) {
        const coursesQuery = query(
          collection(db, 'courses'),
          where('__name__', 'in', courseIds)
        );
        const coursesSnap = await getDocs(coursesQuery);
        const coursesData = coursesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setEnrolledCourses(coursesData);
      }

      // Get progress
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', userProfile.uid)
      );
      const progressSnap = await getDocs(progressQuery);
      const progressData = progressSnap.docs.map((doc) => doc.data()) as CourseProgress[];
      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForCourse = (courseId: string): number => {
    const courseProgress = progress.find((p) => p.courseId === courseId);
    return courseProgress?.progressPercentage || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {userProfile?.displayName}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile?.totalCoursesCompleted || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile?.badges.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        {userProfile && userProfile.badges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {userProfile.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                    🏆 {badge.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>
          {loading ? (
            <div>Loading...</div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <CourseCard course={course} />
                  <div className="px-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{getProgressForCourse(course.id)}%</span>
                    </div>
                    <Progress value={getProgressForCourse(course.id)} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                <a href="/courses" className="text-primary hover:underline">
                  Browse available courses
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
