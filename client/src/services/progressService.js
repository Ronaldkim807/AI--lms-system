import API from '../api/axios';

export const progressService = {
  getCourseProgress: async (courseId) => {
    const response = await API.get(`/progress/course/${courseId}`);
    return response.data;
  },

  updateVideoProgress: async (courseId, videoData) => {
    const response = await API.post(`/progress/video/${courseId}`, videoData);
    return response.data;
  },

  getProgressOverview: async () => {
    const response = await API.get('/progress/overview');
    return response.data;
  }
};