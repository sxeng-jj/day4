import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authMessage } from '../lib/errors.js';
import SetupNotice from '../components/SetupNotice.jsx';
import Gyuli from '../components/Gyuli.jsx';

export default function Signup() {
  const { user, signUp, configured } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false); // 이메일 인증이 켜져 있으면 안내 화면을 보여준다
  const [busy, setBusy] = useState(false);

  if (user && !sent) return <Navigate to="/me" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (nickname.trim().length < 2) return setError('닉네임은 2자 이상 입력해 주세요.');
    if (password.length < 6) return setError('비밀번호는 6자 이상이어야 해요.');
    if (password !== confirm) return setError('비밀번호 확인이 일치하지 않아요.');

    setBusy(true);
    const { data, error: err } = await signUp(email.trim(), password, nickname.trim());
    setBusy(false);
    if (err) return setError(authMessage(err));
    // 이미 가입된 이메일이면 Supabase 는 identities 가 빈 배열인 사용자를 돌려준다.
    if (data.user && data.user.identities && data.user.identities.length === 0) return setError('이미 가입된 이메일이에요. 로그인해 주세요.');
    if (data.session) navigate('/me', { replace: true }); // 이메일 인증이 꺼져 있으면 바로 로그인된다
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <Gyuli size={84} />
          <h1>메일을 보냈어요 💌</h1>
          <p className="muted"><b>{email}</b> 로 인증 메일을 보냈어요.<br />메일의 링크를 누르면 가입이 끝나요. (스팸함도 확인해 주세요)</p>
          <Link to="/login" className="btn lg full">로그인 화면으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <Gyuli size={84} />
        <h1>회원가입</h1>
        <p className="muted">감귤이 월드의 친구가 되어 주세요! 🍊</p>
        <SetupNotice />

        <label>닉네임
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="예: 폴짝이" maxLength={20} required />
        </label>
        <label>이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
        </label>
        <label>비밀번호 <small>(6자 이상)</small>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={6} required />
        </label>
        <label>비밀번호 확인
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
        </label>

        {error && <p className="msg error" role="alert">{error}</p>}
        <button className="btn lg full" disabled={busy || !configured}>{busy ? '가입하는 중…' : '가입하기'}</button>

        <div className="auth-links"><span>이미 회원이에요?</span><Link to="/login">로그인</Link></div>
      </form>
    </div>
  );
}
