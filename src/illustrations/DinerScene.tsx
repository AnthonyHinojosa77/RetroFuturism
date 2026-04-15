export default function DinerScene() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 1200 580"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Astro Diner interior"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="dinerWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C42020" />
          <stop offset="100%" stopColor="#7A1010" />
        </linearGradient>
      </defs>

      {/* Walls */}
      <rect x="0" y="0" width="1200" height="460" fill="url(#dinerWall)" />
      {/* Checker floor */}
      <rect x="0" y="460" width="1200" height="120" fill="#F5EFDC" />
      <g fill="#160E08">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={i * 100} y={460 + (i % 2) * 60} width="100" height="60" />
        ))}
      </g>

      {/* Jukebox (left) — hotspot ~5-17% × 15-70% */}
      <g>
        <rect x="60" y="100" width="110" height="320" rx="18" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
        <rect x="75" y="130" width="80" height="80" rx="10" fill="#160E08" />
        <circle cx="115" cy="170" r="18" fill="#F5EFDC" />
        <rect x="80" y="230" width="70" height="30" fill="#F5EFDC" />
        <text x="115" y="390" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="14" fill="#160E08">
          JUKEBOX
        </text>
      </g>

      {/* Menu board (top center) — 30-55% × 5-35% */}
      <g>
        <rect x="360" y="30" width="300" height="160" fill="#160E08" stroke="#D4920C" strokeWidth="4" />
        <text x="510" y="70" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="26" fill="#D4920C">
          TODAY&apos;S SPECIALS
        </text>
        <text x="380" y="110" fontFamily="Permanent Marker" fontSize="16" fill="#F5EFDC">
          · NEBULA NOODLES
        </text>
        <text x="380" y="140" fontFamily="Permanent Marker" fontSize="16" fill="#F5EFDC">
          · METEOR MALT
        </text>
        <text x="380" y="170" fontFamily="Permanent Marker" fontSize="16" fill="#F5EFDC">
          · PLUTONIUM PUDDING
        </text>
      </g>

      {/* Servo (robot waiter) 44-58% × 20-70% */}
      <g>
        <rect x="528" y="120" width="160" height="290" rx="8" fill="#1E7D91" stroke="#160E08" strokeWidth="4" />
        <circle cx="608" cy="170" r="40" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <circle cx="595" cy="165" r="6" fill="#160E08" />
        <circle cx="621" cy="165" r="6" fill="#160E08" />
        <rect x="560" y="220" width="96" height="110" fill="#F5EFDC" />
        <text x="608" y="280" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="18" fill="#160E08">
          SERVO-3
        </text>
        <line x1="608" y1="100" x2="608" y2="120" stroke="#160E08" strokeWidth="4" />
        <circle cx="608" cy="98" r="6" fill="#D4920C" />
      </g>

      {/* Counter 20-60% × 60-80% */}
      <g>
        <rect x="240" y="350" width="480" height="110" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <rect x="240" y="350" width="480" height="20" fill="#D4920C" />
        <text x="480" y="420" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="22" fill="#160E08">
          CHROME COUNTER
        </text>
      </g>

      {/* Observation window 75-93% × 10-50% */}
      <g>
        <rect x="900" y="60" width="220" height="230" rx="110" fill="#160E08" stroke="#D4920C" strokeWidth="4" />
        <circle cx="970" cy="130" r="4" fill="#F5EFDC" />
        <circle cx="1060" cy="180" r="3" fill="#F5EFDC" />
        <circle cx="1010" cy="230" r="5" fill="#F5EFDC" />
        <circle cx="1000" cy="170" r="24" fill="#D4920C" />
        <text x="1010" y="305" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#F5EFDC">
          observation window
        </text>
      </g>

      {/* Placeholder label */}
      <text x="600" y="560" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#160E08">
        [astro diner placeholder — swap with final illustration]
      </text>
    </svg>
  );
}
