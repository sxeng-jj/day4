import { Link } from 'react-router-dom';

// 제주 3D 탐험은 public/viz/explore.html (three.js) 이며 iframe 으로 보여준다.
export default function Explore() {
  return (
    <div className="game-wrap">
      <div className="game-bar">
        <Link to="/" className="btn ghost sm">← 홈</Link>
        <strong>🏝️ 제주 3D 탐험</strong>
        <a href="/viz/explore.html" target="_blank" rel="noreferrer" className="btn ghost sm">새 창으로 열기 ↗</a>
      </div>
      <iframe title="제주 3D 탐험" src="/viz/explore.html" className="game-frame" allow="fullscreen" />
    </div>
  );
}
