import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-xs ${className}`}>
      {header && (
        <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-[#30363d] bg-[#0d1117]/40 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
