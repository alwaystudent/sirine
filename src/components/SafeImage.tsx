import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#FDF2F8] to-[#F5F3FF] text-[#DB2777] p-4 text-center ${className}`}
      >
        <BookOpen className="w-8 h-8" />
        <span className="text-xs font-bold text-[#2D1B2E]">{fallbackLabel ?? alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
