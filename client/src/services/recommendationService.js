import API from './authService'; // ✅ this uses the exported Axios instance

const AI_SERVICE_URL = 'http://localhost:8000';

export const recommendationService = {
  // Get AI recommendations from FastAPI
  getRecommendations: async (userData) => {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      return response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      // Return mock data if AI service is unavailable
      return getMockRecommendations(userData);
    }
  },

  // Get popular courses (fallback)
  getPopularCourses: async () => {
    try {
      const response = await API.get('/courses?sort=popular&limit=6');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular courses:', error);
      return [];
    }
  },

  // Get courses based on user interests
  getInterestBasedCourses: async (interests) => {
    try {
      const response = await API.get(`/courses?tags=${interests.join(',')}&limit=6`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interest-based courses:', error);
      return [];
    }
  },
};

// Mock fallback recommendations if AI is offline
const getMockRecommendations = (userData) => {
  const mockCourses = [
    {
      id: '1',
      title: 'Python Programming Fundamentals',
      description: 'Learn Python from scratch with hands-on projects',
      category: 'programming',
      difficulty: 'beginner',
      averageRating: 4.5,
      enrolledStudents: 1500,
      similarity_score: 0.95,
      reason: 'Matches your interest in programming',
    },
    {
      id: '2',
      title: 'Machine Learning Basics',
      description: 'Introduction to machine learning concepts and algorithms',
      category: 'programming',
      difficulty: 'intermediate',
      averageRating: 4.7,
      enrolledStudents: 890,
      similarity_score: 0.88,
      reason: 'Based on your learning history',
    },
    {
      id: '3',
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development with modern technologies',
      category: 'programming',
      difficulty: 'beginner',
      averageRating: 4.6,
      enrolledStudents: 2300,
      similarity_score: 0.82,
      reason: 'Popular among students with similar interests',
    },
  ];

  return {
    recommendations: mockCourses,
    user_id: userData.user_id,
  };
};
