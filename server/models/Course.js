import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor ID is required"],
    },
    category: {
      type: String,
      enum: [
        "AI",
        "Machine Learning",
        "Deep Learning",
        "Data Science",
        "Web Development",
        "Cybersecurity",
        "Cloud Computing",
        "Mobile Development",
        "Software Engineering",
        "Other",
      ],
      required: [true, "Course category is required"],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },
    videos: [
      {
        title: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        duration: { type: Number, default: 0 },
        description: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    materials: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        type: { type: String, trim: true },
      },
    ],
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, trim: true },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    enrolledStudents: [
      { type: Schema.Types.ObjectId, ref: "User" },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

//
// ✅ Automatically calculate average rating before saving
//
courseSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

//
// ✅ Helper: Enroll a student safely (no duplicates)
//
courseSchema.methods.enrollStudent = async function (studentId) {
  if (!this.enrolledStudents.some(id => id.toString() === studentId.toString())) {
    this.enrolledStudents.push(studentId);
    await this.save();
  }
};

//
// ✅ Export model (prevents recompilation errors in dev)
//
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
