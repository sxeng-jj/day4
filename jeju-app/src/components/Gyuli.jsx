// 마스코트 감귤이 (SVG)
export default function Gyuli({ size = 120, className = '' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label="감귤이">
      <defs>
        <radialGradient id="gyuli-g" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff7a1a" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(0,0,0,.12)" />
      <circle cx="60" cy="68" r="46" fill="url(#gyuli-g)" />
      <path d="M62 26c10-12 26-12 34-6-8 12-24 14-34 6z" fill="#3cb043" />
      <rect x="58" y="18" width="5" height="14" rx="2" fill="#6b4a2f" />
      <circle cx="44" cy="66" r="8" fill="#fff" />
      <circle cx="76" cy="66" r="8" fill="#fff" />
      <circle cx="46" cy="67" r="4.5" fill="#2b1a10" />
      <circle cx="78" cy="67" r="4.5" fill="#2b1a10" />
      <circle cx="47.5" cy="65" r="1.5" fill="#fff" />
      <circle cx="79.5" cy="65" r="1.5" fill="#fff" />
      <ellipse cx="32" cy="80" rx="7" ry="4.5" fill="#ff7a9a" opacity=".75" />
      <ellipse cx="88" cy="80" rx="7" ry="4.5" fill="#ff7a9a" opacity=".75" />
      <path d="M48 84q12 11 24 0" stroke="#7a2a10" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
