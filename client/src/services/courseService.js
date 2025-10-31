import API from "../api/axios";

export const courseService = {
  getCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });
      const response = await API.get(`/courses?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error.response?.data || error;
    }
  },

  getCourse: async (id) => {
    try {
      const response = await API.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error.response?.data || error;
    }
  },

  getInstructorCourses: async () => {
    try {
      const response = await API.get(`/courses/instructor`);
      return response.data;
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      throw error.response?.data || error;
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await API.post(`/courses`, courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error.response?.data || error;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const response = await API.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error.response?.data || error;
    }
  },

  deleteCourse: async (id) => {
    try {
      const response = await API.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error.response?.data || error;
    }
  },

  enrollInCourse: async (courseId) => {
    try {
      const response = await API.post(`/users/enroll/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error.response?.data || error;
    }
  },

  getEnrolledCourses: async () => {
    try {
      const response = await API.get(`/users/courses`);
      return response.data;
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      throw error.response?.data || error;
    }
  },

  addRating: async (courseId, ratingData) => {
    try {
      const response = await API.post(`/courses/${courseId}/rating`, ratingData);
      return response.data;
    } catch (error) {
      console.error("Error adding rating:", error);
      throw error.response?.data || error;
    }
  },
};
