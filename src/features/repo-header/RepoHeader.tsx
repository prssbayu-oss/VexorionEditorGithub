import React from 'react';
import {
  Star,
  GitFork,
  Eye,
  Heart,
  Code2,
  CircleDot,
  GitPullRequest,
  PlayCircle,
  BarChart2,
  BookOpen,
  Pin,
  ExternalLink,
  RefreshCw,
} from '../../icons';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Tabs, TabItem } from '../../components/Tabs';
import { RepoDetails } from '../../engine/types';

export interface RepoHeaderProps {
  details: RepoDetails;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  openIssuesCount: number;
  openPRsCount: number;
  onToggleStar: () => void;
  onToggleFork: () => void;
  isSyncing?: boolean;
  onSyncNow?: () => void;
}

export const RepoHeader: React.FC<RepoHeaderProps> = ({
  details,
  activeTab,
  onTabChange,
  openIssuesCount,
  openPRsCount,
  onToggleStar,
  onToggleFork,
  isSyncing = false,
  onSyncNow,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'code',
      label: 'Code',
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: 'issues',
      label: 'Issues',
      icon: <CircleDot className="w-4 h-4" />,
      count: openIssuesCount,
    },
    {
      id: 'pulls',
      label: 'Pull requests',
      icon: <GitPullRequest className="w-4 h-4" />,
      count: openPRsCount,
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: <PlayCircle className="w-4 h-4" />,
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <BarChart2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#161b22] border-b border-[#30363d] pt-3 sm:pt-4 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Top title & action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <BookOpen className="w-4 h-4 text-[#8b949e] shrink-0" />
            <a
              href={`https://github.com/${details.owner}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm md:text-base text-[#58a6ff] hover:underline font-medium shrink-0"
            >
              {details.owner}
            </a>
            <span className="text-[#8b949e] shrink-0">/</span>
            <a
              href={`https://github.com/${details.owner}/${details.name}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm md:text-base text-[#58a6ff] hover:underline font-bold break-all"
            >
              {details.name}
            </a>

            <Badge variant="outline" size="xs" className="text-[#8b949e] shrink-0">
              Public
            </Badge>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#8b949e] ml-1 shrink-0">
              <Pin className="w-3 h-3 text-[#d29922]" /> Pinned
            </span>
          </div>

          {/* Social action buttons & Live Sync */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto justify-start sm:justify-end shrink-0">
            {onSyncNow && (
              <Button
                variant="outline"
                size="xs"
                onClick={onSyncNow}
                disabled={isSyncing}
                icon={
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isSyncing ? 'animate-spin text-[#58a6ff]' : 'text-[#3fb950]'
                    }`}
                  />
                }
                className="border-[#3fb950]/40 text-[#c9d1d9] hover:bg-[#238636]/15 hover:border-[#3fb950]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                  <span className="text-[11px] font-medium whitespace-nowrap">
                    {isSyncing ? 'Syncing...' : 'Live Sync'}
                  </span>
                </span>
              </Button>
            )}

            <a
              href={`https://github.com/${details.owner}/${details.name}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#8b949e] hover:text-[#58a6ff] transition-colors shrink-0 px-2 py-1 rounded border border-[#30363d] bg-[#21262d] hover:bg-[#30363d]"
              title="Open repository on GitHub.com"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden md:inline">GitHub</span>
            </a>
            <Button
              variant="outline"
              size="xs"
              icon={<Eye className="w-3.5 h-3.5 text-[#8b949e]" />}
            >
              Watch
              <span className="ml-1 text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full bg-[#21262d] text-[#8b949e]">
                {details.watchersCount}
              </span>
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={onToggleFork}
              icon={<GitFork className="w-3.5 h-3.5 text-[#8b949e]" />}
            >
              Fork
              <span className="ml-1 text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full bg-[#21262d] text-[#8b949e]">
                {details.forksCount}
              </span>
            </Button>

            <Button
              variant={details.isStarred ? 'primary' : 'outline'}
              size="xs"
              onClick={onToggleStar}
              icon={
                <Star
                  className={`w-3.5 h-3.5 ${
                    details.isStarred ? 'text-[#e3b341] fill-[#e3b341]' : 'text-[#8b949e]'
                  }`}
                />
              }
            >
              {details.isStarred ? 'Starred' : 'Star'}
              <span
                className={`ml-1 text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full ${
                  details.isStarred ? 'bg-[#2ea043] text-white' : 'bg-[#21262d] text-[#8b949e]'
                }`}
              >
                {details.starsCount}
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
      </div>
    </div>
  );
};
