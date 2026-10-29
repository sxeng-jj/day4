import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Gyuli from './Gyuli.jsx';

export default function Navbar() {
  const { user, nickname, signOut, configured } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  async function handleSignOut() {
    close();
    await signOut();
    navigate('/');
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <Gyuli size={38} />
          <span>제주 감귤이 월드</span>
        </Link>

        <button className="burger" aria-label="메뉴" onClick={() => setOpen((v) => !v)}>
          {open ? '✕' : '☰'}
        </button>

        <nav className={open ? 'links open' : 'links'}>
          <NavLink to="/characters" onClick={close}>캐릭터</NavLink>
          <NavLink to="/play" onClick={close}>게임</NavLink>
          <NavLink to="/shop" onClick={close}>상점</NavLink>
          {user && (
            <NavLink to="/cart" onClick={close} className="cartlink">
              🛒 장바구니{count > 0 && <b className="badge">{count}</b>}
            </NavLink>
          )}
          {user && <NavLink to="/me" onClick={close}>내 정보</NavLink>}
          <span className="spacer" />
          {user ? (
            <>
              <span className="hello">🍊 {nickname}님</span>
              <button className="btn ghost sm" onClick={handleSignOut}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn ghost sm" onClick={close}>로그인</Link>
              <Link to="/signup" className="btn sm" onClick={close}>회원가입</Link>
            </>
          )}
        </nav>
      </div>
      {!configured && (
        <div className="warn-bar">⚠️ Supabase 환경변수가 설정되지 않아 로그인/회원가입이 동작하지 않아요. README의 설정 절차를 따라 주세요.</div>
      )}
    </header>
  );
}
