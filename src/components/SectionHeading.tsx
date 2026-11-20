import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  kicker?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  kicker,
  className = '',
}: SectionHeadingProps) {
  if (align === 'center') {
    return (
      <div className={`text-center max-w-3xl mx-auto ${className}`}>
        {kicker && (
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#368737] mb-2">
            {kicker}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <span className="hidden sm:block h-[1.5px] w-14 bg-[#4BA348]/55 rounded-full" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#144527] text-balance leading-tight">
            {title}
          </h2>
          <span className="hidden sm:block h-[1.5px] w-14 bg-[#4BA348]/55 rounded-full" aria-hidden="true" />
        </div>
        {subtitle && (
          <p className="mt-2.5 text-sm sm:text-base text-[#44544A] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {kicker && (
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#368737] mb-1.5">
          {kicker}
        </p>
      )}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#144527] text-balance leading-tight">
          {title}
        </h2>
        <span className="hidden sm:block flex-1 max-w-[140px] h-[1.5px] bg-[#4BA348]/50 rounded-full" aria-hidden="true" />
      </div>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-[#44544A] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
