// ===== MUNAZ — Auth Service (localStorage-based for demo) =====

const USERS_KEY = 'munaz_users';

// Default demo user
const DEFAULT_USERS = [
  {
    id: 'user_001',
    firstName: 'Saif',
    lastName: 'Ali',
    email: 'saif',
    password: '123456',
    avatar: null,
    role: 'customer',
    createdAt: '2026-07-01T00:00:00Z',
  },
];

// Initialize users in localStorage if not present
const initUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

// Get all users
const getUsers = () => {
  initUsers();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

/**
 * Login - check email/username + password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(
    (u) => (u.email === email.toLowerCase().trim()) && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Return user without password
  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
};

/**
 * Signup - create new user
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const signupUser = ({ firstName, lastName, email, password }) => {
  const users = getUsers();

  // Check if email already exists
  if (users.find((u) => u.email === email.toLowerCase().trim())) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const newUser = {
    id: `user_${Date.now()}`,
    firstName,
    lastName,
    email: email.toLowerCase().trim(),
    password,
    avatar: null,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
};

/**
 * Initialize - make sure demo user exists
 */
export const initAuth = () => {
  initUsers();
};
