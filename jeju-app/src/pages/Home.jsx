import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Gyuli from '../components/Gyuli.jsx';
import { PHOTOS, CHARACTERS, GAMES } from '../data.js';

export default function Home() {
  const { user, nickname } = useAuth();

  return (
    <>
      <section className="hero" style={{ backgroundImage: 'linear-gradient(180deg, rgba(20,30,50,.15), rgba(20,30,50,.55)), url(/images/jeju-hero.jpg)' }}>
        <div className="hero-inner">
          <Gyuli size={150} className="hero-gyuli" />
          <p className="eyebrow">JEJU IP WORLD</p>
          <h1>감귤이와 떠나는<br />제주 모험</h1>
          <p className="sub">돌담 너머 푸른 바다, 폴짝폴짝 뛰어다니는 감귤이와 친구들을 만나 보세요.</p>
          <div className="cta">
            {user ? (
              <>
                <Link to="/play" className="btn lg">🎮 {nickname}님, 게임 하러 가기</Link>
                <Link to="/characters" className="btn ghost-light lg">캐릭터 보기</Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn lg">🍊 무료로 시작하기</Link>
                <Link to="/characters" className="btn ghost-light lg">캐릭터 보기</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="title">제주 IP 월드에서 할 수 있어요</h2>
        <div className="grid3">
          <div className="feature">
            <span className="ficon">🧑‍🎤</span>
            <h3>캐릭터 만나기</h3>
            <p>감귤이, 돌하르방, 숨비 등 제주를 닮은 {CHARACTERS.length}명의 친구들을 소개해요.</p>
            <Link to="/characters">친구들 보러 가기 →</Link>
          </div>
          <div className="feature">
            <span className="ficon">🎮</span>
            <h3>회원 전용 게임</h3>
            <p>폴짝 액션, 2인 레이싱, 3D 제주 섬까지 {GAMES.length}가지를 즐겨요. 로그인하면 바로 플레이!</p>
            <Link to="/play">게임 목록 보기 →</Link>
          </div>
          <div className="feature">
            <span className="ficon">🔐</span>
            <h3>내 계정</h3>
            <p>이메일로 가입하고 닉네임을 정해요. 비밀번호를 잊어도 메일로 다시 설정할 수 있어요.</p>
            <Link to={user ? '/me' : '/signup'}>{user ? '내 정보 보기 →' : '가입하기 →'}</Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <h2 className="title">제주의 풍경</h2>
        <p className="lead">감귤이가 사는 제주의 모습이에요.</p>
        <div className="gallery">
          {PHOTOS.map((p, i) => (
            <figure key={p.src} className={i === 0 || i === 5 ? 'wide' : ''}>
              <img src={p.src} alt={p.title} loading="lazy" />
              <figcaption>{p.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="title">오늘의 게임</h2>
        <div className="grid3">
          {GAMES.slice(1, 4).map((g) => (
            <Link key={g.id} to={`/play/${g.id}`} className="gcard">
              <div className="gimg" style={{ backgroundImage: g.img ? `url(${g.img})` : g.bg }}><span>{g.emoji}</span></div>
              <div className="gbody"><em>{g.tag}</em><h3>{g.title}</h3><p>{g.desc}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
