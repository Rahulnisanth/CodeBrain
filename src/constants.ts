import * as path from 'path';
import * as os from 'os';
import { getCodeBrainProDir } from './utils/storage';

/** Risk Detector Poll Interval */
export const RISK_DETECTOR_POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

/** Global Repository Name */
export const GLOBAL_REPO_NAME = 'code-brain-pro-logs';

/** GitHub Contents API hard limit for a single file PUT (bytes). */
export const GITHUB_API_MAX_BYTES = 1_000_000; // ~1 MB

/** Warn in the console when a log file exceeds this threshold before reading. */
export const LOG_FILE_WARN_BYTES = 5 * 1024 * 1024; // 5 MB

/** Maximum number of commits persisted to disk. */
export const MAX_PERSISTED_COMMITS = 50;

/** Maximum number of recent commits exposed to the sidebar tree. */
export const MAX_DISPLAY_COMMITS = 20;

/** CodeBrainPro directory paths */
export const CODE_BRAIN_PRO_DIR = path.join(os.homedir(), '.codeBrainPro');
export const LOGS_DIR = path.join(CODE_BRAIN_PRO_DIR, 'logs');
export const REPORTS_DIR = path.join(CODE_BRAIN_PRO_DIR, 'reports');

/** Classifier Constants */
export const CACHE_FILE = () =>
  path.join(getCodeBrainProDir(), 'classifier-cache.json');

/** Manages WorkSession lifecycle — detects session boundaries based on idle threshold. */
export const ACTIVE_TIME_FILE = () =>
  path.join(getCodeBrainProDir(), 'sidebar-active-time.json');

/** Sidebar State Files */
export const COMMITS_FILE = () =>
  path.join(getCodeBrainProDir(), 'sidebar-commits.json');

/** Sidebar State Files */
export const WORK_UNITS_FILE = () =>
  path.join(getCodeBrainProDir(), 'sidebar-work-units.json');

/** Secret Storage Keys */
export const KEY_GITHUB_TOKEN = 'codeBrainPro.githubToken';
export const KEY_GEMINI_API_KEY = 'codeBrainPro.geminiApiKey';

/** Classifier System Prompt */
export const CLASSIFIER_SYSTEM_PROMPT = `
  You are a senior software engineer analyzing Git commits.
  Given a commit message and diff summary, classify the work type.
  Respond ONLY with valid JSON: { "type": "<type>", "confidence": <float>, "summary": "<1 sentence>" }
  Types: feature | bugfix | refactor | docs | test | chore | unknown`;

/** VSCode Tree Item Type Icons */
export const TYPE_ICON: Record<string, string> = {
  feature: '$(add)',
  bugfix: '$(bug)',
  refactor: '$(tools)',
  docs: '$(book)',
  test: '$(beaker)',
  chore: '$(gear)',
  unknown: '$(circle-outline)',
};

/** Work Item Type Emoji */
export const TYPE_EMOJI: Record<string, string> = {
  feature: '🟢',
  bugfix: '🔴',
  refactor: '🔵',
  docs: '📄',
  test: '🧪',
  chore: '⚙️',
  unknown: '⬜',
};
