import { Link } from 'react-router-dom';

// 3D 시각화는 public/viz/visitors.html (three.js) 이며 iframe 으로 보여준다.
// 데이터는 /api/visitors (Vercel 서버리스 함수)가 공공데이터포털에서 가져와서, 인증키가 브라우저에 노출되지 않는다.
export default function Stats() {
  return (
    <div className="game-wrap">
      <div className="game-bar">
        <Link to="/" className="btn ghost sm">← 홈</Link>
        <strong>📊 서귀포 관광지 관람객 3D</strong>
        <a href="/viz/visitors.html" target="_blank" rel="noreferrer" className="btn ghost sm">새 창으로 열기 ↗</a>
      </div>
      <iframe title="서귀포 직영관광지 관람객 3D" src="/viz/visitors.html" className="game-frame" allow="fullscreen" />
    </div>
  );
}
