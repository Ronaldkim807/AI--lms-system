import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

const CourseCatalog = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCourses();
  }, [filters, currentPage]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses({
        ...filters,
        page: currentPage,
        limit: 9
      });
      setCourses(data.courses || []);
      setFilteredCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
    setCurrentPage(1);
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId);
      alert('Successfully enrolled in the course!');
      loadCourses(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const categories = [
    'programming', 'design', 'business', 'science', 
    'mathematics', 'arts', 'language', 'other'
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Course Catalog</h1>
        {user?.role === 'instructor' && (
          <button className="btn btn-success">
            Create New Course
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={filters.search}
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
              >
                <option value="">All Difficulty Levels</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilters({ category: '', difficulty: '', search: '' });
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-5">
          <h3>No courses found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="row">
            {filteredCourses.map(course => (
              <div key={course._id} className="col-md-4 mb-4">
                <div className="card h-100 course-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary">{course.category}</span>
                      <span className="badge bg-secondary">{course.difficulty}</span>
                    </div>
                    
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-muted">
                      {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description
                      }
                    </p>
                    
                    <div className="mb-3">
                      <small className="text-muted">
                        Instructor: {course.instructor?.name || 'Unknown'}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-warning">
                          {'★'.repeat(Math.round(course.averageRating || 0))}
                          {'☆'.repeat(5 - Math.round(course.averageRating || 0))}
                        </span>
                        <small className="text-muted ms-1">
                          ({course.ratings?.length || 0} reviews)
                        </small>
                      </div>
                      <small className="text-muted">
                        {course.enrolledStudents?.length || 0} students
                      </small>
                    </div>
                  </div>
                  
                  <div className="card-footer bg-transparent">
                    <div className="d-grid gap-2">
                      <Link 
                        to={`/courses/${course._id}`}
                        className="btn btn-outline-primary"
                      >
                        View Details
                      </Link>
                      
                      {user?.role === 'student' && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleEnroll(course._id)}
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => (
                  <li 
                    key={index + 1} 
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default CourseCatalog;