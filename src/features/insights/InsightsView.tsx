import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  GitCommit,
  GitPullRequest,
  CircleDot,
  Users,
  Code2,
  Calendar,
  Flame,
  TrendingUp,
} from '../../icons';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Contributor, RepoDetails } from '../../engine/types';

export interface InsightsViewProps {
  contributors: Contributor[];
  repoDetails: RepoDetails;
  totalCommits: number;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  contributors,
  repoDetails,
  totalCommits,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
  } | null>(null);

  // Generate 52 weeks x 7 days realistic commit matrix
  const contributionGrid = useMemo(() => {
    const weeks: { date: string; count: number; level: number }[][] = [];
    const today = new Date();

    for (let w = 51; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        // Pseudo-random realistic distribution with clusters
        const seed = (w * 7 + d * 13) % 100;
        let count = 0;
        if (seed > 85) count = Math.floor(Math.random() * 8 + 4);
        else if (seed > 60) count = Math.floor(Math.random() * 4 + 1);
        else if (seed > 40) count = 1;

        let level = 0;
        if (count >= 6) level = 4;
        else if (count >= 4) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;

        days.push({ date: dateStr, count, level });
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const totalYearContributions = useMemo(() => {
    return contributionGrid.reduce(
      (acc, week) => acc + week.reduce((dAcc, day) => dAcc + day.count, 0),
      0
    );
  }, [contributionGrid]);

  const levelColorMap = {
    0: 'bg-[#161b22] border-[#30363d]/40',
    1: 'bg-[#0e4429] border-[#0e4429]',
    2: 'bg-[#006d32] border-[#006d32]',
    3: 'bg-[#26a641] border-[#26a641]',
    4: 'bg-[#39d353] border-[#39d353]',
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Top Pulse Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8b949e]">Total Commits</span>
            <div className="text-xl font-bold text-[#f0f6fc] mt-1">{totalCommits}</div>
            <span className="text-[11px] text-[#3fb950] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14% this month
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#21262d] text-[#58a6ff]">
            <GitCommit className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8b949e]">Pull Requests Merged</span>
            <div className="text-xl font-bold text-[#f0f6fc] mt-1">82</div>
            <span className="text-[11px] text-[#a371f7] flex items-center gap-1 mt-1">
              100% acceptance rate
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#21262d] text-[#a371f7]">
            <GitPullRequest className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8b949e]">Issues Closed</span>
            <div className="text-xl font-bold text-[#f0f6fc] mt-1">39</div>
            <span className="text-[11px] text-[#3fb950] flex items-center gap-1 mt-1">
              Avg resolution: 4.2 hours
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#21262d] text-[#3fb950]">
            <CircleDot className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8b949e]">Active Contributors</span>
            <div className="text-xl font-bold text-[#f0f6fc] mt-1">{contributors.length}</div>
            <span className="text-[11px] text-[#58a6ff] flex items-center gap-1 mt-1">
              4 maintainers
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#21262d] text-[#e3b341]">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* GitHub Contribution Heatmap Grid */}
      <div className="border border-[#30363d] rounded-lg bg-[#161b22] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#58a6ff]" />
              <span>{totalYearContributions} contributions in the last year</span>
            </h3>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Activity snapshot across all branches and pull requests
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className={`w-3 h-3 rounded-xs border ${
                  levelColorMap[lvl as keyof typeof levelColorMap]
                }`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* 52-week horizontal matrix */}
        <div className="overflow-x-auto pb-2 w-full max-w-full block">
          <div className="flex gap-[3px] min-w-[720px]">
            {contributionGrid.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredCell({ date: day.date, count: day.count })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`w-3 h-3 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${
                      levelColorMap[day.level as keyof typeof levelColorMap]
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hover Tooltip display */}
        <div className="h-5 text-xs text-[#8b949e] mt-2">
          {hoveredCell ? (
            <span className="text-[#f0f6fc] font-medium">
              {hoveredCell.count === 0 ? 'No' : hoveredCell.count} contribution
              {hoveredCell.count !== 1 ? 's' : ''} on {hoveredCell.date}
            </span>
          ) : (
            <span>Hover over any square to see details</span>
          )}
        </div>
      </div>

      {/* Languages & Contributors row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contributors List */}
        <div className="lg:col-span-8 border border-[#30363d] rounded-lg bg-[#161b22] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#30363d] text-xs font-semibold text-[#f0f6fc]">
            Top Contributors
          </div>

          <div className="divide-y divide-[#30363d]/60">
            {contributors.map((c, idx) => (
              <div
                key={c.username}
                className="px-4 py-3 flex items-center justify-between text-xs hover:bg-[#21262d]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#8b949e] w-4 text-center">#{idx + 1}</span>
                  <Avatar src={c.avatar} name={c.name} size="md" />
                  <div>
                    <div className="font-semibold text-[#f0f6fc] flex items-center gap-2">
                      <span>{c.name}</span>
                      <span className="text-[#8b949e] font-normal font-mono">@{c.username}</span>
                    </div>
                    <span className="text-[#8b949e] text-[11px]">{c.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-[#f0f6fc]">
                    {c.commitsCount} commits
                  </div>
                  <div className="text-[11px] font-mono">
                    <span className="text-[#3fb950]">+{c.additions}</span>{' '}
                    <span className="text-[#f85149]">-{c.deletions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Summary Card */}
        <div className="lg:col-span-4 border border-[#30363d] rounded-lg bg-[#161b22] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#f0f6fc] flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#58a6ff]" />
            <span>Repository Languages</span>
          </h3>

          <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#21262d]">
            {repoDetails.languages.map((l) => (
              <div
                key={l.name}
                style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                title={`${l.name}: ${l.percentage}%`}
              />
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            {repoDetails.languages.map((l) => (
              <div key={l.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="font-medium text-[#f0f6fc]">{l.name}</span>
                </div>
                <span className="text-[#8b949e] font-mono font-medium">{l.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
