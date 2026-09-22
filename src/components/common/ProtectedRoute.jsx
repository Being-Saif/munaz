import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '@redux/slices/authSlice';

/**
 * ProtectedRoute - Guards routes based on auth and optional role
 * @param {React.ReactNode} children - The component to render
 * @param {string} [role] - Optional role required (e.g. 'admin')
 */
const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role required but user doesn't have it → go to home.
  // A superadmin satisfies any 'admin' requirement.
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const allowed = roles.some((r) => user?.role === r) ||
      (roles.includes('admin') && user?.role === 'superadmin');
    if (!allowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
