import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of product IDs
  loading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);

      if (index > -1) {
        // Remove from wishlist
        state.items.splice(index, 1);
      } else {
        // Add to wishlist
        state.items.push(productId);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((id) => id !== action.payload);
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsWishlisted = (productId) => (state) => state.wishlist.items.includes(productId);

export default wishlistSlice.reducer;
