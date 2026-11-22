import React, { useId } from 'react';
import { Badge } from '../types/education';

interface BadgeEmblemProps {
  type: Badge['emblemType'];
  colorHex: string;
  unlocked: boolean;
  size?: number;
}

export const BadgeEmblem: React.FC<BadgeEmblemProps> = ({
  type,
  colorHex,
  unlocked,
  size = 64,
}) => {
  const uid = useId().replace(/:/g, '');
  const ringGradId = `ring-${uid}`;
  const jewelGradId = `jewel-${uid}`;

  const primary = unlocked ? colorHex : '#B8A3B9';
  const secondary = unlocked ? '#F472B6' : '#D5C6D7';
  const pearlBg = unlocked ? '#FFF7FB' : '#F6F1F5';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={ringGradId} x1="12" y1="8" x2="68" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={unlocked ? '#FBCFE8' : '#E5DCE6'} />
          <stop offset="50%" stopColor={primary} />
          <stop offset="100%" stopColor={unlocked ? '#A855F7' : '#C9BACB'} />
        </linearGradient>
        <linearGradient id={jewelGradId} x1="20" y1="16" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={unlocked ? '#FFFFFF' : '#F3EEF4'} />
          <stop offset="55%" stopColor={unlocked ? `${colorHex}30` : '#E9E1EA'} />
          <stop offset="100%" stopColor={unlocked ? `${colorHex}65` : '#DDD2DF'} />
        </linearGradient>
      </defs>

      {/* Soft Satin Ribbon Tails at Bottom */}
      <path
        d="M31 58 L24 75 L34 69 L38 76 L40 60 Z"
        fill={unlocked ? primary : '#C9BACB'}
        opacity={unlocked ? '0.9' : '0.55'}
      />
      <path
        d="M49 58 L56 75 L46 69 L42 76 L40 60 Z"
        fill={unlocked ? secondary : '#D5C6D7'}
        opacity={unlocked ? '0.9' : '0.55'}
      />

      {/* Scalloped / Pearl Outer Frame */}
      <circle cx="40" cy="37" r="30" fill={pearlBg} stroke={`url(#${ringGradId})`} strokeWidth="3.5" />
      <circle
        cx="40"
        cy="37"
        r="24.5"
        fill={`url(#${jewelGradId})`}
        stroke={unlocked ? '#FFFFFF' : '#E2D8E4'}
        strokeWidth="2"
      />

      {/* Pearl Beaded Halo */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 40 + Math.cos(rad) * 28.5;
        const cy = 37 + Math.sin(rad) * 28.5;
        return (
          <circle
            key={deg}
            cx={cx}
            cy={cy}
            r="2.1"
            fill={unlocked ? '#FFFFFF' : '#EFE9F0'}
            stroke={primary}
            strokeWidth="0.9"
          />
        );
      })}

      {/* Sparkle Accent Stars */}
      {unlocked && (
        <>
          <path
            d="M15 16 L16.8 20.2 L21 22 L16.8 23.8 L15 28 L13.2 23.8 L9 22 L13.2 20.2 Z"
            fill="#FBBF24"
          />
          <path
            d="M65 13 L66.3 16.2 L69.5 17.5 L66.3 18.8 L65 22 L63.7 18.8 L60.5 17.5 L63.7 16.2 Z"
            fill="#F472B6"
          />
        </>
      )}

      {/* Center Girly Medallion Motif */}
      {type === 'butterfly' && (
        <g>
          <path
            d="M39 35 C34 22 20 22 22 33 C23 41 33 41 39 38 Z"
            fill={unlocked ? '#F472B6' : '#C9BACB'}
            stroke={primary}
            strokeWidth="1.5"
          />
          <path
            d="M41 35 C46 22 60 22 58 33 C57 41 47 41 41 38 Z"
            fill={unlocked ? '#F472B6' : '#C9BACB'}
            stroke={primary}
            strokeWidth="1.5"
          />
          <path
            d="M39 39 C32 40 24 47 28 52 C32 56 38 49 39 42 Z"
            fill={unlocked ? '#FDE047' : '#D5C6D7'}
            stroke={primary}
            strokeWidth="1.4"
          />
          <path
            d="M41 39 C48 40 56 47 52 52 C48 56 42 49 41 42 Z"
            fill={unlocked ? '#FDE047' : '#D5C6D7'}
            stroke={primary}
            strokeWidth="1.4"
          />
          <rect x="38.2" y="29" width="3.6" height="17" rx="1.8" fill={unlocked ? '#4A1D4B' : '#9B879D'} />
          <path d="M39 30 Q35 24 32 25" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M41 30 Q45 24 48 25" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {type === 'compass' && (
        <g>
          {/* Crystal Heart Gem + Sparkle Star */}
          <path
            d="M40 51 C40 51 24 42 24 31 C24 25.5 28.5 22 33.5 22 C36.8 22 39 23.8 40 26 C41 23.8 43.2 22 46.5 22 C51.5 22 56 25.5 56 31 C56 42 40 51 40 51 Z"
            fill={unlocked ? '#C084FC' : '#C9BACB'}
            stroke={primary}
            strokeWidth="1.8"
          />
          <path d="M40 28 L42.5 34 L48.5 36.5 L42.5 39 L40 45 L37.5 39 L31.5 36.5 L37.5 34 Z" fill="#FFFFFF" />
        </g>
      )}

      {type === 'quill' && (
        <g>
          <path
            d="M52 22 C41 22 30 30 28 45 L25 51 L32 48 C46 46 52 34 52 22 Z"
            fill={unlocked ? '#FB7185' : '#C9BACB'}
            stroke={primary}
            strokeWidth="1.7"
          />
          <path d="M28 45 L45 28" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M48 45 C48 45 43 42 43 39 C43 37.3 44.5 36 46 36 C47 36 47.7 36.6 48 37.4 C48.3 36.6 49 36 50 36 C51.5 36 53 37.3 53 39 C53 42 48 45 48 45 Z"
            fill={unlocked ? '#FBBF24' : '#D5C6D7'}
          />
        </g>
      )}

      {type === 'atom' && (
        <g>
          {/* Enchanted Science Crystal Starburst */}
          <ellipse
            cx="40"
            cy="37"
            rx="16"
            ry="7"
            transform="rotate(35 40 37)"
            stroke={primary}
            strokeWidth="2"
            fill={unlocked ? '#A7F3D0' : 'none'}
            fillOpacity="0.45"
          />
          <ellipse
            cx="40"
            cy="37"
            rx="16"
            ry="7"
            transform="rotate(-35 40 37)"
            stroke={primary}
            strokeWidth="2"
            fill={unlocked ? '#FBCFE8' : 'none'}
            fillOpacity="0.45"
          />
          <circle cx="40" cy="37" r="5" fill={unlocked ? '#FBBF24' : '#B8A3B9'} stroke={primary} strokeWidth="1.5" />
          <circle cx="27" cy="30" r="2.3" fill={primary} />
          <circle cx="53" cy="44" r="2.3" fill={primary} />
        </g>
      )}

      {type === 'carthage' && (
        <g>
          <path
            d="M27 49 V35 C27 27 32 22 40 22 C48 22 53 27 53 35 V49 Z"
            fill={unlocked ? '#FDE68A' : '#D5C6D7'}
            stroke={primary}
            strokeWidth="2"
          />
          <path
            d="M34 49 V37 C34 33 36.5 30 40 30 C43.5 30 46 33 46 37 V49 Z"
            fill={unlocked ? '#FFFFFF' : '#EFE9F0'}
            stroke={primary}
            strokeWidth="1.6"
          />
          <path d="M24 49 H56" stroke={primary} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="40" cy="19" r="2.5" fill={unlocked ? '#F472B6' : '#C9BACB'} />
        </g>
      )}

      {type === 'polyglot' && (
        <g>
          <circle
            cx="40"
            cy="37"
            r="14"
            fill={unlocked ? '#BAE6FD' : '#D5C6D7'}
            stroke={primary}
            strokeWidth="2"
          />
          <ellipse cx="40" cy="37" rx="6.5" ry="14" stroke={primary} strokeWidth="1.6" fill={unlocked ? '#FFFFFF' : 'none'} fillOpacity="0.45" />
          <path d="M26 37 H54" stroke={primary} strokeWidth="1.6" />
          <path d="M28 30 H52" stroke={primary} strokeWidth="1.4" />
          <path d="M28 44 H52" stroke={primary} strokeWidth="1.4" />
          <circle cx="40" cy="23" r="2.5" fill={unlocked ? '#F472B6' : '#B8A3B9'} />
        </g>
      )}

      {type === 'palette' && (
        <g>
          <path
            d="M40 22 C30 22 24 28 24 37 C24 45 30 50 38 50 C41 50 42 48 42 46 C42 44 41 43 43 42 C45 41 55 42 55 35 C55 27 48 22 40 22 Z"
            fill={unlocked ? '#FED7AA' : '#D5C6D7'}
            stroke={primary}
            strokeWidth="2"
          />
          <circle cx="32" cy="33" r="2.5" fill={unlocked ? '#EC4899' : '#B8A3B9'} />
          <circle cx="40" cy="28" r="2.5" fill={unlocked ? '#A855F7' : '#B8A3B9'} />
          <circle cx="47" cy="32" r="2.5" fill={unlocked ? '#38BDF8' : '#B8A3B9'} />
          <circle cx="33" cy="42" r="2.5" fill={unlocked ? '#FBBF24' : '#B8A3B9'} />
        </g>
      )}

      {type === 'crown' && (
        <g>
          <path
            d="M23 47 L26 28 L35 36 L40 22 L45 36 L54 28 L57 47 H23 Z"
            fill={unlocked ? '#FDE047' : '#D5C6D7'}
            stroke={primary}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="24" y="48.5" width="32" height="3.5" rx="1.75" fill={unlocked ? '#F472B6' : '#B8A3B9'} />
          <circle cx="40" cy="21" r="2.6" fill={unlocked ? '#EC4899' : '#B8A3B9'} />
          <circle cx="26" cy="27" r="2.2" fill={unlocked ? '#EC4899' : '#B8A3B9'} />
          <circle cx="54" cy="27" r="2.2" fill={unlocked ? '#EC4899' : '#B8A3B9'} />
          <circle cx="40" cy="40" r="3" fill={unlocked ? '#F43F5E' : '#B8A3B9'} />
        </g>
      )}

      {/* Center Satin Bow Accent on Medallion */}
      <g transform="translate(40, 58)">
        <path
          d="M-1 -1 C-6 -5 -10 -3 -9 1 C-8 4 -3 3 -1 1 Z"
          fill={unlocked ? '#EC4899' : '#C9BACB'}
        />
        <path
          d="M1 -1 C6 -5 10 -3 9 1 C8 4 3 3 1 1 Z"
          fill={unlocked ? '#EC4899' : '#C9BACB'}
        />
        <circle cx="0" cy="0" r="2.3" fill={unlocked ? '#FDE047' : '#EFE9F0'} />
      </g>
    </svg>
  );
};
