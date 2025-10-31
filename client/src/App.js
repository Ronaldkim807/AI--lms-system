import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/layout/Toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateCourse from './pages/CreateCourse';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import InstructorDashboard from './pages/Dashboard/InstructorDashboard';
import MyCourses from './pages/MyCourses';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import CoursePlayer from './pages/courses/CoursePlayer';
import Recommendations from './pages/Recommendations';
import ProgressPage from './pages/Progress';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/**
 * Dashboard Router – decides which dashboard to render based on role
 */
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return user.role === 'instructor'
    ? <InstructorDashboard />
    : <StudentDashboard />;
};

/**
 * App Component
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <div className="App d-flex flex-column min-vh-100">
            <Navbar />
             <Toast /> {/* Add Toast notifications */}
            <main className="flex-grow-1">
              <Routes>
                {/* ---------- Public Routes ---------- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ---------- Protected Routes ---------- */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <CourseList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId"
                  element={
                    <ProtectedRoute>
                      <CoursePlayer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <ProgressPage />
                    </ProtectedRoute>
                  }
                />

                {/* ---------- Default and 404 ---------- */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                 <Route path="/create-course" element={<CreateCourse />} />
                 <Route path="/my-courses" element={<MyCourses />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
