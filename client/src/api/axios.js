import axios from "axios";

// Create axios instance with a base URL (change if deployed)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // ✅ include /api here ONCE
  withCredentials: true, // useful if backend uses cookies or sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach Authorization token to every request (if exists)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired / invalid token globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired or unauthorized. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("🚫 Forbidden: You don’t have permission to perform this action.");
    }

    return Promise.reject(error);
  }
);

export default API;
