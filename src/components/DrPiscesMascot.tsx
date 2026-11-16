import React from 'react';

interface DrPiscesMascotProps {
  size?: number;
  className?: string;
  mood?: 'happy' | 'alert';
}

/**
 * Custom illustrated goldfish doctor mascot faithful to the user's sketch:
 * Standing upright on its curved tail fin, round friendly head, starry sparkle eyes,
 * warm smile, dorsal/pectoral fins, and holding a medical clipboard.
 */
export const DrPiscesMascot: React.FC<DrPiscesMascotProps> = ({
  size = 148,
  className = '',
  mood = 'happy',
}) => {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 180 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Dr. Pisces, your goldfish astronaut flight surgeon"
      className={`animate-pisces-float select-none ${className}`}
    >
      {/* Subtle aqua aura bubble */}
      <circle
        cx="84"
        cy="98"
        r="74"
        fill="url(#piscesGlow)"
        opacity="0.45"
      />

      {/* Dorsal / back wavy fins (left side matching sketch) */}
      <path
        d="M52 72 C24 64, 18 96, 36 108 C22 116, 26 144, 52 138 Z"
        fill="#FDBA74"
        stroke="#C2410C"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M48 88 C32 88, 30 104, 42 112"
        stroke="#EA580C"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Tail fin stand (bottom flared curved tail matching sketch) */}
      <path
        d="M78 142 C72 162, 54 180, 42 190 C60 186, 76 176, 86 168 C94 178, 108 190, 124 192 C116 176, 104 160, 98 140 Z"
        fill="#FB923C"
        stroke="#C2410C"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Main goldfish body & round head */}
      <path
        d="M84 22 C116 22, 134 44, 130 70 C127 88, 112 96, 106 112 C102 124, 102 138, 96 148 C88 156, 76 156, 68 146 C62 136, 58 116, 52 96 C44 68, 52 22, 84 22 Z"
        fill="url(#goldfishBody)"
        stroke="#C2410C"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />

      {/* Cute white doctor coat collar accent */}
      <path
        d="M64 98 C76 106, 98 106, 108 98 L104 134 C92 140, 76 140, 66 132 Z"
        fill="#F8FAFC"
        stroke="#0284C7"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Tiny blue medical cross on coat */}
      <path
        d="M82 112 V124 M76 118 H88"
        stroke="#0284C7"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Starry eyes matching sketch */}
      <g>
        {/* Left Star Eye */}
        <path
          d="M78 52 L80.5 58 L86.5 60 L80.5 62 L78 68 L75.5 62 L69.5 60 L75.5 58 Z"
          fill="#1E293B"
        />
        <circle cx="76" cy="57" r="1.6" fill="#FFFFFF" />
        {/* Right Star Eye */}
        <path
          d="M108 52 L110.5 58 L116.5 60 L110.5 62 L108 68 L105.5 62 L99.5 60 L105.5 58 Z"
          fill="#1E293B"
        />
        <circle cx="106" cy="57" r="1.6" fill="#FFFFFF" />
      </g>

      {/* Rosy pastel cheeks */}
      <ellipse cx="66" cy="69" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.7" />
      <ellipse cx="116" cy="69" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.7" />

      {/* Friendly smile (or concerned o-mouth on alert) */}
      {mood === 'alert' ? (
        <ellipse cx="93" cy="76" rx="5" ry="4" fill="#C2410C" />
      ) : (
        <path
          d="M83 74 C88 80, 98 80, 103 74"
          stroke="#7C2D12"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )}

      {/* Left fin holding medical clipboard */}
      <path
        d="M106 94 C118 92, 126 102, 120 112"
        stroke="#C2410C"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="#FDBA74"
      />

      {/* Medical Clipboard (tilted right, matching user's sketch) */}
      <g transform="translate(114, 92) rotate(12)">
        <rect
          x="0"
          y="4"
          width="34"
          height="42"
          rx="5"
          fill="#FEF3C7"
          stroke="#0369A1"
          strokeWidth="3"
        />
        {/* Clipboard metal clip at top */}
        <rect
          x="10"
          y="0"
          width="14"
          height="7"
          rx="2.5"
          fill="#38BDF8"
          stroke="#0369A1"
          strokeWidth="2.4"
        />
        {/* Chart lines on clipboard */}
        <line x1="7" y1="16" x2="27" y2="16" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="7" y1="24" x2="24" y2="24" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M7 34 L13 30 L18 36 L27 28"
          stroke="#EA580C"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Subtle floating water/space bubbles */}
      <circle cx="144" cy="48" r="4" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.8" />
      <circle cx="154" cy="34" r="2.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />

      <defs>
        <radialGradient id="piscesGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldfishBody" x1="65" y1="22" x2="115" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="52%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  );
};
