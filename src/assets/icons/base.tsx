import React from 'react';
import { IconProps } from './types';

export const createIcon = (
  displayName: string,
  children: React.ReactNode,
  viewBox = '0 0 24 24'
): React.FC<IconProps> => {
  const IconComponent: React.FC<IconProps> = ({
    size = 24,
    strokeWidth = 2,
    className = '',
    children: customChildren,
    ...props
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
      {customChildren}
    </svg>
  );

  IconComponent.displayName = displayName;
  return IconComponent;
};
