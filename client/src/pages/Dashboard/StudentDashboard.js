import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaBookOpen, FaChartLine, FaTrophy, FaClock } from "react-icons/fa";
import { progressService } from "../../services/progressService";
import { courseService } from "../../services/courseService";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [progressData, enrolledData] = await Promise.all([
        progressService.getProgressOverview(),
        courseService.getEnrolledCourses(),
      ]);

      // ✅ Ensure data consistency
      setStats(progressData?.stats || {});
      if (Array.isArray(enrolledData?.courses)) {
        setEnrolledCourses(enrolledData.courses);
      } else if (Array.isArray(enrolledData)) {
        setEnrolledCourses(enrolledData);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading your dashboard...</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Welcome back, {user?.name} 👋</h2>
      <p className="text-muted">Here’s an overview of your learning activity</p>

      {/* === Stats Section === */}
      <div className="row mb-4">
        {[
          { color: "primary", icon: <FaBookOpen />, value: stats.totalCourses || 0, label: "Total Courses" },
          { color: "success", icon: <FaTrophy />, value: stats.completedCourses || 0, label: "Completed" },
          { color: "info", icon: <FaClock />, value: `${stats.totalTimeSpent || 0}m`, label: "Time Spent" },
          { color: "warning", icon: <FaChartLine />, value: `${Math.round(stats.averageProgress || 0)}%`, label: "Avg Progress" },
        ].map((stat, i) => (
          <div key={i} className="col-md-3 mb-3">
            <div className={`card text-center bg-${stat.color} text-${stat.color === "warning" ? "dark" : "white"}`}>
              <div className="card-body">
                <div className="mb-2">{stat.icon}</div>
                <h4>{stat.value}</h4>
                <p>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Enrolled Courses Section === */}
      <h4 className="fw-bold mt-4 mb-3">Your Enrolled Courses</h4>
      {Array.isArray(enrolledCourses) && enrolledCourses.length > 0 ? (
        <div className="row">
          {enrolledCourses.map((course) => (
            <div key={course._id || course.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">{course.title}</h5>
                  <p className="text-muted">
                    {course.description
                      ? `${course.description.substring(0, 100)}...`
                      : "No description available."}
                  </p>
                  <Link
                    to={`/courses/${course._id || course.id}`}
                    className="btn btn-outline-primary w-100"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-light rounded">
          <p>You haven’t enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
