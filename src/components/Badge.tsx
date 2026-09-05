import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'info' | 'outline' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  children,
  className = '',
}) => {
  const styles = {
    default: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
    neutral: 'bg-[#21262d] text-[#c9d1d9] border-[#30363d]',
    success: 'bg-[rgba(35,134,54,0.15)] text-[#3fb950] border-[rgba(63,185,80,0.3)]',
    warning: 'bg-[rgba(210,153,34,0.15)] text-[#d29922] border-[rgba(210,153,34,0.3)]',
    danger: 'bg-[rgba(248,81,73,0.15)] text-[#f85149] border-[rgba(248,81,73,0.3)]',
    purple: 'bg-[rgba(163,113,247,0.15)] text-[#a371f7] border-[rgba(163,113,247,0.3)]',
    info: 'bg-[rgba(56,139,253,0.15)] text-[#58a6ff] border-[rgba(56,139,253,0.3)]',
    outline: 'bg-transparent text-[#8b949e] border-[#30363d]',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 leading-none',
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};
