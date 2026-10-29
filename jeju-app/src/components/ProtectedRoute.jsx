import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// 로그인한 회원만 볼 수 있는 페이지를 감싼다. (화면 접근 제어용 — 데이터 보호는 Supabase RLS 가 담당)
export default function ProtectedRoute({ children }) {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (loading) return <div className="center-note">확인하는 중…</div>;
  if (!configured || !user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
