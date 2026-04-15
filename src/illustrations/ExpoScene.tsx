export default function ExpoScene() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 1200 580"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Atomic Expo pavilion"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="expoFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4920C" />
          <stop offset="100%" stopColor="#7A5006" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect x="0" y="0" width="1200" height="460" fill="#2A1F14" />
      <rect x="0" y="460" width="1200" height="120" fill="url(#expoFloor)" />
      {/* Pennants */}
      <g stroke="#D4920C" strokeWidth="2">
        <line x1="0" y1="30" x2="1200" y2="30" />
      </g>
      <g fill="#C42020">
        {Array.from({ length: 24 }).map((_, i) => (
          <polygon
            key={i}
            points={`${i * 50},30 ${i * 50 + 25},70 ${i * 50 + 50},30`}
            fill={i % 2 === 0 ? '#C42020' : '#D4920C'}
          />
        ))}
      </g>

      {/* Jetpack demo 3-19% × 10-75% */}
      <g>
        <rect x="36" y="80" width="192" height="330" fill="#1E7D91" stroke="#160E08" strokeWidth="4" />
        <circle cx="132" cy="170" r="40" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <rect x="100" y="210" width="64" height="90" fill="#D4920C" stroke="#160E08" strokeWidth="3" />
        <rect x="80" y="220" width="30" height="70" fill="#C42020" stroke="#160E08" strokeWidth="3" />
        <rect x="154" y="220" width="30" height="70" fill="#C42020" stroke="#160E08" strokeWidth="3" />
        <polygon points="95,290 85,330 105,330" fill="#D4920C" />
        <polygon points="169,290 159,330 179,330" fill="#D4920C" />
        <text x="132" y="390" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="16" fill="#F5EFDC">
          JETPACK DEMO
        </text>
      </g>

      {/* Robot butler 22-36% × 15-70% */}
      <g>
        <rect x="264" y="100" width="168" height="290" rx="10" fill="#C42020" stroke="#160E08" strokeWidth="4" />
        <circle cx="348" cy="150" r="36" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <circle cx="336" cy="146" r="5" fill="#160E08" />
        <circle cx="360" cy="146" r="5" fill="#160E08" />
        <rect x="316" y="200" width="64" height="120" fill="#D4920C" stroke="#160E08" strokeWidth="3" />
        <rect x="300" y="220" width="20" height="60" fill="#F5EFDC" />
        <rect x="376" y="220" width="20" height="60" fill="#F5EFDC" />
        <text x="348" y="370" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="14" fill="#F5EFDC">
          ROBOT BUTLER
        </text>
      </g>

      {/* Time capsule 42-56% × 30-75% */}
      <g>
        <rect x="504" y="170" width="168" height="240" rx="80" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <circle cx="588" cy="230" r="36" fill="#D4920C" stroke="#160E08" strokeWidth="3" />
        <text x="588" y="236" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="18" fill="#160E08">
          2050
        </text>
        <rect x="528" y="290" width="120" height="60" fill="#1E7D91" stroke="#160E08" strokeWidth="3" />
        <text x="588" y="330" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#F5EFDC">
          time capsule
        </text>
      </g>

      {/* Moon colony 60-78% × 10-65% */}
      <g>
        <rect x="720" y="60" width="216" height="320" fill="#160E08" stroke="#D4920C" strokeWidth="4" />
        <circle cx="828" cy="150" r="44" fill="#F5EFDC" />
        <circle cx="810" cy="140" r="5" fill="#2A1F14" />
        <circle cx="840" cy="158" r="4" fill="#2A1F14" />
        <circle cx="826" cy="160" r="3" fill="#2A1F14" />
        <g fill="#1E7D91" stroke="#160E08" strokeWidth="3">
          <ellipse cx="780" cy="260" rx="30" ry="18" />
          <ellipse cx="828" cy="290" rx="36" ry="20" />
          <ellipse cx="880" cy="260" rx="30" ry="18" />
        </g>
        <text x="828" y="360" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="16" fill="#D4920C">
          MOON COLONY α
        </text>
      </g>

      {/* Videophone 80-94% × 15-70% */}
      <g>
        <rect x="960" y="100" width="168" height="290" fill="#1E7D91" stroke="#160E08" strokeWidth="4" />
        <rect x="984" y="130" width="120" height="90" fill="#160E08" stroke="#D4920C" strokeWidth="3" />
        <circle cx="1044" cy="175" r="22" fill="#F5EFDC" />
        <circle cx="1038" cy="170" r="3" fill="#160E08" />
        <circle cx="1050" cy="170" r="3" fill="#160E08" />
        <rect x="984" y="240" width="120" height="110" fill="#D4920C" stroke="#160E08" strokeWidth="3" />
        <circle cx="1020" cy="280" r="10" fill="#F5EFDC" />
        <circle cx="1050" cy="280" r="10" fill="#F5EFDC" />
        <circle cx="1080" cy="280" r="10" fill="#F5EFDC" />
        <text x="1044" y="370" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="14" fill="#F5EFDC">
          VIDEOPHONE
        </text>
      </g>

      <text x="600" y="560" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#160E08">
        [atomic expo placeholder — swap with final illustration]
      </text>
    </svg>
  );
}
