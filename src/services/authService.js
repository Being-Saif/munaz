import api from './api.js';

// ===== MUNAZ — Auth Service =====
// Uses real API when backend is available, falls back to localStorage for demo

const USE_API = Boolean(import.meta.env.VITE_API_URL);

// ========== API-based auth ==========
const apiAuth = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.token) localStorage.setItem('munaz_token', res.token);
    return res;
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.token) localStorage.setItem('munaz_token', res.token);
    return res;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('munaz_token');
  },
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
  updateProfile: (data) => api.put('/users/profile', data),
};

// ========== localStorage-based auth (demo/fallback) ==========
const USERS_KEY = 'munaz_users';
const DEFAULT_USERS = [
  {
    id: 'user_001',
    name: 'Saif Ali',
    firstName: 'Saif',
    lastName: 'Ali',
    email: 'saif',
    password: '123456',
    avatar: null,
    role: 'customer',
    createdAt: '2026-07-01T00:00:00Z',
  },
];

const initUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

const getUsers = () => {
  initUsers();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

const localAuth = {
  login: (email, password) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );
    if (!user) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser, token: 'demo_token' };
  },
  register: ({ name, firstName, lastName, email, password }) => {
    const users = getUsers();
    if (users.find((u) => u.email === email.toLowerCase().trim())) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: name || `${firstName} ${lastName}`,
      firstName: firstName || name?.split(' ')[0],
      lastName: lastName || name?.split(' ')[1] || '',
      email: email.toLowerCase().trim(),
      password,
      avatar: null,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser, token: 'demo_token' };
  },
  logout: () => {
    localStorage.removeItem('munaz_token');
  },
};

// ========== Exported unified API ==========
export const loginUser = async (email, password) => {
  if (USE_API) {
    try {
      return await apiAuth.login(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return localAuth.login(email, password);
};

export const signupUser = async (data) => {
  if (USE_API) {
    try {
      return await apiAuth.register(data);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return localAuth.register(data);
};

export const logoutUser = async () => {
  if (USE_API) {
    try {
      await apiAuth.logout();
    } catch {
      // Ignore error on logout
    }
  }
  localAuth.logout();
};

export const getCurrentUser = async () => {
  if (USE_API) {
    try {
      return await apiAuth.getMe();
    } catch {
      return null;
    }
  }
  return null;
};

export const initAuth = () => {
  initUsers();
};

export default { loginUser, signupUser, logoutUser, getCurrentUser, initAuth };
