import React from 'react';
import { GENERATED_ASSETS } from '../data/assets';

interface BrandLogoProps {
  onDark?: boolean;
  compact?: boolean;
}

export function BrandLogo({ onDark = false, compact = false }: BrandLogoProps) {
  return (
    <span
      className={`inline-flex items-center ${
        compact ? 'gap-2 sm:gap-2.5' : 'gap-3'
      } shrink-0 select-none`}
    >
      <span
        className={`relative rounded-full overflow-hidden shrink-0 bg-white ${
          compact ? 'w-9 h-9 sm:w-12 sm:h-12' : 'w-14 h-14 sm:w-16 sm:h-16'
        } ${
          onDark
            ? 'ring-2 ring-[#E6A817]/80 shadow-md'
            : 'ring-1 ring-[#D9C89C] shadow-xs'
        }`}
      >
        <img
          src={GENERATED_ASSETS.officialLogo}
          alt="GOVEDA Carbon & Climate India Foundation Official Seal"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-[1.04]"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight whitespace-nowrap ${
            compact ? 'text-[15px] sm:text-[21px]' : 'text-xl sm:text-2xl'
          } ${onDark ? 'text-white' : 'text-[#113B19]'}`}
        >
          GOVEDA<sup className="text-[9px] sm:text-[10px] font-bold ml-0.5">®</sup>
        </span>
        <span
          className={`font-bold uppercase whitespace-nowrap mt-0.5 ${
            compact
              ? 'text-[6px] sm:text-[8.5px] tracking-[0.015em] sm:tracking-[0.04em]'
              : 'text-[9px] sm:text-[9.5px] tracking-[0.05em]'
          } ${onDark ? 'text-[#D4ECD0]' : 'text-[#213327]'}`}
        >
          CARBON &amp; CLIMATE INDIA FOUNDATION
        </span>
      </span>
    </span>
  );
}
