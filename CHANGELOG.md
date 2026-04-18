# Changelog

## [1.2.0] - 2025-02-04

### Added

- Latest release of **CodePilot (CodePilot)**.
- Automatically commits changes in the workspace at set intervals.
- Configurable commit time duration (in minutes).
- Automatically pushes commits to GitHub with detailed commit messages.
- Two primary commands:
  - `extension.startAutoCommitting`: Starts the auto-commit process.
  - `extension.setTimeDuration`: Sets the time duration between auto-commits.
- **Global Repository Support**: Commits are now also pushed to a central `codepilot-logs` GitHub repository.
- GitHub Personal Access Token (PAT) authentication for seamless integration with GitHub.

### Fixed

- Startup bug
- Codebase optimization

### Changed

- Added quick selector on the mount of the extension.
- Updated the codebase comments to reflect the new features.
- Improved GitHub integration to handle global repository logging.
