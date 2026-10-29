import { Link, useParams } from 'react-router-dom';
import { GAMES } from '../data.js';

// 게임은 public/games 의 독립 HTML(three.js) 이며 iframe 으로 보여준다.
export default function Game() {
  const { id } = useParams();
  const game = GAMES.find((g) => g.id === id);

  if (!game) {
    return (
      <div className="center-note">
        <p>없는 게임이에요.</p>
        <Link to="/play" className="btn">게임 목록으로</Link>
      </div>
    );
  }

  return (
    <div className="game-wrap">
      <div className="game-bar">
        <Link to="/play" className="btn ghost sm">← 게임 목록</Link>
        <strong>{game.emoji} {game.title}</strong>
        <a href={game.file} target="_blank" rel="noreferrer" className="btn ghost sm">새 창으로 열기 ↗</a>
      </div>
      <iframe key={game.id} title={game.title} src={game.file} className="game-frame" allow="autoplay; fullscreen" />
    </div>
  );
}
