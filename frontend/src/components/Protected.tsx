import { Navigate } from 'react-router-dom'
import { useAuth } from '../store'

export default function Protected({ children }: { children: JSX.Element }) {
  const { access } = useAuth()
  if (!access) return <Navigate to="/login" replace />
  return children
}
