export default function VoyagesScene() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 1200 580"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cosmic Voyages spaceport"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="portWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E7D91" />
          <stop offset="100%" stopColor="#0F3E48" />
        </linearGradient>
        <radialGradient id="launchSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5EFDC" />
          <stop offset="80%" stopColor="#D4920C" />
        </radialGradient>
      </defs>

      {/* Walls */}
      <rect x="0" y="0" width="1200" height="460" fill="url(#portWall)" />
      <rect x="0" y="460" width="1200" height="120" fill="#160E08" />

      {/* Travel posters (left) 2-22% × 5-75% */}
      <g>
        <rect x="30" y="40" width="220" height="400" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
        <rect x="50" y="60" width="80" height="110" fill="#C42020" stroke="#160E08" strokeWidth="3" />
        <text x="90" y="125" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="16" fill="#F5EFDC">
          MARS
        </text>
        <rect x="150" y="60" width="80" height="110" fill="#1E7D91" stroke="#160E08" strokeWidth="3" />
        <text x="190" y="125" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="16" fill="#F5EFDC">
          VENUS
        </text>
        <rect x="50" y="190" width="80" height="110" fill="#F5EFDC" stroke="#160E08" strokeWidth="3" />
        <text x="90" y="255" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="14" fill="#160E08">
          EUROPA
        </text>
        <rect x="150" y="190" width="80" height="110" fill="#C42020" stroke="#160E08" strokeWidth="3" />
        <text x="190" y="255" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="14" fill="#F5EFDC">
          TITAN
        </text>
        <text x="140" y="410" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="20" fill="#160E08">
          VISIT!
        </text>
      </g>

      {/* Captain Cosmo (center-left) 38-54% × 15-75% */}
      <g>
        <ellipse cx="540" cy="140" rx="60" ry="70" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <rect x="480" y="210" width="120" height="200" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
        <circle cx="540" cy="240" r="18" fill="#C42020" />
        <text x="540" y="246" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="16" fill="#F5EFDC">
          ✦
        </text>
        <text x="540" y="400" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="18" fill="#160E08">
          CAPT. COSMO
        </text>
      </g>

      {/* Ticket counter 30-58% × 55-85% */}
      <g>
        <rect x="360" y="320" width="340" height="160" fill="#F5EFDC" stroke="#160E08" strokeWidth="4" />
        <rect x="360" y="320" width="340" height="22" fill="#C42020" />
        <text x="530" y="385" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="24" fill="#160E08">
          TICKETS
        </text>
        <text x="530" y="415" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#160E08">
          postcards · boarding passes
        </text>
      </g>

      {/* Launch window 68-86% × 10-55% */}
      <g>
        <rect x="816" y="60" width="216" height="260" rx="10" fill="#160E08" stroke="#D4920C" strokeWidth="4" />
        <circle cx="924" cy="170" r="60" fill="url(#launchSun)" />
        <polygon points="924,110 934,150 974,150 944,172 954,212 924,190 894,212 904,172 874,150 914,150" fill="#F5EFDC" opacity="0.85" />
        <rect x="900" y="240" width="48" height="70" fill="#C42020" stroke="#160E08" strokeWidth="2" />
        <polygon points="900,240 924,210 948,240" fill="#D4920C" stroke="#160E08" strokeWidth="2" />
        <text x="924" y="340" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#F5EFDC">
          launch window
        </text>
      </g>

      {/* Brochure rack 86-98% × 20-70% */}
      <g>
        <rect x="1032" y="120" width="144" height="290" fill="#D4920C" stroke="#160E08" strokeWidth="4" />
        <g fill="#F5EFDC" stroke="#160E08" strokeWidth="2">
          <rect x="1048" y="140" width="50" height="80" />
          <rect x="1110" y="140" width="50" height="80" />
          <rect x="1048" y="240" width="50" height="80" />
          <rect x="1110" y="240" width="50" height="80" />
        </g>
        <text x="1104" y="400" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="14" fill="#160E08">
          BROCHURES
        </text>
      </g>

      <text x="600" y="560" textAnchor="middle" fontFamily="Permanent Marker" fontSize="14" fill="#D4920C">
        [cosmic voyages placeholder — swap with final illustration]
      </text>
    </svg>
  );
}
