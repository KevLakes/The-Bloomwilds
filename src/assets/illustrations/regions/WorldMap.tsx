/**
 * The full Bloomwilds world — a wide paper-craft vista that sits behind the
 * overworld region islands. Pure decoration; doesn't react to bloom state
 * because the world itself is always "awake" — only the regions sleep/bloom.
 *
 * SVG fills its container via preserveAspectRatio="xMidYMid slice", so it
 * crops on narrow viewports rather than letterboxing.
 */
export function WorldMap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="bw-world-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-canvas-2)" />
          <stop offset="55%" stopColor="var(--color-canvas)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--color-accent) 14%, var(--color-canvas))" />
        </linearGradient>
        <radialGradient id="bw-world-sun" cx="0.15" cy="0.18" r="0.5">
          <stop offset="0%" stopColor="#FFE9A6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFE9A6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bw-world-glow" cx="0.85" cy="0.95" r="0.6">
          <stop offset="0%" stopColor="var(--color-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1200" height="700" fill="url(#bw-world-sky)" />
      {/* Soft sun glow upper-left */}
      <rect width="1200" height="700" fill="url(#bw-world-sun)" />
      {/* Distant warm glow bottom-right */}
      <rect width="1200" height="700" fill="url(#bw-world-glow)" />

      {/* The whole scene gets a paper-edge wobble */}
      <g filter="url(#bw-paper-edge)">
        {/* Far mountains — palest layer */}
        <path
          d="M0 320 L 80 240 L 180 280 L 280 220 L 380 270 L 480 230 L 600 260 L 740 220 L 880 280 L 1020 240 L 1120 270 L 1200 250 L 1200 360 L 0 360 Z"
          fill="#C9D5C0"
          opacity="0.55"
        />

        {/* Mid hills */}
        <path
          d="M0 410 Q 120 350 240 400 Q 360 450 480 380 Q 600 320 720 390 Q 840 460 960 400 Q 1080 350 1200 390 L 1200 480 L 0 480 Z"
          fill="#B5D5A5"
          opacity="0.75"
        />

        {/* Foreground rolling meadow */}
        <path
          d="M0 540 Q 180 480 380 530 Q 580 570 780 510 Q 980 460 1200 510 L 1200 700 L 0 700 Z"
          fill="#9CC97E"
        />

        {/* Lake/water inlet in the right-center */}
        <path
          d="M520 560 Q 620 540 740 555 Q 850 568 920 558 Q 980 552 1020 562 Q 1080 572 1100 590 Q 1100 612 1020 620 Q 920 628 800 622 Q 680 614 580 608 Q 500 600 510 580 Z"
          fill="#8DC9E5"
          opacity="0.78"
        />

        {/* Path: a winding paper-cut trail through the world connecting the 5 islands */}
        <g stroke="#F4E8D6" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 14" fill="none" opacity="0.85">
          <path d="M180 360 Q 320 420 480 360 Q 640 300 800 400 Q 920 460 1000 520" />
          <path d="M480 360 Q 460 420 420 480" />
          <path d="M800 400 Q 760 480 720 560" />
        </g>

        {/* Scattered decorative trees + flowers across the meadow */}
        <g opacity="0.85">
          {/* Little trees */}
          {[
            [60, 540],
            [220, 580],
            [880, 570],
            [1100, 540],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x="-3" y="-8" width="6" height="14" fill="#A57A4B" />
              <circle cx="0" cy="-12" r="14" fill="#7FB069" stroke="#2E3440" strokeWidth="2" />
            </g>
          ))}
          {/* Scattered flowers */}
          {[
            [120, 600, '#F4A6C0'],
            [340, 620, '#F9D77E'],
            [420, 580, '#F4A6C0'],
            [620, 640, '#C9A4D5'],
            [1040, 600, '#F9D77E'],
          ].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle cx="0" cy="0" r="5" fill={c as string} stroke="#2E3440" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2" fill="#F9D77E" />
            </g>
          ))}
        </g>

        {/* Drifting clouds — animated via CSS class */}
        <g opacity="0.9" className="animate-drift-x" style={{ transformOrigin: 'center' }}>
          <CloudShape x={120} y={80} size={140} />
          <CloudShape x={620} y={50} size={110} />
          <CloudShape x={960} y={110} size={130} />
          <CloudShape x={340} y={140} size={90} />
        </g>

        {/* A few high sparkles for atmosphere */}
        <g fill="var(--color-accent-3)" opacity="0.55">
          <circle cx="220" cy="200" r="3" />
          <circle cx="700" cy="170" r="2.5" />
          <circle cx="980" cy="220" r="3.5" />
          <circle cx="480" cy="180" r="2" />
        </g>
      </g>
    </svg>
  );
}

function CloudShape({ x, y, size }: { x: number; y: number; size: number }) {
  const s = size / 120;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M22 50c-9 0-16-6-16-15s7-15 16-15c2 0 4 .4 6 1 3-7 11-13 21-13 11 0 21 7 23 17 1 0 2-.1 3-.1 9 0 17 7 17 16s-8 15-17 15H22z"
        fill="white"
      />
      <path
        d="M26 50c-7 0-12-5-12-12s5-12 12-12c1 0 3 .2 4 .6 2-6 8-10 16-10 8 0 16 5 18 13 1 0 1-.1 2-.1 7 0 13 5 13 12s-6 12-13 12H26z"
        fill="rgba(255,255,255,0.6)"
      />
    </g>
  );
}

export default WorldMap;
