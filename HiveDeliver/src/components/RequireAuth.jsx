import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RequireAuth({ allowedRoles, children } = {}) {
  const { user, defaultRoute } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={defaultRoute} replace />
  }

  if (children) {
    return children
  }

  return <Outlet />
}
