import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ GET /api/users/profile
 * Fetch logged-in user's profile (with enrolled courses)
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("enrolledCourses.course");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ PUT /api/users/profile
 * Update user profile (name, interests)
 */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, interests } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, interests },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ POST /api/users/enroll/:courseId
 * Enroll user into a course
 */
router.post("/enroll/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.course.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Add to enrolled courses
    user.enrolledCourses.push({ course: courseId });
    await user.save();

    // Create progress tracking
    const progress = new Progress({
      user: userId,
      course: courseId,
    });
    await progress.save();

    // Add to course's enrolled students
    course.enrolledStudents.push(userId);
    await course.save();

    res.json({ message: "✅ Successfully enrolled in course" });
  } catch (error) {
    console.error("❌ Error enrolling in course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ GET /api/users/courses
 * Returns courses based on user role:
 * - Instructor/Admin → createdCourses + enrolledCourses
 * - Student → enrolledCourses only
 */
router.get("/courses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let createdCourses = [];
    let enrolledCourses = [];

    // 🧑‍🏫 If Instructor/Admin → fetch created and enrolled
    if (["instructor", "admin"].includes(userRole)) {
      createdCourses = await Course.find({ instructor: userId })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

      enrolledCourses = await Course.find({ enrolledStudents: userId })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });
    }

    // 👩‍🎓 If Student → fetch only enrolled
    if (userRole === "student") {
      enrolledCourses = await Course.find({ enrolledStudents: userId })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      role: userRole,
      createdCourses,
      enrolledCourses,
    });
  } catch (error) {
    console.error("❌ Error fetching user courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
