import * as path from 'path';
import { CommitRecord, WorkUnit, RiskEvent } from '../types';
import { readJson, writeJson, getCodeBrainProDir } from '../utils/storage';

const COMMITS_FILE = () =>
  path.join(getCodeBrainProDir(), 'sidebar-commits.json');
const WORK_UNITS_FILE = () =>
  path.join(getCodeBrainProDir(), 'sidebar-work-units.json');

/** Maximum number of commits persisted to disk. */
const MAX_PERSISTED_COMMITS = 50;

/** Maximum number of recent commits exposed to the sidebar tree. */
const MAX_DISPLAY_COMMITS = 20;

/**
 * Centralised in-memory + on-disk store for sidebar state.
 *
 * Owns the three data arrays that back the sidebar tree and
 * handles persistence so state survives window refreshes.
 */
export class SidebarStateManager {
  private readonly commits: CommitRecord[] = [];
  private readonly workUnits: WorkUnit[] = [];
  private readonly risks: RiskEvent[] = [];

  // ── Lifecycle ──────────────────────────────────────────────

  /** Restore persisted state from disk (call once at activation). */
  restore(): void {
    const storedCommits = readJson<CommitRecord[]>(COMMITS_FILE(), []);
    const storedWorkUnits = readJson<WorkUnit[]>(WORK_UNITS_FILE(), []);

    if (storedCommits.length > 0) {
      this.commits.push(...storedCommits);
    }
    if (storedWorkUnits.length > 0) {
      this.workUnits.push(...storedWorkUnits);
    }
  }

  /** Write current commits and work units to disk. */
  persist(): void {
    try {
      writeJson(COMMITS_FILE(), this.commits.slice(-MAX_PERSISTED_COMMITS));
      writeJson(WORK_UNITS_FILE(), this.workUnits);
    } catch {
      // Non-fatal — state will be rebuilt on the next commit poll
    }
  }

  // ── Queries ────────────────────────────────────────────────

  /** Whether there is any data worth showing in the sidebar. */
  hasData(): boolean {
    return this.commits.length > 0 || this.workUnits.length > 0;
  }

  /** Recent commits for the sidebar tree. */
  getRecentCommits(): CommitRecord[] {
    return this.commits.slice(-MAX_DISPLAY_COMMITS);
  }

  /** All commits (for AI grouping / report generation). */
  getAllCommits(): CommitRecord[] {
    return this.commits;
  }

  /** The last N commits for the AI grouper window. */
  getGroupingWindow(): CommitRecord[] {
    return this.commits.slice(-MAX_PERSISTED_COMMITS);
  }

  /** Current work units. */
  getWorkUnits(): WorkUnit[] {
    return this.workUnits;
  }

  /** Current risk events. */
  getRisks(): RiskEvent[] {
    return this.risks;
  }

  // ── Mutations ──────────────────────────────────────────────

  /** Returns true if the commit was added, false if it was a duplicate. */
  addCommit(commit: CommitRecord): boolean {
    if (this.commits.some((c) => c.hash === commit.hash)) {
      return false;
    }
    this.commits.push(commit);
    return true;
  }

  /** Replace work units wholesale (called after AI re-grouping). */
  setWorkUnits(units: WorkUnit[]): void {
    this.workUnits.length = 0;
    this.workUnits.push(...units);
  }

  /** Replace risk events wholesale. */
  setRisks(risks: RiskEvent[]): void {
    this.risks.length = 0;
    this.risks.push(...risks);
  }
}
