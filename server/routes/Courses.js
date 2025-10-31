import express from "express";
import Course from "../models/Course.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ GET /api/courses
 * Fetch all courses (students see published; instructors/admins see all)
 */
router.get("/", async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;

    const filter = {};

    // 👇 Only show published courses to public (no auth or student role)
    if (!req.user || req.user.role === "student") {
      filter.isPublished = true;
    }

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { tags: { $in: [regex] } },
      ];
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * Number(limit));

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      courses,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * ✅ GET /api/courses/instructor
 * Fetch all courses created by the logged-in instructor
 */
router.get("/instructor", authMiddleware, async (req, res) => {
  try {
    if (!["instructor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Instructors or Admins only." });
    }

    const instructorCourses = await Course.find({ instructor: req.user.userId })
      .populate("enrolledStudents", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses: instructorCourses });
  } catch (error) {
    console.error("❌ Error fetching instructor courses:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * ✅ GET /api/courses/:id
 * Fetch a single course by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("ratings.user", "name");

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Restrict unpublished course access to public
    if (!course.isPublished && (!req.user || req.user.role === "student")) {
      return res.status(403).json({ message: "Course not available" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * ✅ POST /api/courses
 * Create a new course (Instructor/Admin only)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (!["instructor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Instructors or Admins only." });
    }

    const { title, description, category, price, difficulty } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      difficulty,
      price,
      instructor: req.user.userId,
      isPublished: true, // ✅ Default to published
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({
      message: "✅ Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * ✅ PUT /api/courses/:id
 * Update a course (Instructor/Admin only)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You cannot edit this course." });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * ✅ POST /api/courses/:id/rating
 * Add or update a rating for a course
 */
router.post("/:id/rating", authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existingRating = course.ratings.find(
      (r) => r.user.toString() === req.user.userId
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review || existingRating.review;
    } else {
      course.ratings.push({ user: req.user.userId, rating, review });
    }

    await course.save();

    res.status(200).json({ message: "Rating added successfully", ratings: course.ratings });
  } catch (error) {
    console.error("❌ Error adding rating:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
