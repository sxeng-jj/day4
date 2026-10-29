import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authMessage } from '../lib/errors.js';
import Gyuli from '../components/Gyuli.jsx';

const fmt = (iso) => (iso ? new Date(iso).toLocaleString('ko-KR') : '-');

export default function Profile() {
  const { user, nickname, updateNickname, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(nickname);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  async function save(e) {
    e.preventDefault();
    if (name.trim().length < 2) return setMsg({ type: 'error', text: '닉네임은 2자 이상 입력해 주세요.' });
    setBusy(true);
    const { error } = await updateNickname(name.trim());
    setBusy(false);
    setMsg(error ? { type: 'error', text: authMessage(error) } : { type: 'ok', text: '닉네임을 저장했어요! ✨' });
  }

  async function logout() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="section narrow">
      <h1 className="title">내 정보</h1>
      <div className="profile">
        <div className="profile-head">
          <Gyuli size={96} />
          <div>
            <h2>{nickname}님</h2>
            <p className="muted">{user.email}</p>
          </div>
        </div>

        <dl className="facts">
          <div><dt>가입일</dt><dd>{fmt(user.created_at)}</dd></div>
          <div><dt>마지막 로그인</dt><dd>{fmt(user.last_sign_in_at)}</dd></div>
          <div><dt>이메일 인증</dt><dd>{user.email_confirmed_at ? '완료 ✅' : '대기 중'}</dd></div>
        </dl>

        <form onSubmit={save} className="inline-form">
          <label>닉네임 바꾸기
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />
          </label>
          <button className="btn" disabled={busy}>{busy ? '저장 중…' : '저장'}</button>
        </form>
        {msg.text && <p className={`msg ${msg.type}`}>{msg.text}</p>}

        <div className="profile-actions">
          <Link to="/play" className="btn lg">🎮 게임 하러 가기</Link>
          <button className="btn ghost lg" onClick={logout}>로그아웃</button>
        </div>
      </div>
    </div>
  );
}
