import * as vscode from 'vscode';
import { formatDuration } from '../utils/dateUtils';

/**
 * Status Bar Item — live indicator of CodePilot activity.
 */
export class CodePilotStatusBar {
  private readonly statusBarItem: vscode.StatusBarItem;
  private activeMinutes = 0;
  private riskCount = 0;
  private isSyncing = false;
  private updateHandle: ReturnType<typeof setInterval> | null = null;
  private getActiveMinutes: (() => number) | null = null;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100,
    );
    this.statusBarItem.command = 'codePilot.openSidebar';
    this.statusBarItem.tooltip = 'CodePilot — Click to open sidebar';
    this.statusBarItem.show();

    context.subscriptions.push(this.statusBarItem);
  }

  /**
   * Provide a callback to get the current active minutes.
   */
  setActiveMinutesProvider(provider: () => number): void {
    this.getActiveMinutes = provider;
  }

  /**
   * Start periodic status bar updates (every 60 seconds).
   */
  startUpdating(): void {
    this.updateDisplay();

    const handle = setInterval(() => {
      if (this.getActiveMinutes) {
        this.activeMinutes = this.getActiveMinutes();
      }
      this.updateDisplay();
    }, 60 * 1000);

    this.updateHandle = handle;
    this.context.subscriptions.push({
      dispose: () => {
        clearInterval(handle);
      },
    });
  }

  /**
   * Update the risk count (shown as amber indicator).
   */
  setRiskCount(count: number): void {
    this.riskCount = count;
    this.updateDisplay();
  }

  /**
   * Show a sync spinner while syncing.
   */
  startSync(): void {
    this.isSyncing = true;
    this.updateDisplay();
  }

  /**
   * Stop the sync spinner.
   */
  stopSync(): void {
    this.isSyncing = false;
    this.updateDisplay();
  }

  /**
   * Add active minutes to the counter.
   */
  addActiveMinutes(minutes: number): void {
    this.activeMinutes += minutes;
    this.updateDisplay();
  }

  private updateDisplay(): void {
    if (this.isSyncing) {
      this.statusBarItem.text = '$(sync~spin) CodePilot: Syncing...';
      this.statusBarItem.backgroundColor = undefined;
      return;
    }

    const duration = formatDuration(this.activeMinutes);

    if (this.riskCount > 0) {
      this.statusBarItem.text = `$(warning) CodePilot: ${duration} active — ${this.riskCount} risk(s)`;
      this.statusBarItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.warningBackground',
      );
    } else {
      this.statusBarItem.text = `$(clock) CodePilot: ${duration} active today`;
      this.statusBarItem.backgroundColor = undefined;
    }
  }
}
