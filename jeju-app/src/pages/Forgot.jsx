import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authMessage } from '../lib/errors.js';
import SetupNotice from '../components/SetupNotice.jsx';
import Gyuli from '../components/Gyuli.jsx';

export default function Forgot() {
  const { sendReset, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await sendReset(email.trim());
    setBusy(false);
    if (err) setError(authMessage(err));
    else setDone(true);
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <Gyuli size={84} />
        <h1>비밀번호 찾기</h1>
        <SetupNotice />
        {done ? (
          <p className="msg ok">가입한 이메일이 맞다면 재설정 링크를 보냈어요. 메일함을 확인해 주세요. 💌</p>
        ) : (
          <>
            <p className="muted">가입한 이메일을 적으면 비밀번호를 다시 정하는 링크를 보내드려요.</p>
            <label>이메일
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            {error && <p className="msg error" role="alert">{error}</p>}
            <button className="btn lg full" disabled={busy || !configured}>{busy ? '보내는 중…' : '재설정 메일 받기'}</button>
          </>
        )}
        <div className="auth-links"><Link to="/login">← 로그인으로</Link></div>
      </form>
    </div>
  );
}
