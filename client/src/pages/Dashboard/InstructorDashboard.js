import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { courseService } from "../../services/courseService";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load instructor dashboard data
  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await courseService.getInstructorCourses();
      const instructorCourses = res || [];

      const totalStudents = instructorCourses.reduce(
        (sum, course) => sum + (course.enrolledStudents?.length || 0),
        0
      );

      const totalRevenue = instructorCourses.reduce(
        (sum, course) =>
          sum + (course.price || 0) * (course.enrolledStudents?.length || 0),
        0
      );

      const averageRating =
        instructorCourses.length > 0
          ? (
              instructorCourses.reduce(
                (sum, c) => sum + (c.averageRating || 0),
                0
              ) / instructorCourses.length
            ).toFixed(1)
          : 0;

      setStats({
        totalCourses: instructorCourses.length,
        totalStudents,
        totalRevenue,
        averageRating,
      });

      setCourses(instructorCourses);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading spinner
  if (loading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading instructor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="card bg-success text-white mb-4 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2 className="card-title mb-1">Welcome, {user?.name} 👨‍🏫</h2>
            <p className="mb-0">Manage your courses and monitor your students</p>
          </div>
          <button
            className="btn btn-light mt-2 mt-md-0"
            onClick={() => navigate("/create-course")}
          >
            ➕ Create New Course
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-4 text-center">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white p-3 shadow-sm">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white p-3 shadow-sm">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white p-3 shadow-sm">
            <h3>{stats.averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-secondary text-white p-3 shadow-sm">
            <h3>${stats.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Your Courses */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Your Courses</h5>
        </div>
        <div className="card-body">
          {courses.length === 0 ? (
            <div className="text-center py-4">
              <h5>No courses yet</h5>
              <p>Create your first course to start teaching!</p>
            </div>
          ) : (
            <div className="row">
              {courses.map((course) => (
                <div key={course._id} className="col-md-6 mb-3">
                  <div className="card h-100 border-light shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-bold">{course.title}</h6>
                      <p className="text-muted small">
                        {course.description?.substring(0, 100)}...
                      </p>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>👥 {course.enrolledStudents?.length || 0}</span>
                        <span>⭐ {course.averageRating || 0}</span>
                        <span>💲{course.price || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
