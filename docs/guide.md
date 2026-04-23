# CodeBrain — User Guide

> **Version:** 1.0.0 · **Publisher:** Rahulnisanth · **Platform:** VS Code

---

## What is CodeBrain?

CodeBrain is a VS Code extension that **silently watches your coding activity**, classifies your commits using Google Gemini AI, and turns everything into professional work reports — daily summaries, weekly logs, and appraisal-ready documents.

You just code. CodeBrain tells your story.

---

## Table of Contents

1. [Installation](#1-installation)
2. [First-Time Setup](#2-first-time-setup)
3. [The Status Bar](#3-the-status-bar)
4. [The Sidebar](#4-the-sidebar)
5. [Commands](#5-commands)
6. [Generating Reports](#6-generating-reports)
7. [Ask About My Work](#7-ask-about-my-work)
8. [GitHub Sync (Optional)](#8-github-sync-optional)
9. [Settings Reference](#9-settings-reference)
10. [How Tracking Works](#10-how-tracking-works)
11. [AI Classification](#11-ai-classification)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Installation

### From VS Code Marketplace _(coming soon)_

1. Open VS Code
2. Go to **Extensions** (`Cmd+Shift+X`)
3. Search for **CodeBrain**
4. Click **Install**

### From VSIX (Manual Install)

1. Download the `.vsix` file from [GitHub Releases](https://github.com/Rahulnisanth/CodeBrain/releases)
2. Open VS Code → `Cmd+Shift+P` → **Install from VSIX...**
3. Select the downloaded file

> **Requirements:** VS Code `^1.96.0` · Node.js `≥ 18.x` · An open Git repository

---

## 2. First-Time Setup

When VS Code starts with CodeBrain installed, you'll see a welcome prompt:

```text
🚀 CodeBrain is active! AI-powered activity tracking enabled.

  [Configure]   [Don't show again]
```

Click **Configure** to open Settings, or dismiss and set up on demand.

### Step 1 — Add Your GitHub Credentials

CodeBrain needs a GitHub Personal Access Token (PAT) to sync your activity logs.

1. Run command: `CodeBrain: Sync to GitHub Now` (or any sync action)
2. You'll be prompted:
   - **GitHub username** — your GitHub handle
   - **GitHub PAT** — paste your token (it's stored securely, never in plain text)

**How to create a GitHub PAT:**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select scopes: `repo` (full control of private repos)
4. Copy the token and paste it when CodeBrain prompts you

> **Security note:** Your token is stored in VS Code Secret Storage — the same secure vault used by the GitHub Cobrain extension. It is never written to any settings file.

### Step 2 — Add Your Gemini API Key _(optional, for AI features)_

AI-powered classification, commit grouping, and report narratives require a Google Gemini API key.

1. Run any AI feature (e.g. `CodeBrain: Generate Daily Report`)
2. CodeBrain will prompt you for your Gemini API key

**How to get a Gemini API key:**

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API key**
3. Copy and paste it when prompted

> **Without a Gemini key**, CodeBrain still works — commit classification falls back to keyword matching and reports are generated without AI narratives.

---

## 3. The Status Bar

Once active, CodeBrain shows a live indicator in the bottom-left of VS Code:

```text
⏱ CodeBrain: 4h 32m active today
```

| State         | Appearance                              | Meaning                                         |
| ------------- | --------------------------------------- | ----------------------------------------------- |
| Tracking      | `⏱ CodeBrain: Xh Xm active today`       | Normal — counting your active coding time       |
| Risk detected | `⚠ CodeBrain: Xh Xm active — X risk(s)` | Amber background — uncommitted changes detected |
| Syncing       | `↻ CodeBrain: Syncing...`               | Spinner while pushing to GitHub                 |

**Click the status bar item** to open the CodeBrain sidebar.

---

## 4. The Sidebar

Open the sidebar by clicking the status bar item or pressing `Cmd+Shift+P` → **CodeBrain: Open Sidebar**.

The sidebar has four collapsible sections:

```text
CODE BRAIN
├── 📅 Today's Activity
│   ├── Active Time: 4h 32m
│   ├── Commits Today: 7
│   └── Repos: my-project, backend-api
│
├── 📦 Work Units (This Week)
│   ├── 🟢 Auth System Refactor         [feature]
│   ├── 🔴 Fix null pointer on login    [bugfix]
│   └── 🔵 Clean up API types           [refactor]
│
├── ⚠️ Risks
│   └── my-project: 78 lines uncommitted (1h 20m)
│
└── 📊 Reports
    ├── Generate Daily Report
    ├── Generate Weekly Report
    ├── Generate Monthly Report
    ├── Generate Appraisal Report
    └── Ask a Question...
```

### Today's Activity

Shows your active coding time, commit count, and repos worked on today.

### Work Units

AI-grouped clusters of related commits. Each unit shows:

- A human-readable task name (AI-generated)
- Work type label: `feature`, `bugfix`, `refactor`, `docs`, `test`, or `chore`
- Number of commits in the group

### Risks

Flags repos with large amounts of uncommitted changes. Click a risk item to open Source Control.

### Reports

Quick-access buttons for all report types and the Ask a Question chat.

---

## 5. Commands

Access all commands via `Cmd+Shift+P` and type `CodeBrain:`.

| Command                                | What it does                                            |
| -------------------------------------- | ------------------------------------------------------- |
| `CodeBrain: Start Tracking`            | Begin tracking activity across all detected repos       |
| `CodeBrain: Stop Tracking`             | Pause tracking                                          |
| `CodeBrain: Set Commit Interval`       | Set how often auto-commit snapshots are taken (minutes) |
| `CodeBrain: Generate Daily Report`     | Report for the last 24 hours                            |
| `CodeBrain: Generate Weekly Report`    | Report for the last 7 days                              |
| `CodeBrain: Generate Monthly Report`   | Report for the last 30 days                             |
| `CodeBrain: Generate Appraisal Report` | Report for a custom date range                          |
| `CodeBrain: Ask About My Work`         | Open the AI chat panel                                  |
| `CodeBrain: Sync to GitHub Now`        | Push activity logs to your GitHub codebrain-logs repo   |
| `CodeBrain: View Today's Activity Log` | Open today's raw JSON activity log                      |
| `CodeBrain: Clear Credentials`         | Wipe stored GitHub PAT and Gemini key                   |
| `CodeBrain: Open Settings`             | Jump to CodeBrain settings                              |
| `CodeBrain: Open Sidebar`              | Focus the CodeBrain sidebar panel                       |

---

## 6. Generating Reports

### Daily Report

Covers the last 24 hours. Good for standups.

1. `Cmd+Shift+P` → `CodeBrain: Generate Daily Report`
2. Report generates and opens as a Markdown preview
3. File saved to `~/.codeBrain/reports/YYYY-MM-DD-daily.md`

### Weekly Work-Log

Covers the last 7 days. Good for weekly check-ins.

1. `Cmd+Shift+P` → `CodeBrain: Generate Weekly Report`
2. Saved to `~/.codeBrain/reports/YYYY-WW-weekly.md`

### Monthly Summary

Covers the last 30 days.

1. `Cmd+Shift+P` → `CodeBrain: Generate Monthly Report`

### Appraisal Report _(most powerful)_

Custom date range — ideal for performance reviews.

1. `Cmd+Shift+P` → `CodeBrain: Generate Appraisal Report`
2. Enter **start date** → `2026-01-01`
3. Enter **end date** → `2026-03-31`
4. Report generates covering the full period

### What's in a Report?

Each report contains:

| Section                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| **Achievement Highlights** | AI-generated 2–3 sentence narrative of your work     |
| **Time Summary**           | Total active coding time, daily breakdown table      |
| **Work Units**             | Grouped tasks with type labels and commit counts     |
| **Repository Breakdown**   | Time and commits per repo                            |
| **Top Files**              | Most frequently edited files                         |
| **Risk Flags**             | Large uncommitted changes detected during the period |

### Exporting Reports

Reports are saved as **Markdown** by default. To get JSON:

- The JSON format is available for programmatic integrations
- Find reports in `~/.codeBrain/reports/`

---

## 7. Ask About My Work

The AI chat panel lets you ask natural language questions about your work history.

1. `Cmd+Shift+P` → `CodeBrain: Ask About My Work`  
   _(or click "Ask a Question..." in the sidebar Reports section)_
2. A chat panel opens in a side column
3. Type your question and press **Enter** or click **Ask**

### Example Questions

- _"What did I work on this week?"_
- _"How many bug fixes did I ship last month?"_
- _"Which repos did I spend the most time in?"_
- _"Summarize my work from January to March"_
- _"What features did I build this sprint?"_

> **Requires a Gemini API key.** Without one, CodeBrain will prompt you to add one or show a fallback message.

---

## 8. GitHub Sync (Optional)

CodeBrain can optionally push your structured activity logs to a private or public GitHub repository called `codebrain-logs`.

### Enable Sync

1. Open Settings → `codeBrain.syncEnabled` → set to `true`
2. Set `codeBrain.syncFrequencyHours` (default: 24h)

Or trigger a manual sync any time:
`Cmd+Shift+P` → `CodeBrain: Sync to GitHub Now`

### What Gets Synced?

```text
codebrain-logs (GitHub repo)
└── logs/
    └── 2026/
        └── 04/
            └── 13.json    ← today's activity log
```

The `codebrain-logs` repository is created automatically on first sync if it doesn't exist.

---

## 9. Settings Reference

Open settings: `Cmd+Shift+P` → `CodeBrain: Open Settings`

| Setting                           | Type     | Default | Description                                            |
| --------------------------------- | -------- | ------- | ------------------------------------------------------ |
| `codeBrain.enabled`               | boolean  | `true`  | Enable/disable all tracking                            |
| `codeBrain.githubUsername`        | string   | `""`    | Your GitHub username                                   |
| `codeBrain.additionalRepoPaths`   | string[] | `[]`    | Extra repo paths to track beyond open workspaces       |
| `codeBrain.commitIntervalMinutes` | number   | `30`    | Interval between auto-commit log snapshots             |
| `codeBrain.idleThresholdMinutes`  | number   | `5`     | Minutes of no activity before marking as idle          |
| `codeBrain.riskThresholdLines`    | number   | `50`    | Lines of uncommitted changes to trigger a risk warning |
| `codeBrain.riskThresholdMinutes`  | number   | `60`    | Minutes without a commit before risk warning fires     |
| `codeBrain.syncEnabled`           | boolean  | `false` | Auto-sync logs to GitHub                               |
| `codeBrain.syncFrequencyHours`    | number   | `24`    | Hours between auto-syncs                               |
| `codeBrain.logRetentionDays`      | number   | `90`    | Days to keep local activity logs                       |
| `codeBrain.showStartupPrompt`     | boolean  | `true`  | Show welcome prompt on VS Code startup                 |

### Tips for Common Setups

**Make risk alerts more sensitive:**

```json
"codeBrain.riskThresholdLines": 20,
"codeBrain.riskThresholdMinutes": 30
```

**Track additional repos not open in VS Code:**

```json
"codeBrain.additionalRepoPaths": [
  "/Users/you/projects/backend",
  "/Users/you/projects/mobile-app"
]
```

**Disable daily sync prompt:**

```json
"codeBrain.showStartupPrompt": false
```

---

## 10. How Tracking Works

CodeBrain tracks your work through two complementary mechanisms:

### Activity Events (Real-time)

Every time you edit a file, CodeBrain records:

- Which file changed
- How many lines were added/removed
- Which language you're working in
- Which repo it belongs to
- A timestamp

This happens silently in the background with zero performance impact.

### Commit Detection (Every 5 minutes)

CodeBrain polls your repo(s) for new commits every 5 minutes. When a new commit is found:

1. It's classified by AI (or keyword fallback)
2. It's added to the Work Unit grouper
3. The sidebar refreshes automatically

### Session Detection

CodeBrain automatically detects when you're active vs idle:

- **Active:** You're editing files
- **Idle:** No file edits for `codeBrainidleThresholdMinutes` (default: 5 minutes)

Active time is what's shown in the status bar and reports.

### Where Data Lives

All data stays **local on your machine** at `~/.codeBrain/`:

```text
~/.codeBrain/
├── logs/               ← Daily activity event files (JSON)
├── reports/            ← Generated report files (Markdown/JSON)
├── classifier-cache.json   ← AI classification results (cached)
├── seen-commits.json       ← Tracks which commits CodeBrain has seen
└── risks.json              ← Log of risk events
```

> **Privacy:** CodeBrain never transmits your source code. Only commit messages and `git diff --stat` summaries are sent to the Gemini API.

---

## 11. AI Classification

When a new commit is detected, CodeBrain classifies it into one of these work types:

| Icon | Type       | Examples                                        |
| ---- | ---------- | ----------------------------------------------- |
| 🟢   | `feature`  | "Add user authentication", "Implement search"   |
| 🔴   | `bugfix`   | "Fix null pointer crash", "Patch login error"   |
| 🔵   | `refactor` | "Clean up API types", "Rename service layer"    |
| 📄   | `docs`     | "Update README", "Add API documentation"        |
| 🧪   | `test`     | "Add unit tests for auth", "Fix flaky e2e test" |
| ⚙️   | `chore`    | "Update dependencies", "Configure CI pipeline"  |
| ⬜   | `unknown`  | Insufficient signal to classify                 |

### With Gemini API Key

Gemini reads the commit message and diff summary to determine type + confidence score + one-sentence summary.

### Without Gemini API Key (Keyword Fallback)

CodeBrain uses keyword matching on the commit message:

| Keywords                                          | → Type     |
| ------------------------------------------------- | ---------- |
| `fix`, `bug`, `patch`, `hotfix`, `issue`, `error` | `bugfix`   |
| `feat`, `add`, `new`, `implement`, `create`       | `feature`  |
| `refactor`, `clean`, `restructure`, `rename`      | `refactor` |
| `doc`, `readme`, `docs`, `comment`                | `docs`     |
| `test`, `spec`, `unit`, `e2e`                     | `test`     |
| `chore`, `dep`, `ci`, `build`, `config`           | `chore`    |

---

## 12. Troubleshooting

### Status bar not showing

Make sure:

- You have a `.git` folder in your open workspace
- `codeBrainenabled` is `true` in settings
- Run `CodeBrain: Start Tracking` from the command palette

### Gemini API errors

- Verify your key is valid at [aistudio.google.com](https://aistudio.google.com)
- Run `CodeBrain: Clear Credentials` and re-enter your key
- Check your API quota hasn't been exceeded
- CodeBrain will fall back to keyword classification automatically

### GitHub sync failing

- Verify your PAT has `repo` scope on GitHub
- Run `CodeBrain: Clear Credentials` and re-enter your token
- Check your internet connection
- Ensure your PAT hasn't expired

### Reports showing 0 activity

The report builder reads from `~/.codeBrain/logs/`. Check:

- You've had the extension running for at least a few hours
- Run `CodeBrain: View Today's Activity Log` — if the file exists, data is there
- Each file edit generates an event, so you should see entries

### "No activity log for today yet" message

This is normal if you just installed CodeBrain or haven't edited any files in the current workspace yet. Edit any tracked file and check again in a minute.

### Extension not activating

CodeBrain activates when VS Code detects a `.git` folder. Make sure:

- Your workspace has a `.git` folder (it's a Git repo)
- The extension is enabled (not disabled in Extensions panel)

---

## Changelog

### v1.0.0 — Initial Release

- AI-powered commit classification via Google Gemini
- Smart commit grouper into logical Work Units
- Real-time activity tracking (edit and focus events)
- Daily / Weekly / Monthly / Appraisal report generation
- Natural language Q&A chat panel
- Multi-repo support
- Risk detector with VS Code notifications
- Live status bar with active time counter
- Sidebar tree view
- Optional GitHub sync to codebrain-logs repo
- Secure credential storage via VS Code Secret Storage

---

## Privacy & Security

| Concern                      | CodeBrain Behaviour                                                |
| ---------------------------- | ------------------------------------------------------------------ |
| Source code                  | **Never sent anywhere.** Stays on your machine.                    |
| Commit messages & diff stats | Sent to Gemini API for classification (optional, can disable AI)   |
| GitHub PAT                   | Stored in VS Code Secret Storage, never in plaintext               |
| Gemini API key               | Stored in VS Code Secret Storage, never in plaintext               |
| Activity logs                | Stored locally at `~/.codeBrain/`. Optional GitHub sync if enabled |

---

_Made with ❤️ by Rahulnisanth · [GitHub](https://github.com/Rahulnisanth/CodeBrain)_
