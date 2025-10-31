import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, showEnrollButton = true }) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text">{course.description}</p>
        <Link to={`/courses/${course._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;