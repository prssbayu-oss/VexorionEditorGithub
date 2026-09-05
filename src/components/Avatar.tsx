import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeMap = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  const statusColorMap = {
    online: 'bg-[#238636]',
    busy: 'bg-[#da3633]',
    offline: 'bg-[#6e7681]',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover ring-1 ring-[#30363d]`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback to initials on error
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] flex items-center justify-center font-semibold select-none`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${statusColorMap[status]} ${statusSizeMap[size]} ring-[#0d1117]`}
        />
      )}
    </div>
  );
};
