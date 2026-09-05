import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FileCode,
  CircleDot,
  GitPullRequest,
  GitCommit,
  GitBranch,
  Terminal,
  Code2,
  BarChart2,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { queryRepository, SearchResultItem } from '../../engine/searchEngine';
import { RepoFile, Issue, PullRequest, GitCommit as GitCommitType } from '../../engine/types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  files: RepoFile[];
  issues: Issue[];
  pullRequests: PullRequest[];
  commits: GitCommitType[];
  onNavigateTab: (tabId: string) => void;
  onSelectFile?: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  files,
  issues,
  pullRequests,
  commits,
  onNavigateTab,
  onSelectFile,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Default Quick Navigation Actions when query is empty
  const defaultActions: SearchResultItem[] = [
    {
      id: 'nav-code',
      type: 'command',
      title: 'Go to Code Explorer',
      subtitle: 'Browse files, README, and commit tree',
      badge: 'Tab',
      action: () => {
        onNavigateTab('code');
        onClose();
      },
    },
    {
      id: 'nav-issues',
      type: 'command',
      title: 'Go to Issues',
      subtitle: 'View bug reports and feature discussions',
      badge: 'Tab',
      action: () => {
        onNavigateTab('issues');
        onClose();
      },
    },
    {
      id: 'nav-pulls',
      type: 'command',
      title: 'Go to Pull Requests',
      subtitle: 'Review code diffs and branch merges',
      badge: 'Tab',
      action: () => {
        onNavigateTab('pulls');
        onClose();
      },
    },
    {
      id: 'nav-actions',
      type: 'command',
      title: 'Go to GitHub Actions',
      subtitle: 'Simulate workflow runners and inspect build logs',
      badge: 'Tab',
      action: () => {
        onNavigateTab('actions');
        onClose();
      },
    },
    {
      id: 'nav-insights',
      type: 'command',
      title: 'Go to Insights & Pulse',
      subtitle: 'View 52-week contribution heatmap & metrics',
      badge: 'Tab',
      action: () => {
        onNavigateTab('insights');
        onClose();
      },
    },
  ];

  const searchResults: SearchResultItem[] = query.trim()
    ? queryRepository(query, files, issues, pullRequests, commits)
    : defaultActions;

  const handleSelectItem = (item: SearchResultItem) => {
    if (item.action) {
      item.action();
      return;
    }
    if (item.type === 'file' && item.path) {
      onNavigateTab('code');
      onSelectFile?.(item.path);
      onClose();
      return;
    }
    if (item.type === 'issue') {
      onNavigateTab('issues');
      onClose();
      return;
    }
    if (item.type === 'pull-request') {
      onNavigateTab('pulls');
      onClose();
      return;
    }
    if (item.type === 'commit') {
      onNavigateTab('code');
      onClose();
      return;
    }
  };

  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'file':
        return <FileCode className="w-4 h-4 text-[#58a6ff]" />;
      case 'issue':
        return <CircleDot className="w-4 h-4 text-[#3fb950]" />;
      case 'pull-request':
        return <GitPullRequest className="w-4 h-4 text-[#a371f7]" />;
      case 'commit':
        return <GitCommit className="w-4 h-4 text-[#d29922]" />;
      default:
        return <Terminal className="w-4 h-4 text-[#8b949e]" />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) handleSelectItem(selected);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.12 }}
            className="relative w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
              <Search className="w-4 h-4 text-[#58a6ff] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type to search files, issues, PRs, or commands..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none"
              />
              <button
                onClick={onClose}
                className="text-[#8b949e] hover:text-[#f0f6fc] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#30363d]/30">
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8b949e]">
                  No matching results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-3 py-2.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[rgba(56,139,253,0.15)] text-[#f0f6fc]'
                          : 'text-[#c9d1d9] hover:bg-[#21262d]'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="shrink-0">{getItemIcon(item.type)}</span>
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate text-[#f0f6fc]">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#8b949e] truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                            {item.badge}
                          </span>
                        )}
                        {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#58a6ff]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer keyboard hints */}
            <div className="px-4 py-2 bg-[#0d1117]/60 border-t border-[#30363d] flex items-center justify-between text-[11px] text-[#8b949e]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px] font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px] font-mono">↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px] font-mono">↵</kbd>
                  <span>to select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px] font-mono">esc</kbd>
                <span>to close</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
