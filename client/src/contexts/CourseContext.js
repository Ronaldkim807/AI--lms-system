import React, { createContext, useState, useContext } from 'react';

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  const value = {
    currentCourse,
    setCurrentCourse,
    courses,
    setCourses,
    loading,
    setLoading,
    filters,
    setFilters
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// Export the context itself for direct use if needed
export { CourseContext };