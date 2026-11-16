import React, { useMemo } from 'react';

interface BioluminescentSkyProps {
  isNight: boolean;
}

interface StarSpec {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: string;
  delay: string;
}

export const BioluminescentSky: React.FC<BioluminescentSkyProps> = ({ isNight }) => {
  const stars = useMemo<StarSpec[]>(() => {
    const palette = ['#5EEAD4', '#38BDF8', '#FDE68A', '#A5F3FC', '#C4B5FD'];
    return Array.from({ length: 78 }, (_, idx) => {
      // Deterministic pseudo-random spread across viewport
      const seedA = Math.sin(idx * 12.9898) * 43758.5453;
      const seedB = Math.sin(idx * 78.233 + 1.7) * 24634.6345;
      const x = ((seedA - Math.floor(seedA)) * 98) + 1;
      const y = ((seedB - Math.floor(seedB)) * 96) + 2;
      const size = (idx % 4) + 2;
      const color = palette[idx % palette.length];
      const duration = `${(2.8 + (idx % 5) * 0.7).toFixed(1)}s`;
      const delay = `${((idx % 7) * 0.45).toFixed(2)}s`;
      return { id: idx, x, y, size, color, duration, delay };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-500"
    >
      {/* Day mode soft pastel light-blue & warm butter-yellow sky wash */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isNight ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(circle at 18% 12%, #FEF9C3 0%, rgba(254, 249, 195, 0) 42%), radial-gradient(circle at 85% 18%, #BAE6FD 0%, rgba(186, 230, 253, 0) 46%), linear-gradient(180deg, #E8F5FF 0%, #F4FAFF 52%, #FFFDF2 100%)',
        }}
      />

      {/* Night mode deep orbital cosmos + bioluminescent nebula & stars */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isNight ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle at 20% 15%, rgba(20, 184, 166, 0.16) 0%, transparent 45%), radial-gradient(circle at 80% 25%, rgba(56, 189, 248, 0.14) 0%, transparent 48%), radial-gradient(circle at 50% 85%, rgba(167, 139, 250, 0.11) 0%, transparent 50%), linear-gradient(180deg, #050914 0%, #091126 55%, #0B152E 100%)',
        }}
      >
        {isNight &&
          stars.map((star) => (
            <span
              key={star.id}
              className="absolute rounded-full animate-bio-twinkle"
              style={
                {
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  boxShadow: `0 0 ${star.size * 3.5}px ${star.color}`,
                  '--twinkle-duration': star.duration,
                  '--twinkle-delay': star.delay,
                } as React.CSSProperties
              }
            />
          ))}
      </div>
    </div>
  );
};
