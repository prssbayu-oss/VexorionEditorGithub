import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#0d1117] select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0';

  const variantMap = {
    primary:
      'bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] shadow-sm focus:ring-[#238636] active:bg-[#1f702d]',
    secondary:
      'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-[#f0f6fc] border border-[#30363d] shadow-sm focus:ring-[#58a6ff] active:bg-[#282e33]',
    outline:
      'bg-transparent hover:bg-[#21262d] text-[#c9d1d9] hover:text-white border border-[#30363d] focus:ring-[#58a6ff]',
    danger:
      'bg-[#da3633] hover:bg-[#f85149] text-white border border-[rgba(240,246,252,0.1)] shadow-sm focus:ring-[#da3633]',
    ghost:
      'bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] focus:ring-[#58a6ff]',
    success:
      'bg-[#238636] hover:bg-[#2ea043] text-white shadow-sm focus:ring-[#238636]',
    subtle:
      'bg-[rgba(56,139,253,0.15)] hover:bg-[rgba(56,139,253,0.25)] text-[#58a6ff] border border-[rgba(56,139,253,0.3)] focus:ring-[#58a6ff]',
  };

  const sizeMap = {
    xs: 'px-2 py-1 text-xs gap-1.5 leading-none',
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
      ) : icon ? (
        <span className="shrink-0 text-current">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
