// server/models/Progress.js
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    completedLessons: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson'
        },
        completedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Automatically update `lastAccessed` every time a progress document is updated
progressSchema.pre('save', function (next) {
  this.lastAccessed = new Date();
  next();
});

// Optional helper: update progress percentage
progressSchema.methods.updateProgress = function (completedCount, totalLessons) {
  if (totalLessons > 0) {
    this.progressPercentage = Math.min(100, (completedCount / totalLessons) * 100);
    this.completed = this.progressPercentage === 100;
  }
  return this.save();
};

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
