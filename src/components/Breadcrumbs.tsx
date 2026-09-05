import React from 'react';
import { ChevronRight, Folder, FileCode, Home } from '../icons';

export interface BreadcrumbSegment {
  name: string;
  path: string;
  isFolder: boolean;
}

export interface BreadcrumbsProps {
  currentPath: string; // e.g. "src/components/Button.tsx" or ""
  repoName: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPath,
  repoName,
  onNavigate,
  className = '',
}) => {
  if (!currentPath) {
    return (
      <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#f0f6fc] min-w-0 ${className}`}>
        <Home className="w-4 h-4 text-[#58a6ff] shrink-0" />
        <span className="truncate max-w-[180px] sm:max-w-none">{repoName}</span>
      </div>
    );
  }

  const parts = currentPath.split('/').filter(Boolean);
  const segments: BreadcrumbSegment[] = parts.map((part, index) => {
    const subPath = parts.slice(0, index + 1).join('/');
    const isLast = index === parts.length - 1;
    const isFolder = !isLast || !part.includes('.');
    return {
      name: part,
      path: subPath,
      isFolder,
    };
  });

  return (
    <nav className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium flex-wrap min-w-0 ${className}`}>
      <button
        onClick={() => onNavigate('')}
        className="text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="truncate max-w-[130px] sm:max-w-none">{repoName}</span>
      </button>

      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={seg.path}>
            <ChevronRight className="w-3.5 h-3.5 text-[#6e7681] shrink-0" />
            {isLast ? (
              <span className="text-[#f0f6fc] font-semibold flex items-center gap-1 min-w-0">
                {seg.isFolder ? <Folder className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" /> : <FileCode className="w-3.5 h-3.5 text-[#79c0ff] shrink-0" />}
                <span className="truncate max-w-[160px] sm:max-w-none">{seg.name}</span>
              </span>
            ) : (
              <button
                onClick={() => onNavigate(seg.path)}
                className="text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Folder className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span className="truncate max-w-[120px] sm:max-w-none">{seg.name}</span>
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
