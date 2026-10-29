import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authMessage } from '../lib/errors.js';
import Gyuli from '../components/Gyuli.jsx';

// 재설정 메일의 링크를 누르면 Supabase 가 임시 세션을 만들어 이 페이지로 보낸다.
export default function Reset() {
  const { user, loading, updatePassword, signOut } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="center-note">확인하는 중…</div>;

  if (!user) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <Gyuli size={84} />
          <h1>링크가 만료됐어요</h1>
          <p className="muted">재설정 링크가 없거나 이미 사용됐어요. 다시 메일을 받아 주세요.</p>
          <Link to="/forgot" className="btn lg full">재설정 메일 다시 받기</Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('비밀번호는 6자 이상이어야 해요.');
    if (password !== confirm) return setError('비밀번호 확인이 일치하지 않아요.');
    setBusy(true);
    const { error: err } = await updatePassword(password);
    setBusy(false);
    if (err) return setError(authMessage(err));
    setDone(true);
    await signOut();
    setTimeout(() => navigate('/login'), 1500);
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <Gyuli size={84} />
        <h1>새 비밀번호 정하기</h1>
        {done ? (
          <p className="msg ok">비밀번호를 바꿨어요! 잠시 뒤 로그인 화면으로 이동해요.</p>
        ) : (
          <>
            <label>새 비밀번호 <small>(6자 이상)</small>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={6} required />
            </label>
            <label>새 비밀번호 확인
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </label>
            {error && <p className="msg error" role="alert">{error}</p>}
            <button className="btn lg full" disabled={busy}>{busy ? '저장하는 중…' : '비밀번호 바꾸기'}</button>
          </>
        )}
      </form>
    </div>
  );
}
