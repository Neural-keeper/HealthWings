import React from 'react';

interface DrPiscesMascotProps {
  size?: number;
  className?: string;
  mood?: 'happy' | 'alert';
}

/**
 * Cute goldfish doctor mascot (Dr. Pisces) with prominent goldfish fins:
 * scalloped top dorsal fin, wide fanned pectoral fins, lush forked tail fin,
 * starry sparkle eyes, warm smile, and medical clipboard.
 */
export const DrPiscesMascot: React.FC<DrPiscesMascotProps> = ({
  size = 148,
  className = '',
  mood = 'happy',
}) => {
  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Dr. Pisces, your goldfish health buddy"
      className={`animate-pisces-float select-none ${className}`}
    >
      {/* Subtle aqua aura */}
      <circle cx="96" cy="108" r="82" fill="url(#piscesGlow)" opacity="0.45" />

      {/* Top Dorsal Fin (classic flowing scalloped goldfish crest) */}
      <path
        d="M84 36 C74 12, 52 14, 42 32 C34 46, 46 66, 62 72 Z"
        fill="url(#finPeach)"
        stroke="#C2410C"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M74 44 L54 28 M70 54 L46 44 M68 64 L48 58" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Back / Left Pectoral Fin (fluttering outward) */}
      <path
        d="M58 96 C26 84, 14 108, 28 124 C16 134, 24 156, 56 144 Z"
        fill="url(#finPeach)"
        stroke="#C2410C"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M52 110 L26 108 M52 122 L26 134" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Lush Forked Goldfish Tail Fin (broad translucent double-veil tail) */}
      <path
        d="M82 148 C66 172, 38 192, 26 206 C48 206, 70 194, 88 178 C92 192, 106 208, 128 210 C128 192, 114 170, 102 148 Z"
        fill="url(#tailGold)"
        stroke="#C2410C"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M84 158 C68 176, 52 190, 40 200 M94 158 C102 178, 112 192, 120 202 M90 160 L88 182"
        stroke="#EA580C"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Plump Goldfish Body & Round Head */}
      <path
        d="M94 34 C128 34, 148 58, 142 86 C137 108, 122 122, 110 144 C103 156, 84 158, 74 146 C62 132, 54 108, 54 84 C54 54, 68 34, 94 34 Z"
        fill="url(#goldfishBody)"
        stroke="#C2410C"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />

      {/* Subtle Fish Gill Curve & Scale Shimmer */}
      <path
        d="M68 88 C74 102, 84 108, 94 106"
        stroke="#EA580C"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M78 122 C82 126, 88 126, 92 122 M86 132 C90 136, 96 136, 100 132"
        stroke="#FEF08A"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Cute Doctor Coat Bib Accent */}
      <path
        d="M73 108 C86 116, 108 116, 118 108 L112 140 C100 146, 84 146, 75 138 Z"
        fill="#F8FAFC"
        stroke="#0284C7"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M94 120 V132 M88 126 H100" stroke="#0284C7" strokeWidth="2.6" strokeLinecap="round" />

      {/* Big Starry Sparkle Eyes */}
      <g>
        <path
          d="M88 60 L90.8 66.5 L97.5 68.5 L90.8 70.5 L88 77 L85.2 70.5 L78.5 68.5 L85.2 66.5 Z"
          fill="#1E293B"
        />
        <circle cx="85.8" cy="65.2" r="1.7" fill="#FFFFFF" />
        <path
          d="M120 60 L122.8 66.5 L129.5 68.5 L122.8 70.5 L120 77 L117.2 70.5 L110.5 68.5 L117.2 66.5 Z"
          fill="#1E293B"
        />
        <circle cx="117.8" cy="65.2" r="1.7" fill="#FFFFFF" />
      </g>

      {/* Rosy Cheeks */}
      <ellipse cx="75" cy="79" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.72" />
      <ellipse cx="130" cy="79" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.72" />

      {/* Friendly Smile */}
      {mood === 'alert' ? (
        <ellipse cx="104" cy="86" rx="5" ry="4" fill="#C2410C" />
      ) : (
        <path
          d="M94 84 C99 90, 109 90, 114 84"
          stroke="#7C2D12"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )}

      {/* Right Pectoral Fin reaching to hold clipboard */}
      <path
        d="M118 104 C134 98, 146 108, 138 122 C132 128, 122 122, 118 114 Z"
        fill="url(#finPeach)"
        stroke="#C2410C"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Medical Clipboard */}
      <g transform="translate(132, 98) rotate(12)">
        <rect
          x="0"
          y="4"
          width="36"
          height="44"
          rx="6"
          fill="#FEF3C7"
          stroke="#0369A1"
          strokeWidth="3"
        />
        <rect
          x="11"
          y="0"
          width="14"
          height="7"
          rx="2.5"
          fill="#38BDF8"
          stroke="#0369A1"
          strokeWidth="2.4"
        />
        <line x1="7" y1="17" x2="29" y2="17" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="7" y1="25" x2="25" y2="25" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M7 35 L13 31 L19 37 L29 29"
          stroke="#EA580C"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Cute Water Bubbles */}
      <circle cx="162" cy="54" r="4.5" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.8" />
      <circle cx="174" cy="38" r="3" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />

      <defs>
        <radialGradient id="piscesGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldfishBody" x1="75" y1="34" x2="128" y2="154" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="55%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="finPeach" x1="20" y1="20" x2="80" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <linearGradient id="tailGold" x1="60" y1="148" x2="110" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
      </defs>
    </svg>
  );
};
