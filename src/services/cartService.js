import api from './api.js';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1, color, size) =>
    api.post('/cart', { productId, quantity, color, size }),
  updateItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export default cartService;
