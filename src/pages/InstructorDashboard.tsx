import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/types';
import { Plus, BookOpen, Users, TrendingUp } from 'lucide-react';

const InstructorDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchInstructorCourses();
    }
  }, [userProfile]);

  const fetchInstructorCourses = async () => {
    if (!userProfile) return;

    try {
      const q = query(
        collection(db, 'courses'),
        where('instructorId', '==', userProfile.uid)
      );
      const snapshot = await getDocs(q);
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolledCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and track student progress</p>
          </div>
          <Button onClick={() => navigate('/instructor/courses/create')} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Enrollment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.length > 0 ? Math.round(totalEnrollments / courses.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
          {loading ? (
            <div>Loading...</div>
          ) : courses.length > 0 ? (
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-elegant transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={course.thumbnailURL}
                        alt={course.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>{course.totalLessons} lessons</span>
                          <span>{course.enrolledCount} students</span>
                          <span>{course.duration} minutes</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't created any courses yet</p>
                <Button onClick={() => navigate('/instructor/courses/create')}>
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
