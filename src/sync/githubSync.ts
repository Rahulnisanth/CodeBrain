import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { CredentialsManager } from '../auth/credentials';
import { toDateString, toYearMonth } from '../utils/dateUtils';
import { readJson, getLogsDir } from '../utils/storage';
import { ActivityEvent } from '../types';

const GLOBAL_REPO_NAME = 'codebrain-logs';

/** GitHub Contents API hard limit for a single file PUT (bytes). */
const GITHUB_API_MAX_BYTES = 1_000_000; // ~1 MB

/** Warn in the console when a log file exceeds this threshold before reading. */
const LOG_FILE_WARN_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * GitHub Sync Engine — pushes structured activity logs and reports to a
 * centralized 'codebrain-logs' GitHub repository.
 * Auto-initializes the repo if it doesn't exist (auto_init: true).
 */
export class GitHubSync {
  private onSyncStart: (() => void) | null = null;
  private onSyncEnd: (() => void) | null = null;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly credentialsManager: CredentialsManager,
  ) {}

  /**
   * Set callbacks for sync start/end (for status bar spinner).
   */
  setSyncCallbacks(onStart: () => void, onEnd: () => void): void {
    this.onSyncStart = onStart;
    this.onSyncEnd = onEnd;
  }

  /**
   * Start the auto-sync interval (if enabled in settings).
   */
  startAutoSync(): void {
    const config = vscode.workspace.getConfiguration('codeBrain');
    if (!config.get<boolean>('syncEnabled', false)) return;

    const intervalHours = config.get<number>('syncFrequencyHours', 24);
    const intervalMs = intervalHours * 60 * 60 * 1000;

    const handle = setInterval(() => this.syncNow(), intervalMs);

    this.context.subscriptions.push({
      dispose: () => {
        clearInterval(handle);
      },
    });
  }

  /**
   * Manually trigger a sync. Called by `codeBrainsyncNow` command.
   */
  async syncNow(): Promise<void> {
    const config = vscode.workspace.getConfiguration('codeBrain');
    if (!config.get<boolean>('syncEnabled', true)) {
      vscode.window.showInformationMessage(
        'CodeBrain: GitHub sync is disabled. Enable `codeBrain.syncEnabled` to sync.',
      );
      return;
    }

    this.onSyncStart?.();

    try {
      const credentials = await this.credentialsManager.ensureGitHubAuth();
      if (!credentials) {
        this.onSyncEnd?.();
        return;
      }

      const { username, token } = credentials;
      await this.ensureGlobalRepoExists(username, token);
      await this.pushDailyLog(username, token);

      vscode.window.showInformationMessage(
        'CodeBrain: Synced to GitHub codebrain-logs.',
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `CodeBrain Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      this.onSyncEnd?.();
    }
  }

  /**
   * Creates the codebrain-logs GitHub repo if it doesn't exist.
   */
  private async ensureGlobalRepoExists(
    username: string,
    token: string,
  ): Promise<void> {
    const headers = this.getHeaders(token);
    const apiUrl = `https://api.github.com/repos/${username}/${GLOBAL_REPO_NAME}`;

    try {
      await axios.get(apiUrl, { headers });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        await axios.post(
          'https://api.github.com/user/repos',
          {
            name: GLOBAL_REPO_NAME,
            description: 'CodeBrain — Developer Activity Logger',
            private: false,
            auto_init: true,
          },
          { headers },
        );
        vscode.window.showInformationMessage(
          `CodeBrain: Created global repository '${GLOBAL_REPO_NAME}'.`,
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Push today's activity log as JSON to the global repo.
   * New structure: logs/YYYY/MM/DD.json
   *
   * Guards:
   *  - Skips files that exceed LOG_FILE_WARN_BYTES on disk (stale/corrupt).
   *  - Trims the events array so the final payload stays within
   *    GITHUB_API_MAX_BYTES (GitHub Contents API hard limit ~1 MB).
   */
  private async pushDailyLog(username: string, token: string): Promise<void> {
    const today = new Date();
    const dateStr = toDateString(today);
    const yearMonth = toYearMonth(today);
    const day = String(today.getDate()).padStart(2, '0');

    const filePath = `logs/${yearMonth}/${day}.json`;

    // Guard 1: Check raw file size before reading
    const logsDir = getLogsDir();
    const logFilePath = path.join(logsDir, `${dateStr}.json`);

    if (fs.existsSync(logFilePath)) {
      const { size } = fs.statSync(logFilePath);
      if (size > LOG_FILE_WARN_BYTES) {
        const sizeMb = (size / 1024 / 1024).toFixed(1);
        console.warn(
          `[CodeBrain] Log file is very large (${sizeMb} MB). ` +
            'Only the most recent events will be synced.',
        );
      }
    }

    // Read real activity events from ~/.codeBrain/logs/YYYY-MM-DD.json
    const allEvents = readJson<ActivityEvent[]>(logFilePath, []);

    if (allEvents.length === 0) {
      vscode.window.showInformationMessage(
        'CodeBrain Sync: No activity logged today yet — nothing to push.',
      );
      return;
    }

    // Guard 2: Trim events to fit within GitHub API payload limit
    const events = this.fitEventsToLimit(allEvents, dateStr);
    const truncated = events.length < allEvents.length;

    const content = JSON.stringify(
      {
        date: dateStr,
        syncedAt: new Date().toISOString(),
        eventCount: allEvents.length,
        syncedEventCount: events.length,
        truncated,
        events,
      },
      null,
      2,
    );

    // Guard 3: Final size assertion before encoding
    const contentBytes = Buffer.byteLength(content, 'utf-8');
    if (contentBytes > GITHUB_API_MAX_BYTES) {
      // Should not happen after fitEventsToLimit, but be safe.
      throw new Error(
        `CodeBrain: Payload too large for GitHub API (${(contentBytes / 1024).toFixed(0)} KB). ` +
          'Reduce the number of tracked events or increase sync frequency.',
      );
    }

    const encodedContent = Buffer.from(content).toString('base64');
    const headers = this.getHeaders(token);
    const apiUrl = `https://api.github.com/repos/${username}/${GLOBAL_REPO_NAME}/contents/${filePath}`;

    try {
      // Get existing SHA if file exists
      let sha: string | undefined;
      try {
        const existing = await axios.get(apiUrl, { headers });
        sha = existing.data.sha;
      } catch {
        // File doesn't exist yet — no SHA needed
      }

      await axios.put(
        apiUrl,
        {
          message:
            `CodeBrain: Activity log for ${dateStr} ` +
            `(${events.length}/${allEvents.length} events${truncated ? ', truncated' : ''})`,
          content: encodedContent,
          ...(sha ? { sha } : {}),
        },
        { headers },
      );

      if (truncated) {
        console.warn(
          `[CodeBrain] Sync truncated: pushed ${events.length} of ${allEvents.length} events ` +
            'to stay within GitHub API limits.',
        );
      }
    } catch (error) {
      console.error('CodeBrain sync push error:', error);
      throw error;
    }
  }

  /**
   * Returns the most-recent subset of `events` whose JSON payload fits within
   * GITHUB_API_MAX_BYTES. Always includes at least one event.
   */
  private fitEventsToLimit(
    events: ActivityEvent[],
    dateStr: string,
  ): ActivityEvent[] {
    // Estimate overhead for the wrapper object (date, syncedAt, counts, etc.)
    const WRAPPER_OVERHEAD_BYTES = 512;
    const budget = GITHUB_API_MAX_BYTES - WRAPPER_OVERHEAD_BYTES;

    // Work from the most recent events backwards
    const reversed = [...events].reverse();
    const selected: ActivityEvent[] = [];
    let running = 2; // Opening `[` + closing `]`

    for (const event of reversed) {
      const chunk = JSON.stringify(event);
      const chunkBytes = Buffer.byteLength(chunk, 'utf-8') + 2; // +2 for `,\n`
      if (running + chunkBytes > budget && selected.length > 0) break;
      selected.unshift(event);
      running += chunkBytes;
    }

    return selected;
  }

  private getHeaders(token: string): Record<string, string> {
    return {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    };
  }
}
