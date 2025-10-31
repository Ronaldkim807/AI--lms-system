import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const courseData = await courseService.getCourse(id);
      setCourse(courseData);
      
      // Check if user is enrolled
      if (user && courseData.enrolledStudents) {
        const isEnrolled = courseData.enrolledStudents.some(
          studentId => studentId.toString() === user.id
        );
        setEnrolled(isEnrolled);
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await courseService.enrollInCourse(id);
      setEnrolled(true);
      navigate(`/learn/${id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <h3>Course not found</h3>
          <Link to="/courses" className="btn btn-primary">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Course Header */}
      <div className="card mb-4">
        <div className="card-body">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/courses">Courses</Link>
              </li>
              <li className="breadcrumb-item active">{course.title}</li>
            </ol>
          </nav>
          
          <div className="row">
            <div className="col-md-8">
              <h1>{course.title}</h1>
              <p className="lead">{course.description}</p>
              
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-primary">{course.category}</span>
                <span className="badge bg-secondary">{course.difficulty}</span>
                <span className="badge bg-success">
                  {course.enrolledStudents?.length || 0} students enrolled
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="text-warning me-2">
                  {'★'.repeat(Math.round(course.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(course.averageRating || 0))}
                </span>
                <span className="text-muted">
                  ({course.ratings?.length || 0} ratings)
                </span>
              </div>

              <p>
                <strong>Instructor:</strong> {course.instructor?.name || 'Unknown'}
              </p>
            </div>
            
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <h4 className="text-primary">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </h4>
                  
                  {enrolled ? (
                    <Link 
                      to={`/learn/${course._id}`} 
                      className="btn btn-success w-100 mb-2"
                    >
                      Continue Learning
                    </Link>
                  ) : (
                    <button 
                      onClick={handleEnroll}
                      className="btn btn-primary w-100 mb-2"
                      disabled={user?.role !== 'student'}
                    >
                      {user?.role === 'student' ? 'Enroll Now' : 'Instructor View'}
                    </button>
                  )}
                  
                  <div className="small text-muted">
                    {course.videos?.length || 0} lessons • 
                    {Math.round((course.videos?.reduce((total, video) => total + (video.duration || 0), 0) || 0) / 60)} total minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Course Content */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Course Content</h5>
            </div>
            <div className="card-body">
              {course.videos && course.videos.length > 0 ? (
                <div className="list-group">
                  {course.videos.map((video, index) => (
                    <div key={video._id || index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">
                            {index + 1}. {video.title}
                          </h6>
                          <p className="mb-1 text-muted small">
                            {video.description}
                          </p>
                        </div>
                        <span className="badge bg-light text-dark">
                          {video.duration ? `${video.duration}m` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No content available yet.</p>
              )}
            </div>
          </div>

          {/* Ratings and Reviews */}
          <div className="card">
            <div className="card-header">
              <h5>Ratings & Reviews</h5>
            </div>
            <div className="card-body">
              {course.ratings && course.ratings.length > 0 ? (
                <div>
                  {course.ratings.map((rating, index) => (
                    <div key={index} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between">
                        <strong>{rating.user?.name || 'Anonymous'}</strong>
                        <span className="text-warning">
                          {'★'.repeat(rating.rating)}
                          {'☆'.repeat(5 - rating.rating)}
                        </span>
                      </div>
                      {rating.review && (
                        <p className="mt-2 mb-0">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Course Info Sidebar */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h6>What you'll learn</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                {course.tags && course.tags.map((tag, index) => (
                  <li key={index} className="mb-1">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h6>Course Features</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Lifetime access</span>
                <span className="text-success">✓</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Certificate of completion</span>
                <span className="text-success">✓</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Mobile and TV access</span>
                <span className="text-success">✓</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Q&A support</span>
                <span className="text-success">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;