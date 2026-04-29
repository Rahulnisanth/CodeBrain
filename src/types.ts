/**
 * Core data models for CodeBrainPro.
 */

export type WorkType =
  | 'feature'
  | 'bugfix'
  | 'refactor'
  | 'docs'
  | 'test'
  | 'chore'
  | 'unknown';

export interface ActivityEvent {
  eventId: string;
  type: 'edit' | 'focus' | 'idle' | 'commit';
  filePath: string;
  repoRoot: string;
  repoName: string;
  timestamp: string; // ISO 8601
  linesAdded: number;
  linesRemoved: number;
  languageId: string;
  sessionId: string;
}

export interface WorkSession {
  sessionId: string;
  repoName: string;
  repoPath: string;
  startTime: string; // ISO 8601
  endTime: string;
  activeMinutes: number;
  idleMinutes: number;
  filesEdited: string[];
  linesAdded: number;
  linesRemoved: number;
}

export interface CommitRecord {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  repoName: string;
  repoPath: string;
  filesChanged: string[];
  diffStat: string;
  linesAdded: number;
  linesRemoved: number;
  classification?: {
    type: WorkType;
    confidence: number;
    summary: string;
  };
  workUnitId?: string;
}

export interface WorkUnit {
  id: string;
  name: string; // AI-generated label
  type: WorkType;
  commits: string[]; // commit hashes
  repos: string[];
  startTime: string;
  endTime: string;
  totalLinesChanged: number;
}

export interface RiskEvent {
  timestamp: string;
  repoName: string;
  repoPath: string;
  linesChanged: number;
  minutesSinceLastCommit: number;
  hasDeletedFiles: boolean;
}

export interface ClassificationResult {
  type: WorkType;
  confidence: number;
  summary: string;
}

export interface PersistedActiveTime {
  date: string;
  activeMinutes: number;
}

export interface GroupResult {
  name: string;
  type: WorkType;
  commitHashes: string[];
}

export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  authorEmail?: string;
  timestamp: string;
}

export interface ReportData {
  period: string;
  startDate: Date;
  endDate: Date;
  totalActiveMinutes: number;
  byDay: Record<string, number>; // date string -> minutes
  workUnits: WorkUnit[];
  commits: CommitRecord[];
  topFiles: { filePath: string; editCount: number }[];
  repos: Record<string, { minutes: number; commits: number }>;
  linesAdded: number;
  linesRemoved: number;
  risks: RiskEvent[];
  narrative?: string;
}

export interface RepoMetadata {
  repoName: string;
  repoPath: string;
  remoteUrl: string | null;
  lastSyncedAt: string | null;
}
