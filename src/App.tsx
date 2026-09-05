/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { repoEngine } from './engine/gitEngine';
import { Navbar } from './features/repo-header/Navbar';
import { RepoHeader } from './features/repo-header/RepoHeader';
import { CodeExplorer } from './features/code-explorer/CodeExplorer';
import { IssuesView } from './features/issues/IssuesView';
import { PullRequestsView } from './features/pull-requests/PullRequestsView';
import { ActionsView } from './features/actions/ActionsView';
import { InsightsView } from './features/insights/InsightsView';
import { CommandPalette } from './features/command-palette/CommandPalette';
import { Github, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('code');
  const [currentBranch, setCurrentBranch] = useState<string>(repoEngine.currentBranch);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'dimmed'>('dark');

  // Trigger state refreshes when engine updates
  const [, setVersion] = useState<number>(0);
  const triggerUpdate = () => setVersion((v) => v + 1);

  // Handlers for Git state mutations
  const handleSwitchBranch = (branch: string) => {
    if (repoEngine.switchBranch(branch)) {
      setCurrentBranch(branch);
      triggerUpdate();
    }
  };

  const handleCreateBranch = (branchName: string) => {
    const success = repoEngine.createBranch(branchName, currentBranch);
    if (success) {
      setCurrentBranch(branchName);
      triggerUpdate();
    }
    return success;
  };

  const handleToggleStar = () => {
    repoEngine.toggleStar();
    triggerUpdate();
  };

  const handleToggleFork = () => {
    repoEngine.toggleFork();
    triggerUpdate();
  };

  const handleCommitFileChange = (filePath: string, newContent: string, message: string) => {
    repoEngine.addCommit(message, filePath, newContent);
    triggerUpdate();
  };

  const handleAddIssue = (title: string, body: string, labels: string[]) => {
    repoEngine.addIssue(title, body, labels);
    triggerUpdate();
  };

  const handleAddComment = (issueId: number, content: string) => {
    repoEngine.addCommentToIssue(issueId, content);
    triggerUpdate();
  };

  const handleToggleIssueState = (issueId: number) => {
    repoEngine.toggleIssueState(issueId);
    triggerUpdate();
  };

  const handleMergePR = (prId: number) => {
    repoEngine.mergePullRequest(prId);
    triggerUpdate();
  };

  const files = repoEngine.getFiles(currentBranch);
  const latestCommit = repoEngine.commits[0];
  const openIssuesCount = repoEngine.issues.filter((i) => i.state === 'open').length;
  const openPRsCount = repoEngine.pullRequests.filter((p) => p.state === 'open').length;

  return (
    <div
      className={`min-h-screen font-sans antialiased text-[#f0f6fc] flex flex-col transition-colors w-full max-w-full overflow-x-hidden ${
        theme === 'dark' ? 'bg-[#0d1117]' : 'bg-[#151b23]'
      }`}
    >
      {/* Top Universal Navbar */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        openPRsCount={openPRsCount}
        openIssuesCount={openIssuesCount}
        onNavigateTab={(tab) => setActiveTab(tab)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'dimmed' : 'dark')}
      />

      {/* Repository Header with Star/Fork actions & Navigation Tabs */}
      <RepoHeader
        details={repoEngine.details}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        openIssuesCount={openIssuesCount}
        openPRsCount={openPRsCount}
        onToggleStar={handleToggleStar}
        onToggleFork={handleToggleFork}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeTab === 'code' && (
          <CodeExplorer
            files={files}
            branches={repoEngine.branches}
            currentBranch={currentBranch}
            onSwitchBranch={handleSwitchBranch}
            onCreateBranch={handleCreateBranch}
            latestCommit={latestCommit}
            totalCommitsCount={repoEngine.commits.length}
            repoDetails={repoEngine.details}
            contributors={repoEngine.contributors}
            onCommitFileChange={handleCommitFileChange}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesView
            issues={repoEngine.issues}
            onAddIssue={handleAddIssue}
            onAddComment={handleAddComment}
            onToggleIssueState={handleToggleIssueState}
          />
        )}

        {activeTab === 'pulls' && (
          <PullRequestsView
            pullRequests={repoEngine.pullRequests}
            onMergePR={handleMergePR}
          />
        )}

        {activeTab === 'actions' && (
          <ActionsView currentBranch={currentBranch} />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            contributors={repoEngine.contributors}
            repoDetails={repoEngine.details}
            totalCommits={repoEngine.commits.length}
          />
        )}
      </main>

      {/* Command Palette Spotlight Dialog */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        files={files}
        issues={repoEngine.issues}
        pullRequests={repoEngine.pullRequests}
        commits={repoEngine.commits}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#30363d] py-6 text-xs text-[#8b949e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-[#8b949e]" />
            <span>&copy; 2026 VexorionEditorGithub. Built by <strong>Prasetyo Bayu Widodo</strong>.</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-[11px]">
            <a href="#terms" className="hover:text-[#58a6ff] transition-colors">Terms</a>
            <a href="#privacy" className="hover:text-[#58a6ff] transition-colors">Privacy</a>
            <a href="#security" className="hover:text-[#58a6ff] transition-colors">Security</a>
            <a href="#status" className="hover:text-[#58a6ff] transition-colors">Status</a>
            <a href="#docs" className="hover:text-[#58a6ff] transition-colors">Docs</a>
            <a href="#contact" className="hover:text-[#58a6ff] transition-colors">Contact</a>
            <span className="flex items-center gap-1 text-[#c9d1d9]">
              Designed with pure craftsmanship
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
