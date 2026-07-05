import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  coupon: null,
  loading: false,
};

const calculateTotals = (state) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  state.shipping = state.subtotal > 500 ? 0 : 10;
  state.total = state.subtotal + state.shipping - state.discount;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, image, price, color, size, quantity = 1 } = action.payload;

      const existingItem = state.items.find(
        (item) => item.productId === productId && item.color === color && item.size === size
      );

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + quantity, 10);
      } else {
        state.items.push({
          id: `${productId}_${color}_${size}_${Date.now()}`,
          productId,
          name,
          image,
          price,
          color,
          size,
          quantity,
          addedAt: new Date().toISOString(),
        });
      }

      calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, 10));
      }
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
      calculateTotals(state);
    },

    applyCoupon: (state, action) => {
      const { code, type, value } = action.payload;
      state.coupon = { code, type, value };
      if (type === 'percentage') {
        state.discount = Math.round((state.subtotal * value) / 100);
      } else {
        state.discount = value;
      }
      state.total = state.subtotal + state.shipping - state.discount;
    },

    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.total = state.subtotal + state.shipping;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubtotal = (state) => state.cart.subtotal;

export default cartSlice.reducer;
