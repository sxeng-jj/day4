import { useState } from 'react';
import Gyuli from '../components/Gyuli.jsx';
import { CHARACTERS } from '../data.js';

export default function Characters() {
  const [sel, setSel] = useState(CHARACTERS[0].id);
  const cur = CHARACTERS.find((c) => c.id === sel);

  return (
    <div className="section narrow">
      <h1 className="title">제주 친구들</h1>
      <p className="lead">감귤이와 함께 제주를 지키고 즐기는 친구들을 소개해요.</p>

      <div className="char-stage" style={{ '--c': cur.color }}>
        <div className="char-big">{cur.emoji ? <span>{cur.emoji}</span> : <Gyuli size={170} />}</div>
        <div className="char-info">
          <em>{cur.role}</em>
          <h2>{cur.name}</h2>
          <p>{cur.desc}</p>
          <div className="chips">{cur.skills.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
      </div>

      <div className="char-list">
        {CHARACTERS.map((c) => (
          <button key={c.id} className={c.id === sel ? 'char-tab on' : 'char-tab'} style={{ '--c': c.color }} onClick={() => setSel(c.id)}>
            <span className="ci">{c.emoji ? c.emoji : <Gyuli size={44} />}</span>
            <b>{c.name}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
