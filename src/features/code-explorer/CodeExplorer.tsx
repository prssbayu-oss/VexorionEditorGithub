import React, { useState } from 'react';
import {
  GitBranch,
  Folder,
  FileCode,
  FileText,
  FileSpreadsheet,
  File,
  History,
  Download,
  Copy,
  Check,
  Plus,
  Terminal,
  ExternalLink,
  Tag,
  Shield,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  Scale,
  ArrowLeft,
  Edit3,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { CodeViewer } from '../../components/CodeViewer';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { RepoFile, GitBranch as GitBranchType, GitCommit, RepoDetails, Contributor } from '../../engine/types';
import { parseMarkdown } from '../../engine/markdownEngine';

export interface CodeExplorerProps {
  files: RepoFile[];
  branches: GitBranchType[];
  currentBranch: string;
  onSwitchBranch: (branch: string) => void;
  onCreateBranch: (branchName: string) => boolean;
  latestCommit: GitCommit;
  totalCommitsCount: number;
  repoDetails: RepoDetails;
  contributors: Contributor[];
  onCommitFileChange: (filePath: string, newContent: string, message: string) => void;
  onOpenCommandPalette: () => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  files,
  branches,
  currentBranch,
  onSwitchBranch,
  onCreateBranch,
  latestCommit,
  totalCommitsCount,
  repoDetails,
  contributors,
  onCommitFileChange,
  onOpenCommandPalette,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [cloneProtocol, setCloneProtocol] = useState<'https' | 'ssh' | 'cli'>('https');
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // New Branch Modal
  const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  // Edit / Add file modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFileContent, setEditFileContent] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

  // Find node by path
  const findNode = (nodes: RepoFile[], targetPath: string): RepoFile | null => {
    for (const node of nodes) {
      if (node.path === targetPath) return node;
      if (node.type === 'directory' && node.children) {
        const found = findNode(node.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  // Get current directory files
  const getCurrentDirFiles = (): RepoFile[] => {
    if (!currentPath) return files;
    const node = findNode(files, currentPath);
    if (node && node.type === 'directory' && node.children) {
      return node.children;
    }
    return [];
  };

  // Navigate into path
  const handleNavigatePath = (path: string) => {
    setCurrentPath(path);
    if (!path) {
      setSelectedFile(null);
      return;
    }
    const node = findNode(files, path);
    if (node && node.type === 'file') {
      setSelectedFile(node);
    } else {
      setSelectedFile(null);
    }
  };

  // Navigate to parent directory
  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    const parentPath = parts.join('/');
    handleNavigatePath(parentPath);
  };

  const getFileIcon = (file: RepoFile) => {
    if (file.type === 'directory') {
      return <Folder className="w-4 h-4 text-[#58a6ff] fill-[#58a6ff]/20" />;
    }
    if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      return <FileCode className="w-4 h-4 text-[#58a6ff]" />;
    }
    if (file.name.endsWith('.json')) {
      return <FileSpreadsheet className="w-4 h-4 text-[#d29922]" />;
    }
    if (file.name.endsWith('.md')) {
      return <BookOpen className="w-4 h-4 text-[#3fb950]" />;
    }
    return <FileText className="w-4 h-4 text-[#8b949e]" />;
  };

  const cloneCommands = {
    https: `https://github.com/${repoDetails.owner}/${repoDetails.name}.git`,
    ssh: `git@github.com:${repoDetails.owner}/${repoDetails.name}.git`,
    cli: `gh repo clone ${repoDetails.owner}/${repoDetails.name}`,
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommands[cloneProtocol]);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(latestCommit.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    onCreateBranch(newBranchName.trim());
    setNewBranchName('');
    setIsNewBranchModalOpen(false);
  };

  const handleOpenEdit = () => {
    if (!selectedFile) return;
    setEditFileContent(selectedFile.content || '');
    setCommitMessage(`Update ${selectedFile.name}`);
    setIsEditModalOpen(true);
  };

  const handleSaveCommit = () => {
    if (!selectedFile) return;
    onCommitFileChange(selectedFile.path, editFileContent, commitMessage);
    setIsEditModalOpen(false);
    // Update local selected file view
    setSelectedFile({
      ...selectedFile,
      content: editFileContent,
      lastCommitMessage: commitMessage,
      lastCommitTime: 'just now',
    });
  };

  // Find README file if at root
  const rootReadme = files.find((f) => f.name.toLowerCase() === 'readme.md');
  const readmeBlocks = rootReadme?.content ? parseMarkdown(rootReadme.content) : [];

  const currentDirFiles = getCurrentDirFiles();
  // Sort: directories first, then files alphabetically
  const sortedFiles = [...currentDirFiles].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Top action bar: Branch switcher, breadcrumbs, Go to file, Code clone button */}
      <div className="flex flex-col gap-2.5 mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 shrink-0">
            {/* Branch Dropdown */}
            <Dropdown
              icon={<GitBranch className="w-3.5 h-3.5" />}
              label={currentBranch}
              headerTitle="Switch branches / tags"
              searchable
              searchPlaceholder="Find or create a branch..."
              items={branches.map((b) => ({
                id: b.name,
                label: b.name,
                isDefault: b.isDefault,
                icon: <GitBranch className="w-3.5 h-3.5" />,
              }))}
              selectedId={currentBranch}
              onSelect={(item) => onSwitchBranch(item.id)}
            />

            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsNewBranchModalOpen(true)}
              icon={<Plus className="w-3 h-3 text-[#58a6ff]" />}
              className="text-[11px]"
            >
              New Branch
            </Button>
          </div>

          {/* Right buttons: Go to file, Add file, Code clone */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="xs"
              onClick={onOpenCommandPalette}
              icon={<Search className="w-3.5 h-3.5 text-[#8b949e]" />}
            >
              Go to file
            </Button>

            <Button
              variant="primary"
              size="xs"
              onClick={() => setIsCloneModalOpen(true)}
              icon={<Terminal className="w-3.5 h-3.5" />}
            >
              Code
            </Button>
          </div>
        </div>

        {/* Breadcrumb Path row */}
        <div className="flex items-center gap-2 min-w-0 py-0.5 overflow-hidden">
          <Breadcrumbs
            currentPath={currentPath}
            repoName={repoDetails.name}
            onNavigate={handleNavigatePath}
          />
        </div>
      </div>

      {/* Main Grid: Code view on left (8 cols), Repo Details & Insights sidebar on right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full">
        <div className="lg:col-span-9 space-y-4 sm:space-y-5 min-w-0">
          {/* Latest commit banner */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <Avatar
                src={latestCommit.author.avatar}
                name={latestCommit.author.name}
                size="sm"
              />
              <span className="font-semibold text-[#f0f6fc] shrink-0 text-xs">
                {latestCommit.author.username}
              </span>
              <span className="text-[#c9d1d9] truncate min-w-0 text-xs" title={latestCommit.message}>
                {latestCommit.message}
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 text-[#8b949e] text-[11px] sm:text-xs">
              <span className="shrink-0">{latestCommit.timestamp}</span>

              <div className="flex items-center gap-1 bg-[#21262d] px-1.5 sm:px-2 py-0.5 rounded border border-[#30363d] font-mono text-[11px] shrink-0">
                <span className="text-[#58a6ff]">{latestCommit.shortHash}</span>
                <button
                  onClick={handleCopyHash}
                  className="hover:text-[#f0f6fc] p-0.5 cursor-pointer"
                  title="Copy full SHA"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-[#3fb950]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center gap-1 text-[#8b949e] shrink-0">
                <History className="w-3.5 h-3.5" />
                <span className="font-semibold text-[#c9d1d9]">{totalCommitsCount}</span>
                <span className="hidden sm:inline">commits</span>
              </div>
            </div>
          </div>

          {/* If a file is selected: Display CodeViewer & Edit button */}
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleNavigatePath(currentPath.split('/').slice(0, -1).join('/'))}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back to files
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleOpenEdit}
                  icon={<Edit3 className="w-3.5 h-3.5 text-[#58a6ff]" />}
                >
                  Edit file & Commit
                </Button>
              </div>

              <CodeViewer
                code={selectedFile.content || '// Empty file'}
                filename={selectedFile.name}
                language={selectedFile.language || 'typescript'}
              />
            </div>
          ) : (
            /* File Explorer Table */
            <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden w-full max-w-full">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <tbody>
                  {/* If in subdirectory, show parent folder row */}
                  {currentPath && (
                    <tr
                      onClick={handleNavigateUp}
                      className="border-b border-[#30363d] hover:bg-[#161b22] cursor-pointer transition-colors"
                    >
                      <td colSpan={3} className="py-2.5 px-3 sm:px-4 font-semibold text-[#58a6ff]">
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-[#58a6ff] shrink-0" />
                          <span>..</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {sortedFiles.map((file) => (
                    <tr
                      key={file.path}
                      onClick={() => handleNavigatePath(file.path)}
                      className="border-b border-[#30363d]/60 hover:bg-[#161b22] cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5 px-3 sm:px-4 font-medium text-[#c9d1d9] group-hover:text-[#58a6ff] min-w-0 w-auto">
                        <div className="flex items-center gap-2 min-w-0 truncate">
                          <span className="shrink-0">{getFileIcon(file)}</span>
                          <span className="truncate text-xs">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-[#8b949e] truncate hidden md:table-cell md:w-5/12 lg:w-1/2">
                        <span className="truncate block" title={file.lastCommitMessage}>
                          {file.lastCommitMessage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-right text-[#8b949e] whitespace-nowrap text-[11px] sm:text-xs w-20 sm:w-28 shrink-0">
                        {file.lastCommitTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* If at Root directory and NOT viewing a file: Render README preview directly beneath */}
          {!selectedFile && rootReadme && (
            <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d] text-xs font-semibold text-[#f0f6fc]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#3fb950]" />
                  <span>README.md</span>
                </div>
                <Badge variant="outline" size="sm">
                  Markdown
                </Badge>
              </div>

              <div className="p-6 text-sm text-[#c9d1d9] space-y-4">
                {readmeBlocks.map((block, idx) => {
                  if (block.type === 'heading') {
                    if (block.level === 1) {
                      return (
                        <h1 key={idx} className="text-2xl font-bold text-[#f0f6fc] pb-2 border-b border-[#30363d]">
                          {block.content}
                        </h1>
                      );
                    }
                    if (block.level === 2) {
                      return (
                        <h2 key={idx} className="text-lg font-bold text-[#f0f6fc] pt-3 pb-1 border-b border-[#30363d]/40">
                          {block.content}
                        </h2>
                      );
                    }
                    return (
                      <h3 key={idx} className="text-base font-semibold text-[#f0f6fc] pt-2">
                        {block.content}
                      </h3>
                    );
                  }
                  if (block.type === 'code') {
                    return (
                      <pre key={idx} className="p-3 bg-[#161b22] rounded-md font-mono text-xs text-[#a5d6ff] overflow-x-auto border border-[#30363d]">
                        <code>{block.content}</code>
                      </pre>
                    );
                  }
                  if (block.type === 'list' && block.items) {
                    return (
                      <ul key={idx} className="space-y-1.5 list-disc list-inside">
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-[#c9d1d9]">
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === 'hr') {
                    return <hr key={idx} className="border-[#30363d]" />;
                  }
                  return (
                    <p key={idx} className="leading-relaxed text-[#c9d1d9]">
                      {block.content}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: About & Metadata */}
        <div className="lg:col-span-3 space-y-6 text-xs text-[#8b949e]">
          <div>
            <h4 className="font-semibold text-sm text-[#f0f6fc] mb-2">About</h4>
            <p className="text-[#c9d1d9] leading-relaxed mb-3">{repoDetails.description}</p>
            {repoDetails.website && (
              <a
                href={repoDetails.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#58a6ff] hover:underline font-medium break-all mb-4"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>{repoDetails.website}</span>
              </a>
            )}

            {/* Topic tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {repoDetails.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 rounded-full bg-[rgba(56,139,253,0.12)] text-[#58a6ff] hover:bg-[rgba(56,139,253,0.2)] transition-colors cursor-pointer border border-[rgba(56,139,253,0.25)] font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="space-y-2 border-t border-[#30363d] pt-4">
              <div className="flex items-center gap-2 text-[#c9d1d9]">
                <Scale className="w-4 h-4 text-[#8b949e]" />
                <span>{repoDetails.license}</span>
              </div>
              <div className="flex items-center gap-2 text-[#c9d1d9]">
                <Shield className="w-4 h-4 text-[#8b949e]" />
                <span>Security policy active</span>
              </div>
              <div className="flex items-center gap-2 text-[#c9d1d9]">
                <Tag className="w-4 h-4 text-[#8b949e]" />
                <span>Release v2.4.0 (Latest)</span>
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="border-t border-[#30363d] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-[#f0f6fc]">
                Contributors
              </h4>
              <span className="px-1.5 py-0.5 rounded-full bg-[#21262d] text-[11px] font-medium text-[#c9d1d9]">
                {contributors.length}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {contributors.map((c) => (
                <div key={c.username} title={`${c.name} (${c.commitsCount} commits)`}>
                  <Avatar src={c.avatar} name={c.name} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Languages Breakdown */}
          <div className="border-t border-[#30363d] pt-4">
            <h4 className="font-semibold text-sm text-[#f0f6fc] mb-2.5">Languages</h4>
            {/* Progress bar */}
            <div className="h-2 w-full rounded-full overflow-hidden flex mb-3 bg-[#21262d]">
              {repoDetails.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            {/* Labels */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {repoDetails.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-semibold text-[#f0f6fc]">{lang.name}</span>
                  <span className="text-[#8b949e]">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clone Repo Modal */}
      <Modal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        title="Clone repository"
        subtitle="Clone this repository to your local machine using Git"
      >
        <div className="space-y-4">
          <div className="flex items-center border-b border-[#30363d] gap-2 pb-2">
            {(['https', 'ssh', 'cli'] as const).map((proto) => (
              <button
                key={proto}
                onClick={() => setCloneProtocol(proto)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase cursor-pointer transition-colors ${
                  cloneProtocol === proto
                    ? 'bg-[#21262d] text-[#58a6ff]'
                    : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={cloneCommands[cloneProtocol]}
              className="flex-1 min-w-0 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs font-mono text-[#c9d1d9] focus:outline-none"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyClone}
              icon={copiedClone ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedClone ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="pt-2 border-t border-[#30363d] flex justify-between items-center text-xs">
            <span className="text-[#8b949e]">Looking for an offline archive?</span>
            <Button
              variant="outline"
              size="xs"
              icon={<Download className="w-3 h-3" />}
              onClick={() => {
                alert('ZIP archive download initiated for ' + repoDetails.name + '.zip');
              }}
            >
              Download ZIP
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Branch Modal */}
      <Modal
        isOpen={isNewBranchModalOpen}
        onClose={() => setIsNewBranchModalOpen(false)}
        title="Create new branch"
        subtitle={`Branch off from ${currentBranch}`}
      >
        <form onSubmit={handleCreateBranchSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#c9d1d9] block mb-1.5">
              Branch Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. feature/new-component"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsNewBranchModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create branch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit file & commit modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${selectedFile?.name}`}
        subtitle="Commit your changes directly to the Git repository engine"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#c9d1d9] block mb-1">
              File Content
            </label>
            <textarea
              value={editFileContent}
              onChange={(e) => setEditFileContent(e.target.value)}
              className="w-full h-64 bg-[#0d1117] text-xs font-mono text-[#c9d1d9] p-3 border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
              spellCheck={false}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#c9d1d9] block mb-1">
              Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#30363d]">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveCommit}>
              Commit changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
