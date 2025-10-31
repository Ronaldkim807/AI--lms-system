import React, { useEffect, useState } from "react";
import API from "../api/axios";

const MyCourses = () => {
  const [data, setData] = useState({ createdCourses: [], enrolledCourses: [], role: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/users/courses");
        setData(res.data);
      } catch (err) {
        console.error("❌ Error fetching my courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading your courses...</p>;

  return (
    <div className="my-courses-container">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {data.role === "instructor" && (
        <>
          <h3 className="text-xl font-semibold mb-2">Courses You Created</h3>
          {data.createdCourses.length ? (
            <ul>
              {data.createdCourses.map((c) => (
                <li key={c._id}>{c.title}</li>
              ))}
            </ul>
          ) : (
            <p>No courses created yet.</p>
          )}
        </>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">Courses You Enrolled In</h3>
      {data.enrolledCourses.length ? (
        <ul>
          {data.enrolledCourses.map((c) => (
            <li key={c._id}>{c.title}</li>
          ))}
        </ul>
      ) : (
        <p>No enrolled courses yet.</p>
      )}
    </div>
  );
};

export default MyCourses;
