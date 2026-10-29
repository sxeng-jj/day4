import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GAMES } from '../data.js';

export default function Play() {
  const { user } = useAuth();

  return (
    <div className="section narrow">
      <h1 className="title">게임 센터</h1>
      <p className="lead">
        {user ? '원하는 게임을 골라 바로 시작해 보세요!' : '게임은 회원 전용이에요. 로그인하면 바로 플레이할 수 있어요.'}
      </p>
      {!user && (
        <div className="login-cta">
          <Link to="/login" state={{ from: '/play' }} className="btn">로그인</Link>
          <Link to="/signup" className="btn ghost">회원가입</Link>
        </div>
      )}
      <div className="grid3">
        {GAMES.map((g) => (
          <Link key={g.id} to={`/play/${g.id}`} className="gcard">
            <div className="gimg" style={{ backgroundImage: g.img ? `url(${g.img})` : g.bg }}>
              <span>{g.emoji}</span>
              {!user && <i className="lock">🔒 회원 전용</i>}
            </div>
            <div className="gbody"><em>{g.tag}</em><h3>{g.title}</h3><p>{g.desc}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
