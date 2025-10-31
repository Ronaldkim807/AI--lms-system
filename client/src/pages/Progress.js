import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressService } from '../services/progressService';
import { useAuth } from '../contexts/AuthContext';
import progress  from '../components/progress/Progress';

// FIXED: Renamed to ProgressPage to avoid naming conflict
const ProgressPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progressData = await progressService.getProgressOverview();
      setProgress(progressData.progress || []);
      setStats(progressData.stats || {});
    } catch (error) {
      console.error('Failed to load progress:', error);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>My Learning Progress 📊</h1>
          <p className="text-muted">Track your learning journey and achievements</p>
        </div>
        <Link to="/courses" className="btn btn-primary">
          🎓 Find More Courses
        </Link>
      </div>

      {/* Progress Overview */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body text-center">
              <h2>{stats.totalCourses || 0}</h2>
              <p>Total Courses</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body text-center">
              <h2>{stats.completedCourses || 0}</h2>
              <p>Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body text-center">
              <h2>{formatTime(stats.totalTimeSpent || 0)}</h2>
              <p>Time Spent</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body text-center">
              <h2>{Math.round(stats.averageProgress || 0)}%</h2>
              <p>Average Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress List */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Course Progress</h5>
        </div>
        <div className="card-body">
          {progress.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3">📖</div>
              <h5>No progress to show yet</h5>
              <p className="text-muted">Enroll in courses to start tracking your learning progress!</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Time Spent</th>
                    <th>Status</th>
                    <th>Last Accessed</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map(item => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.course?.title}</strong>
                        <br />
                        <small className="text-muted">{item.course?.category}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ width: `${item.progressPercentage || 0}%` }}
                            ></div>
                          </div>
                          <small>{Math.round(item.progressPercentage || 0)}%</small>
                        </div>
                      </td>
                      <td>
                        <small>{formatTime(item.totalTimeSpent || 0)}</small>
                      </td>
                      <td>
                        {item.completed ? (
                          <span className="badge bg-success">Completed</span>
                        ) : item.progressPercentage > 0 ? (
                          <span className="badge bg-warning">In Progress</span>
                        ) : (
                          <span className="badge bg-secondary">Not Started</span>
                        )}
                      </td>
                      <td>
                        <small>
                          {item.lastAccessed 
                            ? new Date(item.lastAccessed).toLocaleDateString()
                            : 'Never'
                          }
                        </small>
                      </td>
                      <td>
                        <Link 
                          to={`/learn/${item.course?._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          {item.completed ? 'Review' : 'Continue'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Section */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title mb-0">🎯 Learning Achievements</h5>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div className={`achievement-card ${stats.completedCourses > 0 ? 'unlocked' : 'locked'}`}>
                <div className="display-4">
                  {stats.completedCourses > 0 ? '🏆' : '🔒'}
                </div>
                <h6>First Course Completed</h6>
                <small className="text-muted">
                  {stats.completedCourses > 0 ? 'Unlocked!' : 'Complete your first course'}
                </small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className={`achievement-card ${stats.totalTimeSpent > 60 ? 'unlocked' : 'locked'}`}>
                <div className="display-4">
                  {stats.totalTimeSpent > 60 ? '⏱️' : '🔒'}
                </div>
                <h6>Dedicated Learner</h6>
                <small className="text-muted">
                  {stats.totalTimeSpent > 60 ? '1+ hour learned!' : 'Learn for 1 hour'}
                </small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className={`achievement-card ${stats.totalCourses >= 3 ? 'unlocked' : 'locked'}`}>
                <div className="display-4">
                  {stats.totalCourses >= 3 ? '📚' : '🔒'}
                </div>
                <h6>Course Explorer</h6>
                <small className="text-muted">
                  {stats.totalCourses >= 3 ? '3+ courses enrolled!' : 'Enroll in 3 courses'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;