import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import wishlistSlice from './slices/wishlistSlice';
import uiSlice from './slices/uiSlice';

// Persist config for cart (survives refresh)
const cartPersistConfig = {
  key: 'munaz-cart',
  storage,
  whitelist: ['items', 'totalItems', 'subtotal', 'total'],
};

// Persist config for auth
const authPersistConfig = {
  key: 'munaz-auth',
  storage,
  whitelist: ['user', 'accessToken', 'isAuthenticated'],
};

// Persist config for wishlist
const wishlistPersistConfig = {
  key: 'munaz-wishlist',
  storage,
  whitelist: ['items'],
};

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authSlice),
    cart: persistReducer(cartPersistConfig, cartSlice),
    wishlist: persistReducer(wishlistPersistConfig, wishlistSlice),
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
export default store;
