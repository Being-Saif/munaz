import api from './api.js';

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),

  // Admin
  getAllOrders: (params = {}) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default orderService;
