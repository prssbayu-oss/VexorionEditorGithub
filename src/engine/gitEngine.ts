import {
  RepoFile,
  GitCommit,
  GitBranch,
  Issue,
  PullRequest,
  Contributor,
  RepoDetails,
} from './types';
import { computeLineDiff } from './diffEngine';

export class GitRepositoryEngine {
  public details: RepoDetails;
  public branches: GitBranch[];
  public currentBranch: string;
  public commits: GitCommit[];
  public fileTrees: Record<string, RepoFile[]>; // branch -> file tree
  public issues: Issue[];
  public pullRequests: PullRequest[];
  public contributors: Contributor[];

  constructor() {
    this.currentBranch = 'main';

    this.details = {
      owner: 'prssbayu-oss',
      name: 'VexorionEditorGithub',
      description: '✨ VexorionEditorGithub by Prasetyo Bayu Widodo - Modern, sleek GitHub interface with interactive code browser, diff viewer, issues tracker, and lightning search.',
      website: 'https://vexorion-editor.dev',
      isPrivate: false,
      starsCount: 1482,
      isStarred: false,
      forksCount: 236,
      watchersCount: 89,
      defaultBranch: 'main',
      license: 'MIT License',
      topics: ['vexorion-editor', 'github-ui', 'modern-web', 'react19', 'typescript', 'git-engine', 'tailwindcss'],
      languages: [
        { name: 'TypeScript', color: '#3178c6', percentage: 76.4 },
        { name: 'React/TSX', color: '#61dafb', percentage: 14.8 },
        { name: 'CSS / Tailwind', color: '#38bdf8', percentage: 6.2 },
        { name: 'Shell / CI', color: '#89e051', percentage: 2.6 },
      ],
    };

    this.branches = [
      { name: 'main', isDefault: true, protected: true, latestCommitHash: '8f921bc' },
      { name: 'feat/modern-redesign', isDefault: false, protected: false, latestCommitHash: '3c819fa' },
      { name: 'feat/interactive-terminal', isDefault: false, protected: false, latestCommitHash: '5e1904a' },
      { name: 'hotfix/cache-headers', isDefault: false, protected: false, latestCommitHash: '9b22e11' },
    ];

    this.commits = [
      {
        hash: '5ff296eeade49ea96a77cd1c0ae016988234917f',
        shortHash: '5ff296e',
        message: 'feat: initial release of VexorionEditorGithub - modern web interface for GitHub',
        description: 'Pushed whole project to real GitHub repository github.com/prssbayu-oss/VexorionEditorGithub.',
        author: {
          name: 'Prasetyo Bayu Widodo',
          username: 'prssbayu-oss',
          avatar: 'https://avatars.githubusercontent.com/u/292710804?v=4',
        },
        timestamp: 'just now',
        branch: 'main',
        parents: [],
        stats: { additions: 6408, deletions: 0, filesChanged: 35 },
      },
      {
        hash: '3c819fa283746192837461928374619283746192',
        shortHash: '3c819fa',
        message: 'perf(engine): optimize Myers diff algorithm for large files',
        description: 'Improves diff calculation performance by 4x for files exceeding 1,000 lines.',
        author: {
          name: 'Sarah Chen',
          username: 'sarah-dev',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: '2 hours ago',
        branch: 'main',
        parents: ['7a1102e'],
        stats: { additions: 84, deletions: 22, filesChanged: 2 },
      },
      {
        hash: '7a1102e192837461928374619283746192837461',
        shortHash: '7a1102e',
        message: 'docs: update architecture overview and contribution guidelines',
        description: 'Detailing src/components, src/engine, and src/features separation of concerns.',
        author: {
          name: 'Marcus Vance',
          username: 'marcus-v',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: 'yesterday',
        branch: 'main',
        parents: ['1b994cc'],
        stats: { additions: 156, deletions: 12, filesChanged: 3 },
      },
      {
        hash: '1b994cc9283746192837461928374619283746192',
        shortHash: '1b994cc',
        message: 'feat(actions): add real-time workflow logs simulation',
        description: 'Simulate GitHub Actions runners with live streaming ANSI steps.',
        author: {
          name: 'Elena Rostova',
          username: 'elena-code',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: '2 days ago',
        branch: 'main',
        parents: ['0a811ee'],
        stats: { additions: 240, deletions: 15, filesChanged: 4 },
      },
    ];

    // Seed file structure
    const initialFiles: RepoFile[] = [
      {
        name: 'src',
        path: 'src',
        type: 'directory',
        lastCommitMessage: 'feat(ui): migrate components to modern layout system',
        lastCommitHash: '8f921bc',
        lastCommitTime: '15 minutes ago',
        lastCommitAuthor: 'luxarion',
        children: [
          {
            name: 'components',
            path: 'src/components',
            type: 'directory',
            lastCommitMessage: 'feat(ui): add atomic Button, Badge, Modal components',
            lastCommitHash: '8f921bc',
            lastCommitTime: '15 minutes ago',
            lastCommitAuthor: 'luxarion',
            children: [
              {
                name: 'Button.tsx',
                path: 'src/components/Button.tsx',
                type: 'file',
                size: 2450,
                language: 'typescript',
                lastCommitMessage: 'feat(ui): implement Button with variant tokens',
                lastCommitHash: '8f921bc',
                lastCommitTime: '15 minutes ago',
                lastCommitAuthor: 'luxarion',
                content: `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variantMap = {
    primary: 'bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] focus:ring-[#238636]',
    secondary: 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] focus:ring-[#58a6ff]',
    outline: 'bg-transparent hover:bg-[#21262d] text-[#c9d1d9] border border-[#30363d] focus:ring-[#58a6ff]',
    danger: 'bg-[#da3633] hover:bg-[#f85149] text-white border border-[rgba(240,246,252,0.1)] focus:ring-[#da3633]',
    ghost: 'bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] focus:ring-[#58a6ff]',
    success: 'bg-[#238636] hover:bg-[#2ea043] text-white focus:ring-[#238636]',
  };

  const sizeMap = {
    xs: 'px-2 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      className={\`\${baseClasses} \${variantMap[variant]} \${sizeMap[size]} \${className}\`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};`,
              },
              {
                name: 'Badge.tsx',
                path: 'src/components/Badge.tsx',
                type: 'file',
                size: 1620,
                language: 'typescript',
                lastCommitMessage: 'feat(ui): add modern status badges',
                lastCommitHash: '8f921bc',
                lastCommitTime: '15 minutes ago',
                lastCommitAuthor: 'luxarion',
                content: `import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'info' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
}) => {
  const styles = {
    default: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
    success: 'bg-[rgba(35,134,54,0.15)] text-[#3fb950] border-[rgba(63,185,80,0.3)]',
    warning: 'bg-[rgba(210,153,34,0.15)] text-[#d29922] border-[rgba(210,153,34,0.3)]',
    danger: 'bg-[rgba(248,81,73,0.15)] text-[#f85149] border-[rgba(248,81,73,0.3)]',
    purple: 'bg-[rgba(163,113,247,0.15)] text-[#a371f7] border-[rgba(163,113,247,0.3)]',
    info: 'bg-[rgba(56,139,253,0.15)] text-[#58a6ff] border-[rgba(56,139,253,0.3)]',
    outline: 'bg-transparent text-[#8b949e] border-[#30363d]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={\`inline-flex items-center gap-1.5 font-medium rounded-full border \${styles[variant]} \${sizes[size]} \${className}\`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};`,
              },
            ],
          },
          {
            name: 'engine',
            path: 'src/engine',
            type: 'directory',
            lastCommitMessage: 'perf(engine): optimize Myers diff algorithm for large files',
            lastCommitHash: '3c819fa',
            lastCommitTime: '2 hours ago',
            lastCommitAuthor: 'sarah-dev',
            children: [
              {
                name: 'diffEngine.ts',
                path: 'src/engine/diffEngine.ts',
                type: 'file',
                size: 3120,
                language: 'typescript',
                lastCommitMessage: 'perf(engine): optimize Myers diff algorithm for large files',
                lastCommitHash: '3c819fa',
                lastCommitTime: '2 hours ago',
                lastCommitAuthor: 'sarah-dev',
                content: `// Line-by-line diff calculator for Git changes\nexport function computeLineDiff(...) { /* Diff Engine */ }`,
              },
              {
                name: 'gitEngine.ts',
                path: 'src/engine/gitEngine.ts',
                type: 'file',
                size: 6420,
                language: 'typescript',
                lastCommitMessage: 'feat(engine): reactive in-memory Git state controller',
                lastCommitHash: '8f921bc',
                lastCommitTime: '15 minutes ago',
                lastCommitAuthor: 'luxarion',
                content: `// Reactive In-Memory Git state engine\nexport class GitRepositoryEngine { ... }`,
              },
            ],
          },
          {
            name: 'features',
            path: 'src/features',
            type: 'directory',
            lastCommitMessage: 'feat(features): implement repository modules',
            lastCommitHash: '8f921bc',
            lastCommitTime: '15 minutes ago',
            lastCommitAuthor: 'luxarion',
            children: [
              {
                name: 'code-explorer',
                path: 'src/features/code-explorer',
                type: 'directory',
                lastCommitMessage: 'feat(code): modern file tree & syntax viewer',
                lastCommitHash: '8f921bc',
                lastCommitTime: '15 minutes ago',
                lastCommitAuthor: 'luxarion',
              },
              {
                name: 'issues',
                path: 'src/features/issues',
                type: 'directory',
                lastCommitMessage: 'feat(issues): issue tracker & label filter',
                lastCommitHash: '7a1102e',
                lastCommitTime: 'yesterday',
                lastCommitAuthor: 'marcus-v',
              },
              {
                name: 'pull-requests',
                path: 'src/features/pull-requests',
                type: 'directory',
                lastCommitMessage: 'feat(pr): add interactive file diff inspector',
                lastCommitHash: '8f921bc',
                lastCommitTime: '15 minutes ago',
                lastCommitAuthor: 'luxarion',
              },
              {
                name: 'actions',
                path: 'src/features/actions',
                type: 'directory',
                lastCommitMessage: 'feat(actions): workflow run logs & live pipeline',
                lastCommitHash: '1b994cc',
                lastCommitTime: '2 days ago',
                lastCommitAuthor: 'elena-code',
              },
            ],
          },
          {
            name: 'App.tsx',
            path: 'src/App.tsx',
            type: 'file',
            size: 3410,
            language: 'typescript',
            lastCommitMessage: 'feat(ui): modern app root wiring',
            lastCommitHash: '8f921bc',
            lastCommitTime: '15 minutes ago',
            lastCommitAuthor: 'luxarion',
            content: `import React from 'react';\nexport default function App() {\n  return <ModernGitHub />;\n}`,
          },
        ],
      },
      {
        name: '.github',
        path: '.github',
        type: 'directory',
        lastCommitMessage: 'ci: configure automated test & release pipeline',
        lastCommitHash: '1b994cc',
        lastCommitTime: '2 days ago',
        lastCommitAuthor: 'elena-code',
        children: [
          {
            name: 'workflows',
            path: '.github/workflows',
            type: 'directory',
            lastCommitMessage: 'ci: configure automated test & release pipeline',
            lastCommitHash: '1b994cc',
            lastCommitTime: '2 days ago',
            lastCommitAuthor: 'elena-code',
            children: [
              {
                name: 'ci.yml',
                path: '.github/workflows/ci.yml',
                type: 'file',
                size: 980,
                language: 'yaml',
                lastCommitMessage: 'ci: add test matrix and lint check',
                lastCommitHash: '1b994cc',
                lastCommitTime: '2 days ago',
                lastCommitAuthor: 'elena-code',
                content: `name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build`,
              },
            ],
          },
        ],
      },
      {
        name: 'package.json',
        path: 'package.json',
        type: 'file',
        size: 1240,
        language: 'json',
        lastCommitMessage: 'chore: bump dependencies to modern React 19 stack',
        lastCommitHash: '8f921bc',
        lastCommitTime: '15 minutes ago',
        lastCommitAuthor: 'prasetyobayu',
        content: `{
  "name": "vexorion-editor-github",
  "version": "2.4.0",
  "author": "Prasetyo Bayu Widodo",
  "description": "VexorionEditorGithub - Modern, sleek GitHub interface with interactive code browser & diff viewer",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24"
  }
}`,
      },
      {
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        size: 2840,
        language: 'markdown',
        lastCommitMessage: 'docs: update architecture overview and contribution guidelines',
        lastCommitHash: '7a1102e',
        lastCommitTime: 'yesterday',
        lastCommitAuthor: 'marcus-v',
        content: `# VexorionEditorGithub

A sleek, responsive, and high-performance modern GitHub web experience built with **React 19**, **Tailwind CSS**, and an in-memory **Git Engine**.

Author: **Prasetyo Bayu Widodo**

---

## 🚀 Key Architectural Pillars

- **\`src/components/\`**: Pure UI/UX design tokens and reusable atomic primitives (\`Button\`, \`Badge\`, \`Input\`, \`Modal\`, \`Tabs\`, \`CodeViewer\`). No business logic or state mutations.
- **\`src/engine/\`**: Core domain logic including \`gitEngine\` (in-memory tree, commits, branches, issues, PRs), \`diffEngine\` (line diffing and hunks), \`searchEngine\`, and \`markdownEngine\`.
- **\`src/features/\`**: Modular feature suites:
  - 📂 **Code Explorer**: Interactive tree navigation, branch switcher, full syntax code viewer, latest commit banner, and clone dialog.
  - 🔀 **Pull Requests**: Multi-tab PR inspector featuring side-by-side or unified line-by-line diff views, file change stats (+/-), and merge simulation.
  - 📋 **Issues Tracker**: Filterable issues board with labels, search, comments timeline, and new issue creation.
  - ⚡ **Actions / CI**: Simulated GitHub Actions runners with live streaming log outputs and real-time execution timing.
  - 📊 **Insights**: Interactive 52-week contribution heatmap, language percentage breakdown, and commit graphs.
  - ⌨️ **Command Palette**: Global search spotlight (\`⌘K\` or \`Ctrl+K\`) for instant jumping to any file, issue, or branch.

---

## 🛠️ Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/prssbayu-oss/VexorionEditorGithub.git

# Install packages
pnpm install

# Start development dev server
pnpm dev
\`\`\`

---

## 🤝 Contribution Guidelines

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feat/amazing-feature\`)
3. Commit your Changes (\`git commit -m 'feat: add amazing feature'\`)
4. Push to the Branch (\`git push origin feat/amazing-feature\`)
5. Open a Pull Request

---

## 📜 License
Distributed under the **MIT License**. See \`LICENSE\` for more information.`,
      },
      {
        name: 'LICENSE',
        path: 'LICENSE',
        type: 'file',
        size: 1064,
        language: 'text',
        lastCommitMessage: 'initial commit',
        lastCommitHash: '0a811ee',
        lastCommitTime: '3 days ago',
        lastCommitAuthor: 'prasetyobayu',
        content: `MIT License

Copyright (c) 2026 Prasetyo Bayu Widodo (VexorionEditorGithub)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
      },
    ];

    this.fileTrees = {
      main: initialFiles,
      'feat/modern-redesign': JSON.parse(JSON.stringify(initialFiles)),
      'feat/interactive-terminal': JSON.parse(JSON.stringify(initialFiles)),
      'hotfix/cache-headers': JSON.parse(JSON.stringify(initialFiles)),
    };

    this.issues = [
      {
        id: 42,
        title: 'Support side-by-side split view in Pull Request diff inspector',
        body: `When reviewing large pull requests with complex code changes, unified diffs can sometimes be hard to scan horizontally. Adding a toggle between **Unified** and **Split (Side-by-Side)** views would significantly improve readability and code review velocity.

### Proposed Solution
- Add a segmented toggle in the PR Files Changed header
- Support sticky file header bars with collapse/expand toggles
- Highlight added lines with soft green and deleted lines with soft red`,
        author: {
          name: 'Sarah Chen',
          username: 'sarah-dev',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        },
        state: 'open',
        createdAt: '2 hours ago',
        labels: [
          { name: 'enhancement', color: '#a2eeef', description: 'New feature or request' },
          { name: 'ui/ux', color: '#58a6ff', description: 'Design, layout, and visual feedback' },
          { name: 'good first issue', color: '#7057ff', description: 'Good for newcomers' },
        ],
        commentsCount: 3,
        comments: [
          {
            id: 'c-1',
            author: {
              name: 'Marcus Vance',
              username: 'marcus-v',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              role: 'Contributor',
            },
            content: 'Great suggestion! We could also display whitespace diff controls and syntax tokens.',
            createdAt: '1 hour ago',
          },
          {
            id: 'c-2',
            author: {
              name: 'Luxarion',
              username: 'luxarion',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
              role: 'Maintainer',
            },
            content: "Agreed! PR #84 already implements the core diff chunking engine. I'll hook up the split view toggle.",
            createdAt: '45 minutes ago',
          },
        ],
        assignees: [
          {
            name: 'Luxarion',
            username: 'luxarion',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          },
        ],
        milestone: 'v2.5.0 Release',
      },
      {
        id: 41,
        title: 'Keyboard navigation: bind Cmd+K shortcut to global Command Palette',
        body: 'Allow developers to press ⌘K or Ctrl+K anywhere on the repository to search files, switch branches, or jump to PRs without lifting fingers from the keyboard.',
        author: {
          name: 'Elena Rostova',
          username: 'elena-code',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        },
        state: 'open',
        createdAt: 'yesterday',
        labels: [
          { name: 'accessibility', color: '#1d76db' },
          { name: 'priority: high', color: '#d93f0b' },
        ],
        commentsCount: 1,
        comments: [
          {
            id: 'c-3',
            author: {
              name: 'Luxarion',
              username: 'luxarion',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
              role: 'Maintainer',
            },
            content: 'Implemented in the CommandPalette feature! Window key listeners are active.',
            createdAt: '3 hours ago',
          },
        ],
        assignees: [],
        milestone: 'v2.5.0 Release',
      },
      {
        id: 39,
        title: 'Fix mobile responsiveness on repository header tabs and commit bar',
        body: 'On narrow viewports (<640px), the commit hash banner overflowed slightly past the card boundary. Needs overflow-x-auto and responsive typography.',
        author: {
          name: 'Kenji Sato',
          username: 'kenji-s',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        },
        state: 'closed',
        createdAt: '3 days ago',
        closedAt: 'yesterday',
        labels: [
          { name: 'bug', color: '#d73a4a' },
          { name: 'ui/ux', color: '#58a6ff' },
        ],
        commentsCount: 2,
        comments: [],
        assignees: [],
      },
    ];

    // Seed realistic Pull Requests with full diff calculation
    const buttonOldCode = `export const Button = ({ children }) => {\n  return <button className="btn">{children}</button>;\n};`;
    const buttonNewCode = `export const Button = ({ variant = 'secondary', size = 'md', icon, loading = false, children, ...props }) => {\n  const base = 'inline-flex items-center font-medium rounded-md';\n  return <button className={base} {...props}>{icon}{children}</button>;\n};`;
    const diffButton = computeLineDiff(buttonOldCode, buttonNewCode, 'src/components/Button.tsx', 'src/components/Button.tsx');

    const readmeOldCode = `# GitHub Modern\nA web client.`;
    const readmeNewCode = `# Modern GitHub\n\nA sleek, responsive, and high-performance modern GitHub web experience built with **React 19** and **Tailwind CSS**.\n\n## Key Architectural Pillars\n- src/components/\n- src/engine/\n- src/features/`;
    const diffReadme = computeLineDiff(readmeOldCode, readmeNewCode, 'README.md', 'README.md');

    this.pullRequests = [
      {
        id: 84,
        title: 'feat(ui): implement modern UI component primitives and dark slate theme',
        body: `### Summary of Changes
- Refactors \`src/components/Button.tsx\` to support \`primary\`, \`secondary\`, \`outline\`, \`danger\` variants.
- Updates documentation and architectural separation in \`README.md\`.
- All unit tests and CI workflows passing cleanly!

### Visual Preview
Clean high-contrast borders, refined 13px mono fonts, and fluid interactive tabs.`,
        author: {
          name: 'Sarah Chen',
          username: 'sarah-dev',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        },
        sourceBranch: 'feat/modern-redesign',
        targetBranch: 'main',
        state: 'open',
        createdAt: '3 hours ago',
        labels: [
          { name: 'ready for review', color: '#0e8a16' },
          { name: 'ui/ux', color: '#58a6ff' },
        ],
        commentsCount: 2,
        comments: [
          {
            id: 'prc-1',
            author: {
              name: 'Marcus Vance',
              username: 'marcus-v',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              role: 'Reviewer',
            },
            content: 'Looks very crisp! Diff view renders cleanly and the contrast levels match GitHub standards perfectly.',
            createdAt: '2 hours ago',
          },
        ],
        reviewers: [
          {
            username: 'marcus-v',
            status: 'approved',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          },
          {
            username: 'luxarion',
            status: 'pending',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          },
        ],
        checks: [
          { name: 'CI / Lint & Test Suite', status: 'success', duration: '1m 24s' },
          { name: 'CodeQL Security Scan', status: 'success', duration: '2m 10s' },
          { name: 'Vercel / Cloud Run Edge Preview', status: 'success', duration: '48s' },
        ],
        diffFiles: [diffButton, diffReadme],
      },
      {
        id: 81,
        title: 'perf(engine): optimize file search indexing with inverted trigram index',
        body: 'Replaces linear path scans with a cached index for instant sub-millisecond lookups across thousands of repository files.',
        author: {
          name: 'Elena Rostova',
          username: 'elena-code',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        },
        sourceBranch: 'perf/search-trigram',
        targetBranch: 'main',
        state: 'merged',
        createdAt: '2 days ago',
        mergedAt: 'yesterday',
        labels: [{ name: 'performance', color: '#1d76db' }],
        commentsCount: 4,
        comments: [],
        reviewers: [
          {
            username: 'luxarion',
            status: 'approved',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          },
        ],
        checks: [{ name: 'CI / Lint & Test Suite', status: 'success', duration: '1m 18s' }],
        diffFiles: [diffButton],
      },
    ];

    this.contributors = [
      {
        name: 'Prasetyo Bayu Widodo',
        username: 'prasetyobayu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        commitsCount: 148,
        additions: 12450,
        deletions: 1820,
        role: 'Founder & Lead Architect',
      },
      {
        name: 'Sarah Chen',
        username: 'sarah-dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        commitsCount: 64,
        additions: 6840,
        deletions: 940,
        role: 'Core Contributor',
      },
      {
        name: 'Marcus Vance',
        username: 'marcus-v',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        commitsCount: 38,
        additions: 3120,
        deletions: 480,
        role: 'Design & Accessibility',
      },
      {
        name: 'Elena Rostova',
        username: 'elena-code',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        commitsCount: 29,
        additions: 2400,
        deletions: 310,
        role: 'DevOps & Tooling',
      },
    ];
  }

  public getFiles(branch: string = this.currentBranch): RepoFile[] {
    return this.fileTrees[branch] || this.fileTrees['main'] || [];
  }

  public switchBranch(branchName: string): boolean {
    if (this.branches.some(b => b.name === branchName)) {
      this.currentBranch = branchName;
      return true;
    }
    return false;
  }

  public createBranch(name: string, fromBranch: string = this.currentBranch): boolean {
    if (this.branches.some(b => b.name === name)) return false;
    const baseTree = this.fileTrees[fromBranch] || this.fileTrees['main'];
    this.fileTrees[name] = JSON.parse(JSON.stringify(baseTree));
    this.branches.push({
      name,
      isDefault: false,
      protected: false,
      latestCommitHash: '8f921bc',
    });
    this.currentBranch = name;
    return true;
  }

  public toggleStar(): boolean {
    this.details.isStarred = !this.details.isStarred;
    this.details.starsCount += this.details.isStarred ? 1 : -1;
    return this.details.isStarred;
  }

  public toggleFork(): number {
    this.details.forksCount += 1;
    return this.details.forksCount;
  }

  public addCommit(message: string, filePath: string, newContent: string): GitCommit {
    const shortHash = Math.random().toString(16).substring(2, 9);
    const hash = shortHash + Math.random().toString(16).substring(2, 33);
    const commit: GitCommit = {
      hash,
      shortHash,
      message,
      author: {
        name: 'Luxarion',
        username: 'luxarion',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
      timestamp: 'just now',
      branch: this.currentBranch,
      parents: [this.commits[0]?.hash || '0000000'],
      stats: { additions: 1, deletions: 0, filesChanged: 1 },
    };

    this.commits.unshift(commit);
    this.updateFileContent(this.currentBranch, filePath, newContent, message, shortHash);
    return commit;
  }

  public updateFileContent(branch: string, filePath: string, newContent: string, commitMsg: string, commitHash: string): boolean {
    const tree = this.fileTrees[branch];
    if (!tree) return false;

    const findAndUpdate = (nodes: RepoFile[]): boolean => {
      for (const node of nodes) {
        if (node.path === filePath && node.type === 'file') {
          node.content = newContent;
          node.size = newContent.length;
          node.lastCommitMessage = commitMsg;
          node.lastCommitHash = commitHash;
          node.lastCommitTime = 'just now';
          return true;
        }
        if (node.type === 'directory' && node.children) {
          if (findAndUpdate(node.children)) return true;
        }
      }
      return false;
    };

    return findAndUpdate(tree);
  }

  public addIssue(title: string, body: string, labelNames: string[]): Issue {
    const id = this.issues.length + 43;
    const colors: Record<string, string> = {
      enhancement: '#a2eeef',
      bug: '#d73a4a',
      documentation: '#0075ca',
      'good first issue': '#7057ff',
      'ui/ux': '#58a6ff',
      performance: '#1d76db',
    };

    const newIssue: Issue = {
      id,
      title,
      body,
      author: {
        name: 'Luxarion',
        username: 'luxarion',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
      state: 'open',
      createdAt: 'just now',
      labels: labelNames.map(name => ({
        name,
        color: colors[name] || '#58a6ff',
      })),
      commentsCount: 0,
      comments: [],
      assignees: [],
    };

    this.issues.unshift(newIssue);
    return newIssue;
  }

  public addCommentToIssue(issueId: number, content: string): boolean {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return false;

    issue.comments.push({
      id: `comm-${Date.now()}`,
      author: {
        name: 'Prasetyo Bayu Widodo',
        username: 'prasetyobayu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        role: 'Maintainer',
      },
      content,
      createdAt: 'just now',
    });
    issue.commentsCount = issue.comments.length;
    return true;
  }

  public toggleIssueState(issueId: number): 'open' | 'closed' | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;
    issue.state = issue.state === 'open' ? 'closed' : 'open';
    if (issue.state === 'closed') {
      issue.closedAt = 'just now';
    } else {
      delete issue.closedAt;
    }
    return issue.state;
  }

  public mergePullRequest(prId: number): boolean {
    const pr = this.pullRequests.find(p => p.id === prId);
    if (!pr || pr.state !== 'open') return false;

    pr.state = 'merged';
    pr.mergedAt = 'just now';

    // Create merge commit
    const shortHash = Math.random().toString(16).substring(2, 9);
    this.commits.unshift({
      hash: shortHash + 'abcdef1234567890abcdef1234567890',
      shortHash,
      message: `Merge pull request #${pr.id} from ${pr.sourceBranch}`,
      description: pr.title,
      author: {
        name: 'Prasetyo Bayu Widodo',
        username: 'prasetyobayu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
      timestamp: 'just now',
      branch: 'main',
      parents: ['8f921bc', '3c819fa'],
      stats: { additions: 120, deletions: 15, filesChanged: 3 },
    });

    return true;
  }

  public applyLiveSyncData(data: {
    details?: Partial<RepoDetails>;
    commits?: GitCommit[];
    branches?: GitBranch[];
    issues?: Issue[];
    files?: RepoFile[];
  }) {
    if (data.details) {
      this.details = { ...this.details, ...data.details };
    }
    if (data.commits && data.commits.length > 0) {
      this.commits = data.commits;
    }
    if (data.branches && data.branches.length > 0) {
      this.branches = data.branches;
    }
    if (data.issues && data.issues.length > 0) {
      this.issues = data.issues;
    }
    if (data.files && data.files.length > 0) {
      this.files[this.currentBranch] = data.files;
    }
  }
}

// Global singleton instance for repository state
export const repoEngine = new GitRepositoryEngine();
