import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
  isMobileMenuOpen: false,
  isMegaMenuOpen: false,
  isSearchOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },

    openMegaMenu: (state) => {
      state.isMegaMenuOpen = true;
    },
    closeMegaMenu: (state) => {
      state.isMegaMenuOpen = false;
    },

    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },

    openQuickView: (state, action) => {
      state.isQuickViewOpen = true;
      state.quickViewProduct = action.payload;
    },
    closeQuickView: (state) => {
      state.isQuickViewOpen = false;
      state.quickViewProduct = null;
    },

    closeAll: (state) => {
      state.isCartOpen = false;
      state.isMobileMenuOpen = false;
      state.isMegaMenuOpen = false;
      state.isSearchOpen = false;
      state.isQuickViewOpen = false;
      state.quickViewProduct = null;
    },
  },
});

export const {
  openCart, closeCart, toggleCart,
  openMobileMenu, closeMobileMenu,
  openMegaMenu, closeMegaMenu,
  openSearch, closeSearch,
  openQuickView, closeQuickView,
  closeAll,
} = uiSlice.actions;

// Selectors
export const selectIsCartOpen = (state) => state.ui.isCartOpen;
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen;
export const selectIsSearchOpen = (state) => state.ui.isSearchOpen;
export const selectQuickViewProduct = (state) => state.ui.quickViewProduct;

export default uiSlice.reducer;
