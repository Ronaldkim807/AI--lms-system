import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';
import CourseCard from '../../components/CourseCard';

const CourseList = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
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
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
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

  const categories = [
    'programming', 'design', 'business', 'science', 
    'mathematics', 'arts', 'language', 'other'
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Course Catalog 🎓</h1>
          <p className="text-muted">Discover and enroll in amazing courses</p>
        </div>
        {user?.role === 'instructor' && (
          <Link to="/instructor/courses/create" className="btn btn-success">
            ➕ Create New Course
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
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
                <option value="">All Levels</option>
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
                🔄 Clear
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
      ) : courses.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">📚</div>
          <h3>No courses found</h3>
          <p className="text-muted">Try adjusting your search filters or check back later for new courses.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setFilters({ category: '', difficulty: '', search: '' });
              setCurrentPage(1);
            }}
          >
            Show All Courses
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            {courses.map(course => (
              <div key={course._id} className="col-md-4 mb-4">
                <CourseCard course={course} showEnrollButton={true} />
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

export default CourseList;