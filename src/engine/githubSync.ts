import { RepoDetails, GitCommit, GitBranch, RepoFile, Issue } from './types';

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  token?: string;
}

export class GitHubSyncService {
  private config: GitHubSyncConfig;

  constructor(config: GitHubSyncConfig = { owner: 'prssbayu-oss', repo: 'VexorionEditorGithub' }) {
    this.config = config;
  }

  public setConfig(newConfig: Partial<GitHubSyncConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): GitHubSyncConfig {
    return { ...this.config };
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (this.config.token) {
      headers['Authorization'] = `token ${this.config.token}`;
    }
    return headers;
  }

  public async fetchRepoDetails(): Promise<Partial<RepoDetails>> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return {
      owner: data.owner?.login || this.config.owner,
      name: data.name || this.config.repo,
      description: data.description || 'Modern, sleek GitHub interface by Prasetyo Bayu Widodo',
      website: data.homepage || 'https://vexorion-editor.dev',
      isPrivate: data.private || false,
      starsCount: data.stargazers_count ?? 0,
      forksCount: data.forks_count ?? 0,
      watchersCount: data.watchers_count ?? data.subscribers_count ?? 0,
      defaultBranch: data.default_branch || 'main',
      license: data.license?.name || 'MIT License',
      topics: data.topics && data.topics.length > 0 ? data.topics : ['vexorion-editor', 'github-ui', 'modern-web'],
    };
  }

  public async fetchBranches(): Promise<GitBranch[]> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/branches`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((b: any) => ({
      name: b.name,
      isDefault: b.name === 'main' || b.name === 'master',
      protected: b.protected || false,
      latestCommitHash: b.commit?.sha || '',
    }));
  }

  public async fetchCommits(branch = 'main'): Promise<GitCommit[]> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/commits?sha=${branch}&per_page=20`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((c: any) => {
      const date = c.commit?.author?.date ? new Date(c.commit.author.date) : new Date();
      const timeAgo = formatTimeAgo(date);

      return {
        hash: c.sha,
        shortHash: c.sha.slice(0, 7),
        message: c.commit?.message?.split('\n')[0] || 'Update',
        description: c.commit?.message?.split('\n').slice(1).join('\n').trim() || undefined,
        author: {
          name: c.commit?.author?.name || c.author?.login || 'Prasetyo Bayu Widodo',
          username: c.author?.login || 'prssbayu-oss',
          avatar: c.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: timeAgo,
        branch,
        parents: c.parents ? c.parents.map((p: any) => p.sha.slice(0, 7)) : [],
      };
    });
  }

  public async fetchContents(path = ''): Promise<RepoFile[]> {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${cleanPath}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) return [];
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    return items.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'dir' ? 'directory' : 'file',
      size: item.size,
      lastCommitMessage: 'Update from GitHub repository',
      lastCommitHash: item.sha ? item.sha.slice(0, 7) : 'live',
      lastCommitTime: 'latest',
      lastCommitAuthor: this.config.owner,
      language: detectLanguage(item.name),
    }));
  }

  public async fetchFileRawContent(path: string): Promise<string> {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${cleanPath}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) throw new Error(`Cannot load file ${cleanPath}`);
    const data = await res.json();
    if (data.content && data.encoding === 'base64') {
      try {
        return decodeURIComponent(
          atob(data.content.replace(/\s/g, ''))
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } catch {
        return atob(data.content.replace(/\s/g, ''));
      }
    }
    if (data.download_url) {
      const rawRes = await fetch(data.download_url);
      return await rawRes.text();
    }
    return '';
  }

  public async fetchIssues(): Promise<Issue[]> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/issues?state=all&per_page=15`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    // Filter out pull requests which GitHub returns in issues endpoint
    const issueItems = data.filter((item: any) => !item.pull_request);

    return issueItems.map((iss: any) => ({
      id: iss.number,
      title: iss.title,
      body: iss.body || 'No description provided.',
      author: {
        name: iss.user?.login || 'User',
        username: iss.user?.login || 'user',
        avatar: iss.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
      state: iss.state as 'open' | 'closed',
      createdAt: formatTimeAgo(new Date(iss.created_at)),
      closedAt: iss.closed_at ? formatTimeAgo(new Date(iss.closed_at)) : undefined,
      labels: (iss.labels || []).map((l: any) => ({
        name: l.name,
        color: `#${l.color}`,
        description: l.description,
      })),
      commentsCount: iss.comments || 0,
      comments: [],
      assignees: (iss.assignees || []).map((a: any) => ({
        name: a.login,
        username: a.login,
        avatar: a.avatar_url,
      })),
    }));
  }
}

function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'TypeScript';
    case 'js':
    case 'jsx':
      return 'JavaScript';
    case 'css':
      return 'CSS';
    case 'json':
      return 'JSON';
    case 'md':
      return 'Markdown';
    case 'html':
      return 'HTML';
    case 'yml':
    case 'yaml':
      return 'YAML';
    default:
      return 'Plain Text';
  }
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
