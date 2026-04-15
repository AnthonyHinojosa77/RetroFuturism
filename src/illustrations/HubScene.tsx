export default function HubScene() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 1200 580"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Retro Universe Hub"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="hubSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160E08" />
          <stop offset="100%" stopColor="#2A1F14" />
        </linearGradient>
        <radialGradient id="hubSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4920C" />
          <stop offset="100%" stopColor="#C42020" />
        </radialGradient>
      </defs>

      {/* Sky / backdrop */}
      <rect x="0" y="0" width="1200" height="580" fill="url(#hubSky)" />

      {/* Sun / atomic emblem centered */}
      <circle cx="600" cy="140" r="80" fill="url(#hubSun)" />
      <g stroke="#D4920C" strokeWidth="3" opacity="0.6">
        <line x1="600" y1="20"  x2="600" y2="60" />
        <line x1="600" y1="220" x2="600" y2="260" />
        <line x1="480" y1="140" x2="520" y2="140" />
        <line x1="680" y1="140" x2="720" y2="140" />
      </g>

      {/* Banner */}
      <rect x="300" y="30" width="600" height="70" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
      <text x="600" y="78" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="42" fill="#160E08" letterSpacing="4">
        RETRO UNIVERSE
      </text>

      {/* Diner zone (left) */}
      <g>
        <rect x="60" y="230" width="260" height="290" fill="#C42020" stroke="#160E08" strokeWidth="4" />
        <rect x="80" y="260" width="220" height="80" fill="#F5EFDC" />
        <text x="190" y="305" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="26" fill="#160E08">
          ASTRO DINER
        </text>
        {/* chrome counter hint */}
        <rect x="80" y="440" width="220" height="40" fill="#F5EFDC" opacity="0.8" />
        <text x="190" y="500" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#F5EFDC">
          [diner facade placeholder]
        </text>
      </g>

      {/* Voyages zone (center) */}
      <g>
        <rect x="420" y="200" width="360" height="320" fill="#1E7D91" stroke="#160E08" strokeWidth="4" />
        <polygon points="420,200 600,130 780,200" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
        <rect x="440" y="240" width="320" height="70" fill="#F5EFDC" />
        <text x="600" y="285" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="26" fill="#160E08">
          COSMIC VOYAGES
        </text>
        <circle cx="600" cy="390" r="46" fill="#F5EFDC" />
        <text x="600" y="395" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="22" fill="#160E08">
          TERMINAL
        </text>
        <text x="600" y="500" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#F5EFDC">
          [spaceport facade placeholder]
        </text>
      </g>

      {/* Expo zone (right) */}
      <g>
        <rect x="880" y="230" width="260" height="290" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
        <rect x="900" y="260" width="220" height="80" fill="#F5EFDC" />
        <text x="1010" y="305" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="26" fill="#160E08">
          ATOMIC EXPO
        </text>
        <circle cx="1010" cy="440" r="30" fill="#C42020" stroke="#160E08" strokeWidth="3" />
        <text x="1010" y="500" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#160E08">
          [expo pavilion placeholder]
        </text>
      </g>

      {/* Ground band */}
      <rect x="0" y="520" width="1200" height="60" fill="#160E08" />
      <text x="600" y="560" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="18" fill="#D4920C" letterSpacing="3">
        WELCOME TO THE FUTURE OF YESTERDAY
      </text>
    </svg>
  );
}
