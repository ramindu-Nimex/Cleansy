import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

// Usage: <Route element={<RoleRoute anyOf={["isAdmin","isVisitorAdmin"]} />}> ... </Route>
const RoleRoute = ({ anyOf = [] }) => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (!Array.isArray(anyOf) || anyOf.length === 0) {
    // If no roles provided, treat as authenticated-only
    return <Outlet />;
  }

  const allowed = anyOf.some((flag) => Boolean(currentUser?.[flag]));
  return allowed ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default RoleRoute;

