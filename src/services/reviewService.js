import api from './api.js';

export const reviewService = {
  getProductReviews: (productId, params = {}) =>
    api.get(`/reviews/${productId}`, { params }),
  createReview: (productId, data) => api.post(`/reviews/${productId}`, data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
