import api from './api.js';

export const bannerService = {
  // Public - get active banners
  getBanners: (position) => api.get('/banners', { params: position ? { position } : {} }),

  // Admin
  getAllBanners: () => api.get('/banners/admin/all'),
  createBanner: (data) => api.post('/banners', data),
  updateBanner: (id, data) => api.put(`/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/banners/${id}`),
  toggleBanner: (id) => api.put(`/banners/${id}/toggle`),
};

export const occasionService = {
  // Public
  getOccasions: () => api.get('/occasions'),

  // Admin
  getAllOccasions: () => api.get('/occasions/admin/all'),
  createOccasion: (data) => api.post('/occasions', data),
  updateOccasion: (id, data) => api.put(`/occasions/${id}`, data),
  deleteOccasion: (id) => api.delete(`/occasions/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),

  // Admin
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default { bannerService, occasionService, categoryService };
