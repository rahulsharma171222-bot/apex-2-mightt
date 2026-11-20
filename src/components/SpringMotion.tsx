import React from 'react';

interface SpringButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'soft' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<SpringButtonProps['variant']>, string> = {
  primary:
    'bg-[#1B5A32] hover:bg-[#144527] text-white border border-[#1B5A32] shadow-sm hover:shadow-md',
  outline:
    'bg-white hover:bg-[#F4F8F3] text-[#144527] border border-[#1B5A32]/70 hover:border-[#144527]',
  soft:
    'bg-[#E8F2E6] hover:bg-[#dcecd8] text-[#144527] border border-[#368737]/25',
  ghost:
    'bg-transparent hover:bg-[#F4F8F3] text-[#144527] border border-transparent',
};

const SIZE_CLASSES: Record<NonNullable<SpringButtonProps['size']>, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-base',
};

export function SpringButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: SpringButtonProps) {
  return (
    <button
      type={type}
      className={`spring-btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B5A32] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

interface SpringCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  asButton?: boolean;
  ariaLabel?: string;
}

export function SpringCard({
  children,
  className = '',
  onClick,
  asButton = false,
  ariaLabel,
}: SpringCardProps) {
  if (asButton || onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`spring-card text-left w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B5A32] ${className}`}
      >
        {children}
      </button>
    );
  }

  return <div className={`spring-card ${className}`}>{children}</div>;
}
