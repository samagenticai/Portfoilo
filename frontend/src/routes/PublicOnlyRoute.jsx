import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Redirect authenticated admins away from /login */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}
