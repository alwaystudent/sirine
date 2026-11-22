import React from 'react';

interface RoseEmblemProps {
  variant?: 'pink' | 'light' | 'lavender';
  size?: number;
  className?: string;
}

export const RoseEmblem: React.FC<RoseEmblemProps> = ({
  variant = 'pink',
  size = 20,
  className = '',
}) => {
  const petalOuter = variant === 'lavender' ? '#CBB5F0' : '#F1A7C5';
  const petalInner = variant === 'lavender' ? '#F2ECFD' : '#FDEAF2';
  const centerColor = '#F2C86B';
  const leafColor = '#8FCBAE';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Delicate Leaves */}
      <path
        d="M4.8 18.8C4.8 15.6 7.5 14 10.2 15.3C10.2 18 7.8 20 4.8 18.8Z"
        fill={leafColor}
      />
      <path
        d="M21.2 18.8C21.2 15.6 18.5 14 15.8 15.3C15.8 18 18.2 20 21.2 18.8Z"
        fill={leafColor}
      />
      {/* 5 Outer Pastel Petals */}
      <circle cx="13" cy="6.4" r="3.5" fill={petalOuter} />
      <circle cx="18.6" cy="10.4" r="3.5" fill={petalOuter} />
      <circle cx="16.5" cy="16.7" r="3.5" fill={petalOuter} />
      <circle cx="9.5" cy="16.7" r="3.5" fill={petalOuter} />
      <circle cx="7.4" cy="10.4" r="3.5" fill={petalOuter} />
      {/* Inner Blossom Swirl */}
      <circle cx="13" cy="12.1" r="4.3" fill={petalInner} />
      {/* Warm Golden Heart */}
      <circle cx="13" cy="12.1" r="2.05" fill={centerColor} />
    </svg>
  );
};
