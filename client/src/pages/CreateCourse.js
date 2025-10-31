import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { courseService } from "../services/courseService";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "AI",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.createCourse(course);
      alert("✅ Course created successfully!");
      navigate("/dashboard"); // redirect back to dashboard
    } catch (error) {
      console.error("Error creating course:", error);
      alert("❌ Failed to create course. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="form-control"
            rows={4}
            required
          />
        </div>
        <div className="mb-3">
          <select
            name="category"
            value={course.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option>AI</option>
            <option>Machine Learning</option>
            <option>Deep Learning</option>
            <option>Data Science</option>
            <option>Web Development</option>
            <option>Cybersecurity</option>
            <option>Cloud Computing</option>
            <option>Mobile Development</option>
            <option>Software Engineering</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="price"
            value={course.price}
            onChange={handleChange}
            placeholder="Price (USD)"
            className="form-control"
            min="0"
          />
        </div>
        <button type="submit" className="btn btn-success">
          ✅ Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
