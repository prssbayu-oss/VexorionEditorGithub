export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number; // bytes
  content?: string;
  lastCommitMessage: string;
  lastCommitHash: string;
  lastCommitTime: string;
  lastCommitAuthor: string;
  language?: string;
  children?: RepoFile[];
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  description?: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  branch: string;
  parents: string[];
  stats?: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
}

export interface GitBranch {
  name: string;
  isDefault: boolean;
  protected: boolean;
  latestCommitHash: string;
}

export interface IssueComment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  reactions?: Record<string, number>;
}

export interface Issue {
  id: number;
  title: string;
  body: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  state: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
  labels: {
    name: string;
    color: string;
    description?: string;
  }[];
  commentsCount: number;
  comments: IssueComment[];
  assignees: {
    name: string;
    username: string;
    avatar: string;
  }[];
  milestone?: string;
}

export interface DiffLine {
  type: 'add' | 'delete' | 'context' | 'hunk';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface DiffFile {
  oldPath: string;
  newPath: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

export interface PullRequest {
  id: number;
  title: string;
  body: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  sourceBranch: string;
  targetBranch: string;
  state: 'open' | 'merged' | 'closed';
  createdAt: string;
  mergedAt?: string;
  closedAt?: string;
  labels: {
    name: string;
    color: string;
  }[];
  commentsCount: number;
  comments: IssueComment[];
  reviewers: {
    username: string;
    status: 'approved' | 'changes_requested' | 'commented' | 'pending';
    avatar: string;
  }[];
  checks: {
    name: string;
    status: 'success' | 'failure' | 'in_progress';
    duration: string;
  }[];
  diffFiles: DiffFile[];
}

export interface ActionJobStep {
  name: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failed';
  duration: string;
  logs: string[];
}

export interface ActionWorkflowRun {
  id: string;
  workflowName: string;
  eventName: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  authorAvatar: string;
  status: 'completed' | 'in_progress' | 'failed';
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  startedAt: string;
  duration: string;
  steps: ActionJobStep[];
}

export interface Contributor {
  name: string;
  username: string;
  avatar: string;
  commitsCount: number;
  additions: number;
  deletions: number;
  role: string;
}

export interface RepoDetails {
  owner: string;
  name: string;
  description: string;
  website: string;
  isPrivate: boolean;
  starsCount: number;
  isStarred: boolean;
  forksCount: number;
  watchersCount: number;
  defaultBranch: string;
  license: string;
  topics: string[];
  languages: {
    name: string;
    color: string;
    percentage: number;
  }[];
}
