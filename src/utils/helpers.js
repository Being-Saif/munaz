// ===== MUNAZ — General Helpers =====

/**
 * Delay execution (useful for testing loading states)
 * @param {number} ms - Milliseconds to wait
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get a random item from array
 * @param {Array} arr
 */
export const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Generate unique ID
 * @returns {string}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Scroll to top smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Get initials from name
 * @param {string} name
 * @returns {string} "SA" from "Shaik Ali"
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Deep clone an object (JSON safe)
 * @param {*} obj
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Check if current path matches nav link
 * @param {string} pathname - Current route
 * @param {string} href - Link href
 * @returns {boolean}
 */
export const isActiveRoute = (pathname, href) => {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
};
