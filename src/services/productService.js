import api from './api.js';

export const productService = {
  // Get all products with filters
  getProducts: (params = {}) => api.get('/products', { params }),

  // Get single product by slug
  getProductBySlug: (slug) => api.get(`/products/${slug}`),

  // Get featured/trending/new arrivals
  getFeatured: (type = 'featured', limit = 10) =>
    api.get('/products/featured', { params: { type, limit } }),

  // Admin: Create product
  createProduct: (data) => api.post('/products', data),

  // Admin: Update product
  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  // Admin: Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;
