import React from 'react';

interface FrameBlossomProps {
  size?: 'sm' | 'md' | 'lg';
  accentHex?: string;
}

/**
 * Delicate floral ornament centered on the top frame edge.
 * Renders a soft Srayna rose flanked by tiny leaves and side buds.
 */
export const FrameBlossom: React.FC<FrameBlossomProps> = ({
  size = 'md',
  accentHex,
}) => {
  const sideBudColor = accentHex ? `${accentHex}85` : '#D4BFEF';

  if (size === 'sm') {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-[10px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center"
      >
        <svg width="52" height="18" viewBox="0 0 52 18" fill="none">
          {/* Soft white halo behind flowers so the border line breaks cleanly */}
          <path
            d="M11 9.5C15 7.5 19 8.5 21 9.5M41 9.5C37 7.5 33 8.5 31 9.5"
            stroke="#94CEB6"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Leaves */}
          <path
            d="M16.5 11.2C16.5 8.8 18.8 7.5 21.2 8.7C21.2 10.9 19 12.2 16.5 11.2Z"
            fill="#8FCBAE"
          />
          <path
            d="M35.5 11.2C35.5 8.8 33.2 7.5 30.8 8.7C30.8 10.9 33 12.2 35.5 11.2Z"
            fill="#8FCBAE"
          />
          {/* Side tiny buds */}
          <circle cx="11.5" cy="9.2" r="2.6" fill="#FFFFFF" />
          <circle cx="11.5" cy="9.2" r="1.8" fill={sideBudColor} />
          <circle cx="40.5" cy="9.2" r="2.6" fill="#FFFFFF" />
          <circle cx="40.5" cy="9.2" r="1.8" fill={sideBudColor} />

          {/* Center Rose Halo */}
          <circle cx="26" cy="9" r="6.8" fill="#FFFFFF" opacity="0.96" />
          {/* 5 Petals */}
          <circle cx="26" cy="4.8" r="2.5" fill="#F1A7C5" />
          <circle cx="30" cy="7.6" r="2.5" fill="#F1A7C5" />
          <circle cx="28.5" cy="12" r="2.5" fill="#F1A7C5" />
          <circle cx="23.5" cy="12" r="2.5" fill="#F1A7C5" />
          <circle cx="22" cy="7.6" r="2.5" fill="#F1A7C5" />
          <circle cx="26" cy="8.9" r="3.1" fill="#FDEAF2" />
          <circle cx="26" cy="8.9" r="1.5" fill="#F2C86B" />
        </svg>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-[12px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center"
      >
        <svg width="96" height="22" viewBox="0 0 96 22" fill="none">
          {/* Delicate curved tendrils */}
          <path
            d="M8 11.5C15 8.5 23 12.5 31 11M88 11.5C81 8.5 73 12.5 65 11"
            stroke="#9FD2BC"
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Outer & Inner Leaves */}
          <path
            d="M27.5 13.5C27.5 10.5 30.5 9 33.5 10.4C33.5 13.1 30.8 14.8 27.5 13.5Z"
            fill="#8FCBAE"
          />
          <path
            d="M68.5 13.5C68.5 10.5 65.5 9 62.5 10.4C62.5 13.1 65.2 14.8 68.5 13.5Z"
            fill="#8FCBAE"
          />
          <path
            d="M36.5 13.6C36.5 10.8 39.2 9.4 42 10.7C42 13.2 39.5 14.7 36.5 13.6Z"
            fill="#A7DBC1"
          />
          <path
            d="M59.5 13.6C59.5 10.8 56.8 9.4 54 10.7C54 13.2 56.5 14.7 59.5 13.6Z"
            fill="#A7DBC1"
          />

          {/* Tiny outer gold-tinted buds */}
          <circle cx="10.5" cy="11.2" r="2.6" fill="#FFFFFF" />
          <circle cx="10.5" cy="11.2" r="1.7" fill="#F3D184" />
          <circle cx="85.5" cy="11.2" r="2.6" fill="#FFFFFF" />
          <circle cx="85.5" cy="11.2" r="1.7" fill="#F3D184" />

          {/* Flanking Small Blossoms */}
          <circle cx="24" cy="10.8" r="4.8" fill="#FFFFFF" opacity="0.96" />
          <circle cx="24" cy="8.3" r="1.7" fill={sideBudColor} />
          <circle cx="26.4" cy="10.1" r="1.7" fill={sideBudColor} />
          <circle cx="25.5" cy="12.9" r="1.7" fill={sideBudColor} />
          <circle cx="22.5" cy="12.9" r="1.7" fill={sideBudColor} />
          <circle cx="21.6" cy="10.1" r="1.7" fill={sideBudColor} />
          <circle cx="24" cy="10.9" r="1.6" fill="#FDEAF2" />
          <circle cx="24" cy="10.9" r="0.9" fill="#F2C86B" />

          <circle cx="72" cy="10.8" r="4.8" fill="#FFFFFF" opacity="0.96" />
          <circle cx="72" cy="8.3" r="1.7" fill={sideBudColor} />
          <circle cx="74.4" cy="10.1" r="1.7" fill={sideBudColor} />
          <circle cx="73.5" cy="12.9" r="1.7" fill={sideBudColor} />
          <circle cx="70.5" cy="12.9" r="1.7" fill={sideBudColor} />
          <circle cx="69.6" cy="10.1" r="1.7" fill={sideBudColor} />
          <circle cx="72" cy="10.9" r="1.6" fill="#FDEAF2" />
          <circle cx="72" cy="10.9" r="0.9" fill="#F2C86B" />

          {/* Center Signature Rose */}
          <circle cx="48" cy="11" r="8.2" fill="#FFFFFF" opacity="0.97" />
          <circle cx="48" cy="5.8" r="3" fill="#F1A7C5" />
          <circle cx="52.8" cy="9.3" r="3" fill="#F1A7C5" />
          <circle cx="51" cy="14.6" r="3" fill="#F1A7C5" />
          <circle cx="45" cy="14.6" r="3" fill="#F1A7C5" />
          <circle cx="43.2" cy="9.3" r="3" fill="#F1A7C5" />
          <circle cx="48" cy="10.9" r="3.7" fill="#FDEAF2" />
          <circle cx="48" cy="10.9" r="1.8" fill="#F2C86B" />
        </svg>
      </span>
    );
  }

  // Default 'md'
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none select-none absolute -top-[11px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center"
    >
      <svg width="72" height="20" viewBox="0 0 72 20" fill="none">
        {/* Delicate curved tendrils */}
        <path
          d="M9 10.5C15 8 21 11.5 27 10M63 10.5C57 8 51 11.5 45 10"
          stroke="#9FD2BC"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Leaves */}
        <path
          d="M24.5 12.2C24.5 9.6 27.1 8.2 29.7 9.5C29.7 11.9 27.3 13.4 24.5 12.2Z"
          fill="#8FCBAE"
        />
        <path
          d="M47.5 12.2C47.5 9.6 44.9 8.2 42.3 9.5C42.3 11.9 44.7 13.4 47.5 12.2Z"
          fill="#8FCBAE"
        />

        {/* Side Small Blossoms */}
        <circle cx="15.5" cy="10" r="4.2" fill="#FFFFFF" opacity="0.96" />
        <circle cx="15.5" cy="7.9" r="1.45" fill={sideBudColor} />
        <circle cx="17.5" cy="9.4" r="1.45" fill={sideBudColor} />
        <circle cx="16.7" cy="11.8" r="1.45" fill={sideBudColor} />
        <circle cx="14.3" cy="11.8" r="1.45" fill={sideBudColor} />
        <circle cx="13.5" cy="9.4" r="1.45" fill={sideBudColor} />
        <circle cx="15.5" cy="10" r="1.35" fill="#FDEAF2" />
        <circle cx="15.5" cy="10" r="0.75" fill="#F2C86B" />

        <circle cx="56.5" cy="10" r="4.2" fill="#FFFFFF" opacity="0.96" />
        <circle cx="56.5" cy="7.9" r="1.45" fill={sideBudColor} />
        <circle cx="58.5" cy="9.4" r="1.45" fill={sideBudColor} />
        <circle cx="57.7" cy="11.8" r="1.45" fill={sideBudColor} />
        <circle cx="55.3" cy="11.8" r="1.45" fill={sideBudColor} />
        <circle cx="54.5" cy="9.4" r="1.45" fill={sideBudColor} />
        <circle cx="56.5" cy="10" r="1.35" fill="#FDEAF2" />
        <circle cx="56.5" cy="10" r="0.75" fill="#F2C86B" />

        {/* Center Rose */}
        <circle cx="36" cy="10" r="7.5" fill="#FFFFFF" opacity="0.97" />
        <circle cx="36" cy="5.3" r="2.75" fill="#F1A7C5" />
        <circle cx="40.4" cy="8.5" r="2.75" fill="#F1A7C5" />
        <circle cx="38.7" cy="13.4" r="2.75" fill="#F1A7C5" />
        <circle cx="33.3" cy="13.4" r="2.75" fill="#F1A7C5" />
        <circle cx="31.6" cy="8.5" r="2.75" fill="#F1A7C5" />
        <circle cx="36" cy="9.9" r="3.4" fill="#FDEAF2" />
        <circle cx="36" cy="9.9" r="1.6" fill="#F2C86B" />
      </svg>
    </span>
  );
};
