import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { adminGirisi } = useAuth();

  if (!adminGirisi) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
