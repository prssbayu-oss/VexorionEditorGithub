import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  GitMerge,
  MessageSquare,
  Search,
  ArrowLeft,
  FileCode,
  Check,
  AlertCircle,
  Clock,
  Columns,
  AlignJustify,
  ShieldCheck,
  Tag,
  GitBranch,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Tabs } from '../../components/Tabs';
import { Input } from '../../components/Input';
import { PullRequest, DiffFile } from '../../engine/types';

export interface PullRequestsViewProps {
  pullRequests: PullRequest[];
  onMergePR: (prId: number) => void;
}

export const PullRequestsView: React.FC<PullRequestsViewProps> = ({
  pullRequests,
  onMergePR,
}) => {
  const [selectedPRId, setSelectedPRId] = useState<number | null>(null);
  const [stateFilter, setStateFilter] = useState<'open' | 'merged' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [prSubTab, setPrSubTab] = useState<'conversation' | 'files'>('conversation');
  const [diffMode, setDiffMode] = useState<'unified' | 'split'>('unified');

  const openPRs = pullRequests.filter((p) => p.state === 'open');
  const mergedPRs = pullRequests.filter((p) => p.state === 'merged');
  const closedPRs = pullRequests.filter((p) => p.state === 'closed');

  const filteredPRs = pullRequests.filter((pr) => {
    if (pr.state !== stateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pr.title.toLowerCase().includes(q) ||
        pr.id.toString().includes(q) ||
        pr.sourceBranch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedPR = pullRequests.find((p) => p.id === selectedPRId);

  // Detail View
  if (selectedPR) {
    const totalAdditions = selectedPR.diffFiles.reduce((acc, f) => acc + f.additions, 0);
    const totalDeletions = selectedPR.diffFiles.reduce((acc, f) => acc + f.deletions, 0);

    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 w-full max-w-full overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedPRId(null)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to all pull requests
        </Button>

        {/* PR Header */}
        <div className="border-b border-[#30363d] pb-4">
          <h1 className="text-xl md:text-2xl font-bold text-[#f0f6fc] flex items-center gap-3 flex-wrap">
            <span>{selectedPR.title}</span>
            <span className="text-[#8b949e] font-normal">#{selectedPR.id}</span>
          </h1>

          <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-[#8b949e]">
            {selectedPR.state === 'open' && (
              <Badge variant="success" size="md" icon={<GitPullRequest className="w-3.5 h-3.5" />}>
                Open
              </Badge>
            )}
            {selectedPR.state === 'merged' && (
              <Badge variant="purple" size="md" icon={<GitMerge className="w-3.5 h-3.5" />}>
                Merged
              </Badge>
            )}
            {selectedPR.state === 'closed' && (
              <Badge variant="danger" size="md" icon={<GitPullRequest className="w-3.5 h-3.5" />}>
                Closed
              </Badge>
            )}

            <span>
              <strong className="text-[#c9d1d9]">{selectedPR.author.username}</strong> wants to merge into{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#58a6ff] font-mono">
                {selectedPR.targetBranch}
              </code>{' '}
              from{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#58a6ff] font-mono">
                {selectedPR.sourceBranch}
              </code>
            </span>
          </div>

          {/* Sub tabs: Conversation vs Files changed */}
          <div className="flex items-center gap-4 mt-5 border-b border-[#30363d] text-xs font-semibold">
            <button
              onClick={() => setPrSubTab('conversation')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer relative ${
                prSubTab === 'conversation' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Conversation</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#21262d] text-[#8b949e]">
                {selectedPR.comments.length + 1}
              </span>
              {prSubTab === 'conversation' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fd8c73]" />
              )}
            </button>

            <button
              onClick={() => setPrSubTab('files')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer relative ${
                prSubTab === 'files' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Files changed</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#21262d] text-[#8b949e]">
                {selectedPR.diffFiles.length}
              </span>
              <span className="text-[11px] text-[#3fb950] font-mono">+{totalAdditions}</span>
              <span className="text-[11px] text-[#f85149] font-mono">-{totalDeletions}</span>
              {prSubTab === 'files' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fd8c73]" />
              )}
            </button>
          </div>
        </div>

        {/* Conversation Tab Content */}
        {prSubTab === 'conversation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              {/* PR Description Box */}
              <div className="flex gap-3">
                <Avatar
                  src={selectedPR.author.avatar}
                  name={selectedPR.author.name}
                  size="md"
                />
                <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#f0f6fc]">
                      {selectedPR.author.username}
                    </span>
                    <span className="text-[#8b949e]">created {selectedPR.createdAt}</span>
                  </div>
                  <div className="p-4 text-xs md:text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">
                    {selectedPR.body}
                  </div>
                </div>
              </div>

              {/* Reviewer Comments */}
              {selectedPR.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar
                    src={comment.author.avatar}
                    name={comment.author.name}
                    size="md"
                  />
                  <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#f0f6fc]">
                        {comment.author.username}
                      </span>
                      <Badge variant="outline" size="xs">
                        Reviewer
                      </Badge>
                    </div>
                    <div className="p-4 text-xs md:text-sm text-[#c9d1d9] leading-relaxed">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* CI Checks Card & Merge Status */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#3fb950]" />
                    <span className="text-sm font-semibold text-[#f0f6fc]">
                      All checks have passed ({selectedPR.checks.length}/{selectedPR.checks.length})
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    Checks passed
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  {selectedPR.checks.map((chk) => (
                    <div key={chk.name} className="flex items-center justify-between text-[#c9d1d9]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                        <span>{chk.name}</span>
                      </div>
                      <span className="text-[#8b949e] font-mono">{chk.duration}</span>
                    </div>
                  ))}
                </div>

                {/* Merge Action Button */}
                <div className="pt-3 border-t border-[#30363d] flex items-center justify-between flex-wrap gap-3">
                  {selectedPR.state === 'open' ? (
                    <>
                      <div className="text-xs text-[#8b949e]">
                        This branch has no conflicts with the base branch <code className="text-[#58a6ff]">main</code>.
                      </div>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => onMergePR(selectedPR.id)}
                        icon={<GitMerge className="w-4 h-4" />}
                      >
                        Merge pull request
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#a371f7] font-semibold">
                      <GitMerge className="w-4 h-4" />
                      <span>Pull request successfully merged and closed.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Reviewers & Labels */}
            <div className="lg:col-span-4 space-y-5 text-xs text-[#8b949e]">
              <div className="border-b border-[#30363d] pb-4">
                <h4 className="font-semibold text-xs text-[#c9d1d9] mb-2">Reviewers</h4>
                <div className="space-y-2">
                  {selectedPR.reviewers.map((r) => (
                    <div key={r.username} className="flex items-center justify-between text-[#c9d1d9]">
                      <div className="flex items-center gap-2">
                        <Avatar src={r.avatar} name={r.username} size="xs" />
                        <span>{r.username}</span>
                      </div>
                      {r.status === 'approved' ? (
                        <span className="text-[#3fb950] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="text-[#8b949e]">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#c9d1d9] mb-2">Labels</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPR.labels.map((l) => (
                    <span
                      key={l.name}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium border"
                      style={{
                        backgroundColor: `${l.color}15`,
                        borderColor: `${l.color}40`,
                        color: l.color,
                      }}
                    >
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files Changed (Interactive Diff Viewer) */}
        {prSubTab === 'files' && (
          <div className="space-y-6">
            {/* Diff toolbar: View mode toggle */}
            <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#f0f6fc]">
                  Showing {selectedPR.diffFiles.length} changed files
                </span>
                <span className="text-[#3fb950] font-mono">+{totalAdditions} lines</span>
                <span className="text-[#f85149] font-mono">-{totalDeletions} lines</span>
              </div>

              {/* Segmented View Mode Toggle: Unified vs Split */}
              <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md p-0.5">
                <button
                  onClick={() => setDiffMode('unified')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    diffMode === 'unified'
                      ? 'bg-[#21262d] text-[#f0f6fc] font-semibold'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                  <span>Unified</span>
                </button>
                <button
                  onClick={() => setDiffMode('split')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    diffMode === 'split'
                      ? 'bg-[#21262d] text-[#f0f6fc] font-semibold'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split</span>
                </button>
              </div>
            </div>

            {/* Render Each Changed File Diff */}
            {selectedPR.diffFiles.map((file, fileIdx) => (
              <div
                key={fileIdx}
                className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden shadow-xs"
              >
                {/* File Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs">
                  <div className="flex items-center gap-2 font-mono font-medium text-[#f0f6fc]">
                    <FileCode className="w-4 h-4 text-[#58a6ff]" />
                    <span>{file.newPath}</span>
                    <span className="text-[#8b949e] font-normal text-[11px] ml-2">
                      ({file.status})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#3fb950]">+{file.additions}</span>
                    <span className="text-[#f85149]">-{file.deletions}</span>
                  </div>
                </div>

                {/* Diff lines */}
                <div className="overflow-x-auto text-xs font-mono leading-5">
                  <table className="w-full border-collapse">
                    <tbody>
                      {file.hunks.map((hunk, hIdx) => (
                        <React.Fragment key={hIdx}>
                          {/* Hunk Header */}
                          <tr className="bg-[#1b222c] text-[#58a6ff] border-y border-[#30363d]/40">
                            <td colSpan={diffMode === 'split' ? 4 : 3} className="px-4 py-1 select-none font-semibold">
                              {hunk.header}
                            </td>
                          </tr>

                          {/* Lines */}
                          {hunk.lines.map((line, lIdx) => {
                            const isAdd = line.type === 'add';
                            const isDelete = line.type === 'delete';

                            const rowBg = isAdd
                              ? 'bg-[rgba(46,160,67,0.15)] text-[#e6edf3]'
                              : isDelete
                              ? 'bg-[rgba(248,81,73,0.15)] text-[#e6edf3]'
                              : 'text-[#8b949e]';

                            const signChar = isAdd ? '+' : isDelete ? '-' : ' ';

                            return (
                              <tr key={lIdx} className={`hover:bg-[#21262d]/50 ${rowBg}`}>
                                <td className="w-12 px-3 text-right text-[#6e7681] select-none border-r border-[#30363d]/30">
                                  {line.oldLineNumber || ''}
                                </td>
                                <td className="w-12 px-3 text-right text-[#6e7681] select-none border-r border-[#30363d]/30">
                                  {line.newLineNumber || ''}
                                </td>
                                <td className="w-6 text-center select-none font-bold">
                                  <span
                                    className={
                                      isAdd
                                        ? 'text-[#3fb950]'
                                        : isDelete
                                        ? 'text-[#f85149]'
                                        : 'text-transparent'
                                    }
                                  >
                                    {signChar}
                                  </span>
                                </td>
                                <td className="px-3 whitespace-pre font-mono select-text">
                                  {line.content}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 w-full max-w-full overflow-hidden">
      {/* Controls: Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            icon={<Search className="w-3.5 h-3.5" />}
            placeholder="Search all pull requests by title or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pull Requests Table */}
      <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden">
        {/* Header Tabs */}
        <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStateFilter('open')}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                stateFilter === 'open' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <GitPullRequest className="w-4 h-4 text-[#3fb950]" />
              <span>{openPRs.length} Open</span>
            </button>

            <button
              onClick={() => setStateFilter('merged')}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                stateFilter === 'merged' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <GitMerge className="w-4 h-4 text-[#a371f7]" />
              <span>{mergedPRs.length} Merged</span>
            </button>

            <button
              onClick={() => setStateFilter('closed')}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                stateFilter === 'closed' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#8b949e]" />
              <span>{closedPRs.length} Closed</span>
            </button>
          </div>

          <span className="text-[#8b949e]">Sort by recently created</span>
        </div>

        {/* PR rows */}
        <div className="divide-y divide-[#30363d]/60">
          {filteredPRs.length === 0 ? (
            <div className="py-12 text-center text-[#8b949e] space-y-2">
              <GitPullRequest className="w-8 h-8 mx-auto text-[#6e7681]" />
              <p className="font-semibold text-sm text-[#c9d1d9]">No pull requests found</p>
              <p className="text-xs">There are no {stateFilter} pull requests in this view.</p>
            </div>
          ) : (
            filteredPRs.map((pr) => (
              <div
                key={pr.id}
                onClick={() => setSelectedPRId(pr.id)}
                className="px-4 py-3.5 flex items-start justify-between gap-3 hover:bg-[#161b22] cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">
                    {pr.state === 'open' && (
                      <GitPullRequest className="w-4 h-4 text-[#3fb950]" />
                    )}
                    {pr.state === 'merged' && (
                      <GitMerge className="w-4 h-4 text-[#a371f7]" />
                    )}
                    {pr.state === 'closed' && (
                      <GitPullRequest className="w-4 h-4 text-[#f85149]" />
                    )}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs md:text-sm font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                        {pr.title}
                      </span>
                      {pr.labels.map((l) => (
                        <span
                          key={l.name}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                          style={{
                            backgroundColor: `${l.color}15`,
                            borderColor: `${l.color}40`,
                            color: l.color,
                          }}
                        >
                          {l.name}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#8b949e] flex items-center gap-1.5 flex-wrap">
                      <span>#{pr.id} opened {pr.createdAt} by {pr.author.username}</span>
                      <span>•</span>
                      <span className="font-mono text-[#58a6ff]">{pr.sourceBranch}</span>
                      <span>➔</span>
                      <span className="font-mono text-[#c9d1d9]">{pr.targetBranch}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  {pr.commentsCount > 0 && (
                    <div className="flex items-center gap-1 text-[#8b949e]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{pr.commentsCount}</span>
                    </div>
                  )}

                  <div className="hidden sm:flex items-center gap-1 text-[#3fb950]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
