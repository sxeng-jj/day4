import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>제주 감귤이 월드</strong>
          <p>감귤이와 친구들이 사는 제주 IP 월드. 캐릭터를 만나고 게임을 즐겨요.</p>
        </div>
        <div className="foot-links">
          <Link to="/characters">캐릭터</Link>
          <Link to="/play">게임</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
      <p className="credit">
        사진: <a href="https://pixabay.com" target="_blank" rel="noreferrer">Pixabay</a> (Pixabay 콘텐츠 라이선스) · 인증: Supabase · 배포: Vercel
      </p>
    </footer>
  );
}
