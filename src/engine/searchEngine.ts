import { RepoFile, Issue, PullRequest, GitCommit } from './types';

export interface SearchResultItem {
  id: string;
  type: 'file' | 'issue' | 'pull-request' | 'commit' | 'command';
  title: string;
  subtitle: string;
  path?: string;
  badge?: string;
  action?: () => void;
}

/**
 * Traverses file tree to flatten into a searchable list
 */
export function flattenFileTree(nodes: RepoFile[]): RepoFile[] {
  const result: RepoFile[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.type === 'directory' && node.children) {
      result.push(...flattenFileTree(node.children));
    }
  }
  return result;
}

/**
 * Search across files, issues, PRs, and commits
 */
export function queryRepository(
  query: string,
  files: RepoFile[],
  issues: Issue[],
  prs: PullRequest[],
  commits: GitCommit[]
): SearchResultItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // 1. Files
  const flatFiles = flattenFileTree(files).filter(f => f.type === 'file');
  for (const f of flatFiles) {
    if (f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)) {
      results.push({
        id: `file-${f.path}`,
        type: 'file',
        title: f.name,
        subtitle: f.path,
        path: f.path,
        badge: f.language || 'file',
      });
    }
  }

  // 2. Issues
  for (const issue of issues) {
    if (
      issue.title.toLowerCase().includes(q) ||
      issue.id.toString().includes(q) ||
      issue.labels.some(l => l.name.toLowerCase().includes(q))
    ) {
      results.push({
        id: `issue-${issue.id}`,
        type: 'issue',
        title: `#${issue.id} ${issue.title}`,
        subtitle: `Opened by ${issue.author.username} • ${issue.state}`,
        badge: issue.state,
      });
    }
  }

  // 3. Pull Requests
  for (const pr of prs) {
    if (
      pr.title.toLowerCase().includes(q) ||
      pr.id.toString().includes(q) ||
      pr.sourceBranch.toLowerCase().includes(q)
    ) {
      results.push({
        id: `pr-${pr.id}`,
        type: 'pull-request',
        title: `!#${pr.id} ${pr.title}`,
        subtitle: `${pr.sourceBranch} ➔ ${pr.targetBranch} • ${pr.state}`,
        badge: pr.state,
      });
    }
  }

  // 4. Commits
  for (const commit of commits) {
    if (
      commit.message.toLowerCase().includes(q) ||
      commit.shortHash.toLowerCase().includes(q) ||
      commit.author.username.toLowerCase().includes(q)
    ) {
      results.push({
        id: `commit-${commit.hash}`,
        type: 'commit',
        title: commit.message,
        subtitle: `${commit.shortHash} by ${commit.author.name}`,
        badge: 'commit',
      });
    }
  }

  return results.slice(0, 15);
}
