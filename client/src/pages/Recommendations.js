import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recommendationService } from "../services/recommendationService";
import { useAuth } from "../contexts/AuthContext";
import { courseService } from "../services/courseService";
import {
  RefreshCw,
  Brain,
  Flame,
  Users,
  BookOpen,
  Star,
  AlertCircle,
} from "lucide-react";

const Recommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Build user data for AI service
      const userData = {
        user_id: user?._id || "guest",
        user_interests: user?.interests || ["programming", "technology"],
        completed_courses: user?.completedCourses || [],
        enrolled_courses: user?.enrolledCourses || [],
      };

      // ✅ Fetch recommendations from AI backend
      const aiResponse = await recommendationService.getRecommendations(userData);
      setRecommendations(aiResponse.recommendations || []);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
      setError("Failed to load recommendations. Using mock data...");

      // ✅ Fallback to mock recommendations
      const aiRecommendations = await recommendationService.getRecommendations(user);
setRecommendations(aiRecommendations);

    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = async () => {
    const courses = await courseService.getCourses();
    const userInterests = user?.interests || ["programming", "technology"];

    return (
      courses.courses
        ?.filter((course) =>
          userInterests.some(
            (interest) =>
              course.title.toLowerCase().includes(interest.toLowerCase()) ||
              course.description.toLowerCase().includes(interest.toLowerCase()) ||
              course.tags?.some((tag) =>
                tag.toLowerCase().includes(interest.toLowerCase())
              )
          )
        )
        .slice(0, 6)
        .map((course) => ({
          ...course,
          similarity_score: Math.random() * 0.5 + 0.5,
          reason: `Matches your interest in ${userInterests[0]}`,
        })) || []
    );
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId);
      alert("Successfully enrolled in the course!");
      setRecommendations((prev) => prev.filter((rec) => rec._id !== courseId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to enroll in course");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3">Analyzing your learning patterns, please wait...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="d-flex align-items-center gap-2">
            <Brain size={26} /> AI Recommendations
          </h1>
          <p className="text-muted mb-0">
            Personalized course suggestions based on your interests and activity
          </p>
        </div>
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={loadRecommendations}
          disabled={loading}
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <AlertCircle className="me-2" size={18} /> {error}
        </div>
      )}

      {/* AI Explanation Card */}
      <div className="card bg-light mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-1 text-center">
              <Brain size={40} className="text-primary" />
            </div>
            <div className="col-md-11">
              <h5>How AI Recommendations Work</h5>
              <p className="mb-0 text-muted">
                Our system analyzes your interests (
                {user?.interests?.join(", ") || "programming"}), your course
                history, and learning progress to find the most relevant courses
                for you. Each recommendation includes a match score indicating
                how well it fits your learning profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length === 0 ? (
        <div className="text-center py-5">
          <BookOpen size={64} className="text-muted mb-3" />
          <h3>No recommendations found</h3>
          <p className="text-muted">
            Update your interests in your profile or explore more courses to help
            the system understand your preferences.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Browse All Courses
          </Link>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            {recommendations.map((course) => (
              <div key={course._id || course.id} className="col-md-6 mb-4">
                <div className="card h-100 border-primary shadow-sm">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                      <Flame size={16} />{" "}
                      {Math.round((course.similarity_score || 0) * 100)}% Match
                    </span>
                    <small>{course.reason}</small>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-muted">{course.description}</p>

                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-2">
                        {course.category}
                      </span>
                      <span className="badge bg-light text-dark">
                        {course.difficulty}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="text-warning">
                          {Array(Math.round(course.averageRating || 0))
                            .fill()
                            .map((_, i) => (
                              <Star key={i} size={16} fill="#ffc107" />
                            ))}
                        </span>
                        <small className="text-muted ms-1">
                          ({course.ratings?.length || 0})
                        </small>
                      </div>
                      <small className="text-muted d-flex align-items-center gap-1">
                        <Users size={16} />{" "}
                        {course.enrolledStudents?.length || 0} students
                      </small>
                    </div>

                    <div className="alert alert-info small">
                      <strong>AI Insight:</strong> This course matches your
                      learning profile and supports your growth in{" "}
                      {user?.interests?.[0] || "technology"}.
                    </div>
                  </div>

                  <div className="card-footer bg-transparent">
                    <div className="d-grid gap-2">
                      <Link
                        to={`/course/${course._id || course.id}`}
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                      >
                        <BookOpen size={18} /> View Details
                      </Link>
                      <button
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleEnroll(course._id || course.id)}
                      >
                        <Star size={18} /> Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation Stats */}
          <div className="card mt-4 shadow-sm">
            <div className="card-body text-center">
              <h5>Recommendation Summary</h5>
              <div className="row mt-3">
                <div className="col-md-4">
                  <h4>{recommendations.length}</h4>
                  <p className="text-muted">Courses Recommended</p>
                </div>
                <div className="col-md-4">
                  <h4>
                    {Math.round(
                      (recommendations.reduce(
                        (sum, rec) => sum + (rec.similarity_score || 0),
                        0
                      ) /
                        recommendations.length) *
                        100
                    )}
                    %
                  </h4>
                  <p className="text-muted">Average Match Score</p>
                </div>
                <div className="col-md-4">
                  <h4>{user?.interests?.length || 0}</h4>
                  <p className="text-muted">Your Interests</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;
