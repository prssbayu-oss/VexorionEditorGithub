import React from 'react';
import {
  Search,
  Bell,
  Plus,
  GitPullRequest,
  CircleDot,
  Bookmark,
  Terminal,
  Sun,
  Moon,
  Github,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../../components/Avatar';

export interface NavbarProps {
  onOpenCommandPalette: () => void;
  unreadNotifications?: number;
  openPRsCount: number;
  openIssuesCount: number;
  onNavigateTab: (tabId: string) => void;
  theme: 'dark' | 'dimmed';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  unreadNotifications = 2,
  openPRsCount,
  openIssuesCount,
  onNavigateTab,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="w-full bg-[#161b22] border-b border-[#30363d] text-[#f0f6fc] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Left: Brand & Links */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => onNavigateTab('code')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#21262d] group-hover:bg-[#30363d] border border-[#30363d] flex items-center justify-center transition-all shrink-0">
              <Github className="w-5 h-5 text-[#f0f6fc]" />
            </div>
            <span className="font-semibold text-xs sm:text-sm tracking-tight inline-block whitespace-nowrap">
              Vexorion<span className="text-[#58a6ff]">Editor</span><span className="text-[#3fb950] font-mono text-[10px] sm:text-xs ml-0.5 hidden xs:inline">Github</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs text-[#c9d1d9]">
            <button
              onClick={() => onNavigateTab('pulls')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#21262d] transition-colors cursor-pointer"
            >
              <GitPullRequest className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Pull requests</span>
              {openPRsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#30363d] text-[#c9d1d9] font-medium">
                  {openPRsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigateTab('issues')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#21262d] transition-colors cursor-pointer"
            >
              <CircleDot className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Issues</span>
              {openIssuesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#30363d] text-[#c9d1d9] font-medium">
                  {openIssuesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigateTab('actions')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#21262d] transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[#8b949e]" />
              <span>Actions</span>
            </button>
          </nav>
        </div>

        {/* Center: Search / Command Palette Bar */}
        <div className="flex-1 min-w-0 max-w-[160px] sm:max-w-md mx-1 sm:mx-2">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 bg-[#0d1117] hover:bg-[#0d1117]/80 border border-[#30363d] hover:border-[#58a6ff]/50 rounded-md text-xs text-[#8b949e] transition-all cursor-pointer shadow-xs group min-w-0"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
              <Search className="w-3.5 h-3.5 group-hover:text-[#58a6ff] transition-colors shrink-0" />
              <span className="truncate min-w-0 text-[11px] sm:text-xs">
                <span className="sm:hidden">Search...</span>
                <span className="hidden sm:inline">Type <kbd className="font-mono text-[#c9d1d9]">⌘K</kbd> or search...</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono bg-[#21262d] border border-[#30363d] rounded px-1.5 py-0.5 text-[#8b949e] shrink-0">
              <span>⌘K</span>
            </div>
          </button>
        </div>

        {/* Right: Actions, Notifications & Avatar */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] rounded-md transition-colors cursor-pointer"
            title="Toggle contrast tone"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => onNavigateTab('pulls')}
              className="p-1.5 text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] rounded-md transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#58a6ff] ring-2 ring-[#161b22]" />
              )}
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#30363d] mx-0.5 sm:mx-1" />

          <div className="flex items-center gap-2 shrink-0">
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              name="Prasetyo Bayu Widodo"
              size="sm"
              status="online"
            />
            <span className="text-xs font-medium text-[#c9d1d9] hidden lg:inline-block">
              prasetyobayu
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
