import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authMessage } from '../lib/errors.js';
import SetupNotice from '../components/SetupNotice.jsx';
import Gyuli from '../components/Gyuli.jsx';

export default function Login() {
  const { user, signIn, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/me';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await signIn(email.trim(), password);
    setBusy(false);
    if (err) setError(authMessage(err));
    else navigate(from, { replace: true });
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <Gyuli size={84} />
        <h1>로그인</h1>
        <p className="muted">다시 만나서 반가워요! 🍊</p>
        <SetupNotice />

        <label>이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
        </label>
        <label>비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" autoComplete="current-password" required />
        </label>

        {error && <p className="msg error" role="alert">{error}</p>}
        <button className="btn lg full" disabled={busy || !configured}>{busy ? '확인하는 중…' : '로그인'}</button>

        <div className="auth-links">
          <Link to="/forgot">비밀번호를 잊었어요</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </form>
    </div>
  );
}
