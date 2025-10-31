// server/routes/progressRoutes.js
import express from 'express';
import Progress from '../models/Progress.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// 📘 Get progress for a specific course
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.userId,
      course: req.params.courseId
    }).populate('course');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🎥 Update video progress for a specific course
router.post('/video/:courseId', authMiddleware, async (req, res) => {
  try {
    const { videoId, completed, timeWatched = 0 } = req.body;

    let progress = await Progress.findOne({
      user: req.user.userId,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Ensure these fields exist on the model dynamically
    if (!progress.videosCompleted) progress.videosCompleted = [];
    if (!progress.totalTimeSpent) progress.totalTimeSpent = 0;

    // Update or add current video progress
    progress.currentVideo = { videoId, timestamp: timeWatched };
    progress.lastAccessed = new Date();

    // Add to completed videos if newly completed
    if (completed) {
      const alreadyCompleted = progress.videosCompleted.some(v => v.videoId === videoId);
      if (!alreadyCompleted) {
        progress.videosCompleted.push({ videoId, timeWatched });
      }
    }

    // Update total time spent
    progress.totalTimeSpent += timeWatched;

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 📊 Get user's overall learning progress overview
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.userId })
      .populate('course', 'title category instructor')
      .sort({ lastAccessed: -1 });

    const stats = {
      totalCourses: progress.length,
      completedCourses: progress.filter(p => p.completed).length,
      inProgressCourses: progress.filter(p => !p.completed && p.progressPercentage > 0).length,
      totalTimeSpent: progress.reduce((total, p) => total + (p.totalTimeSpent || 0), 0),
      averageProgress:
        progress.length > 0
          ? progress.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / progress.length
          : 0
    };

    res.json({ progress, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
