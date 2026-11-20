import React, { useState } from 'react';
import { Sprout } from 'lucide-react';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';

interface ResilientImageProps {
  assetKey: AssetKey;
  alt: string;
  className?: string;
  objectPosition?: string;
}

export function ResilientImage({
  assetKey,
  alt,
  className = 'w-full h-full object-cover',
  objectPosition = 'object-center',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);
  const src = GENERATED_ASSETS[assetKey];

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F8F3] to-[#E2EFE0] text-[#1B5A32] p-4 text-center ${className}`}
      >
        <Sprout className="w-8 h-8 text-[#368737] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium max-w-[20ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${className} ${objectPosition}`}
      loading="eager"
    />
  );
}
