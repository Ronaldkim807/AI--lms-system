import React from 'react';
import { useParams } from 'react-router-dom';

const CoursePlayer = () => {
  const { courseId } = useParams();

  return (
    <div>
      <h1>Course Player</h1>
      <p>Playing course: {courseId}</p>
      <div className="alert alert-info">
        This component will be built to handle video playback and progress tracking.
      </div>
    </div>
  );
};

export default CoursePlayer;