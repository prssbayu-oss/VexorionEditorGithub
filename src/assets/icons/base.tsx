import React from 'react';
import { IconProps } from './types';

export function createSvgIconFromRaw(rawSvg: string, displayName: string): React.FC<IconProps> {
  const viewBoxMatch = rawSvg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  const isFill = rawSvg.includes('fill="currentColor"');

  // Strip opening and closing svg tags to inject contents into customized SVG element
  const innerHtml = rawSvg
    .replace(/^<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '');

  const IconComponent: React.FC<IconProps> = ({
    size = 24,
    strokeWidth = 2,
    className = '',
    ...props
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={isFill ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: innerHtml }}
      {...props}
    />
  );

  IconComponent.displayName = displayName;
  return IconComponent;
}
