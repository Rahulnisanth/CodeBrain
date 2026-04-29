# Changelog

## 1.0.1 (2026-04-23)

- **fix:** Update VS Code version requirement to ^1.115.0

## 1.0.2 (2026-04-23)

- **patch:** Update new extension icon

## 1.0.3 (2026-04-28)

- **docs:** Clarify GitHub PAT requirement to use Classic token with all repo scopes in README and User Guide
- **fix:** Update credential prompt text and placeholder in `src/auth/credentials.ts` to specify GitHub Personal Access Token (Classic) with all repo scopes

## 1.0.4 (2026-04-28)

- **fix:** Bug fixes and performance improvments

## 1.0.5 (2026-04-29)

### Bug Fixes

- **fix:** Active time no longer resets to 0 on VS Code window refresh — session minutes are now persisted to `~/.codeBrainPro/sidebar-active-time.json` and restored on activation

### Refactor

- **refactor:** Centralized all magic numbers, file paths, prompt strings, and icon/emoji maps into a single `src/constants.ts` module
- **refactor:** Consolidated scattered interface definitions (`CommitInfo`, `GroupResult`, `ReportData`, `RepoMetadata`, `PersistedActiveTime`) into `src/types.ts`
- **refactor:** Removed inline constants from `gitClient.ts`, `classifier.ts`, `grouper.ts`, `riskDetector.ts`, `githubSync.ts`, `sidebarProvider.ts`, `sidebarState.ts`, `reportBuilder.ts`, `markdownExporter.ts`, `secrets.ts`, `storage.ts`, and `promptTemplates.ts` in favour of shared imports
- **refactor:** Removed section-divider comments from `sessionManager.ts` and `sidebarState.ts`
