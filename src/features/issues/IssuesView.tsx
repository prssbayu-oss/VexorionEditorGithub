import React, { useState } from 'react';
import {
  CircleDot,
  CheckCircle2,
  MessageSquare,
  Search,
  Plus,
  ArrowLeft,
  Tag,
  Milestone,
  User,
  Send,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input, TextArea } from '../../components/Input';
import { Avatar } from '../../components/Avatar';
import { Modal } from '../../components/Modal';
import { Issue } from '../../engine/types';

export interface IssuesViewProps {
  issues: Issue[];
  onAddIssue: (title: string, body: string, labels: string[]) => void;
  onAddComment: (issueId: number, content: string) => void;
  onToggleIssueState: (issueId: number) => void;
}

export const IssuesView: React.FC<IssuesViewProps> = ({
  issues,
  onAddIssue,
  onAddComment,
  onToggleIssueState,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [stateFilter, setStateFilter] = useState<'open' | 'closed'>('open');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New Issue Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newSelectedLabels, setNewSelectedLabels] = useState<string[]>(['enhancement']);

  // Add Comment input
  const [newCommentText, setNewCommentText] = useState('');

  const openIssues = issues.filter((i) => i.state === 'open');
  const closedIssues = issues.filter((i) => i.state === 'closed');

  const filteredIssues = issues.filter((issue) => {
    if (issue.state !== stateFilter) return false;
    if (selectedLabel && !issue.labels.some((l) => l.name === selectedLabel)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchId = issue.id.toString().includes(q);
      return matchTitle || matchId;
    }
    return true;
  });

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddIssue(newTitle.trim(), newBody.trim(), newSelectedLabels);
    setNewTitle('');
    setNewBody('');
    setIsNewModalOpen(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !newCommentText.trim()) return;
    onAddComment(selectedIssue.id, newCommentText.trim());
    setNewCommentText('');
  };

  const availableLabels = [
    { name: 'enhancement', color: '#a2eeef' },
    { name: 'bug', color: '#d73a4a' },
    { name: 'ui/ux', color: '#58a6ff' },
    { name: 'documentation', color: '#0075ca' },
    { name: 'good first issue', color: '#7057ff' },
  ];

  // Detail View
  if (selectedIssue) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 w-full max-w-full overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedIssueId(null)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to all issues
        </Button>

        {/* Issue Header */}
        <div className="border-b border-[#30363d] pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-[#f0f6fc]">
              {selectedIssue.title}{' '}
              <span className="text-[#8b949e] font-normal">#{selectedIssue.id}</span>
            </h1>

            <Button
              variant={selectedIssue.state === 'open' ? 'danger' : 'success'}
              size="sm"
              onClick={() => onToggleIssueState(selectedIssue.id)}
            >
              {selectedIssue.state === 'open' ? 'Close issue' : 'Reopen issue'}
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-[#8b949e]">
            <Badge
              variant={selectedIssue.state === 'open' ? 'success' : 'purple'}
              size="md"
              icon={
                selectedIssue.state === 'open' ? (
                  <CircleDot className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )
              }
            >
              {selectedIssue.state === 'open' ? 'Open' : 'Closed'}
            </Badge>

            <span>
              <strong className="text-[#c9d1d9]">{selectedIssue.author.username}</strong> opened this issue {selectedIssue.createdAt}
            </span>
            <span>•</span>
            <span>{selectedIssue.comments.length + 1} comments</span>

            {selectedIssue.milestone && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#c9d1d9]">
                  <Milestone className="w-3.5 h-3.5 text-[#8b949e]" />
                  {selectedIssue.milestone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Conversation Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            {/* Opener Post */}
            <div className="flex gap-3">
              <Avatar
                src={selectedIssue.author.avatar}
                name={selectedIssue.author.name}
                size="md"
              />
              <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f0f6fc]">
                      {selectedIssue.author.username}
                    </span>
                    <span className="text-[#8b949e]">commented {selectedIssue.createdAt}</span>
                  </div>
                  <Badge variant="outline" size="xs">
                    Author
                  </Badge>
                </div>
                <div className="p-4 text-xs md:text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">
                  {selectedIssue.body}
                </div>
              </div>
            </div>

            {/* Subsequent comments */}
            {selectedIssue.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar
                  src={comment.author.avatar}
                  name={comment.author.name}
                  size="md"
                />
                <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#f0f6fc]">
                        {comment.author.username}
                      </span>
                      <span className="text-[#8b949e]">commented {comment.createdAt}</span>
                    </div>
                    {comment.author.role && (
                      <Badge variant="outline" size="xs">
                        {comment.author.role}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 text-xs md:text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="flex gap-3 pt-3">
              <Avatar
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                name="Luxarion"
                size="md"
              />
              <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs font-medium text-[#c9d1d9]">
                  Add a comment
                </div>
                <div className="p-3">
                  <textarea
                    rows={3}
                    placeholder="Leave a comment (supports Markdown)..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-[#0d1117] text-xs md:text-sm text-[#f0f6fc] border border-[#30363d] rounded-md p-3 focus:outline-none focus:border-[#58a6ff] leading-relaxed"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      disabled={!newCommentText.trim()}
                      icon={<Send className="w-3.5 h-3.5" />}
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Labels, Assignees, Milestone */}
          <div className="lg:col-span-4 space-y-5 text-xs text-[#8b949e]">
            <div className="border-b border-[#30363d] pb-4">
              <h4 className="font-semibold text-xs text-[#c9d1d9] mb-2">Assignees</h4>
              {selectedIssue.assignees.length === 0 ? (
                <span>No one assigned</span>
              ) : (
                <div className="space-y-1.5">
                  {selectedIssue.assignees.map((a) => (
                    <div key={a.username} className="flex items-center gap-2 text-[#f0f6fc]">
                      <Avatar src={a.avatar} name={a.name} size="xs" />
                      <span>{a.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-[#30363d] pb-4">
              <h4 className="font-semibold text-xs text-[#c9d1d9] mb-2">Labels</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedIssue.labels.map((l) => (
                  <span
                    key={l.name}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium border"
                    style={{
                      backgroundColor: `${l.color}20`,
                      borderColor: `${l.color}50`,
                      color: l.color,
                    }}
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-[#c9d1d9] mb-1">Milestone</h4>
              <span>{selectedIssue.milestone || 'No milestone'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 w-full max-w-full overflow-hidden">
      {/* Controls Bar: Search & New Issue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            icon={<Search className="w-3.5 h-3.5" />}
            placeholder="Search all issues by title or #id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New issue
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[#8b949e] font-medium mr-1 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Labels:
        </span>
        <button
          onClick={() => setSelectedLabel(null)}
          className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
            selectedLabel === null
              ? 'bg-[#21262d] text-[#f0f6fc] border-[#58a6ff]'
              : 'text-[#8b949e] border-[#30363d] hover:bg-[#21262d]'
          }`}
        >
          All
        </button>
        {availableLabels.map((l) => (
          <button
            key={l.name}
            onClick={() => setSelectedLabel(selectedLabel === l.name ? null : l.name)}
            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              selectedLabel === l.name
                ? 'border-[#58a6ff] font-semibold'
                : 'border-[#30363d] hover:bg-[#21262d]'
            }`}
            style={{
              backgroundColor: selectedLabel === l.name ? `${l.color}25` : undefined,
              color: selectedLabel === l.name ? l.color : '#c9d1d9',
            }}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Issues Table Container */}
      <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden">
        {/* Table Header with Open / Closed Switcher */}
        <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStateFilter('open')}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                stateFilter === 'open' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <CircleDot className="w-4 h-4 text-[#3fb950]" />
              <span>{openIssues.length} Open</span>
            </button>

            <button
              onClick={() => setStateFilter('closed')}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                stateFilter === 'closed' ? 'text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#a371f7]" />
              <span>{closedIssues.length} Closed</span>
            </button>
          </div>

          <span className="text-[#8b949e]">Sort by recently updated</span>
        </div>

        {/* Issue Rows */}
        <div className="divide-y divide-[#30363d]/60">
          {filteredIssues.length === 0 ? (
            <div className="py-12 text-center text-[#8b949e] space-y-2">
              <CircleDot className="w-8 h-8 mx-auto text-[#6e7681]" />
              <p className="font-semibold text-sm text-[#c9d1d9]">No matching issues found</p>
              <p className="text-xs">Try clearing the label filter or search query.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className="px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#161b22] cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">
                    {issue.state === 'open' ? (
                      <CircleDot className="w-4 h-4 text-[#3fb950]" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#a371f7]" />
                    )}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs md:text-sm font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                        {issue.title}
                      </span>

                      {issue.labels.map((l) => (
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

                    <div className="text-[11px] text-[#8b949e] flex items-center gap-1 flex-wrap">
                      <span>#{issue.id} opened {issue.createdAt} by {issue.author.username}</span>
                      {issue.milestone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Milestone className="w-3 h-3" />
                            {issue.milestone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {issue.commentsCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[#8b949e] shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{issue.commentsCount}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Issue Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create new issue"
        subtitle="Open a new bug report, feature request, or feedback"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#c9d1d9] block mb-1">
              Issue Title
            </label>
            <input
              type="text"
              required
              placeholder="Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#c9d1d9] block mb-1">
              Description (Markdown supported)
            </label>
            <textarea
              rows={5}
              placeholder="Provide a detailed description of the issue..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-3 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#c9d1d9] block mb-1.5">
              Select Labels
            </label>
            <div className="flex flex-wrap gap-2">
              {availableLabels.map((l) => {
                const isSelected = newSelectedLabels.includes(l.name);
                return (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setNewSelectedLabels(newSelectedLabels.filter((x) => x !== l.name));
                      } else {
                        setNewSelectedLabels([...newSelectedLabels, l.name]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${
                      isSelected ? 'ring-1 ring-[#58a6ff]' : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: `${l.color}20`,
                      borderColor: l.color,
                      color: l.color,
                    }}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#30363d]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit new issue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
