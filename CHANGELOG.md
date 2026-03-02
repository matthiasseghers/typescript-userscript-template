# Changelog

All notable changes to this template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/matthiasseghers/typescript-userscript-template/compare/v1.1.0...HEAD)

## [v1.1.0](https://github.com/matthiasseghers/typescript-userscript-template/compare/v1.0.0...v1.1.0) - 2026-03-02

### Added

- Automated version bump workflow (`.github/workflows/version-bump.yml`)
  - **Option to bump both package.json and meta.json** (userscript version)
  
- Clean release workflow that attaches builds to GitHub releases
- Test script for version bumps (`scripts/test-version-bump.sh`)
- Comprehensive testing with Vitest
- Markdown link checking in separate CI job
- CHANGELOG.md to track template improvements

### Changed

- Simplified CI workflow to run tests before build
- Updated release workflow to use GitHub releases instead of committing builds
- Removed version sync between `package.json` and `meta.json`
- Improved `.gitignore` to exclude all build artifacts
- Updated Husky pre-commit hook for v10 compatibility

### Removed

- `check-version-sync` script (no longer needed for templates)
- Auto-deployment workflow that committed builds to repo
- Tracking of `dist/` directory in git

## [1.0.0](https://github.com/matthiasseghers/typescript-userscript-template/releases/tag/v1.0.0) - 2024-01-01

Initial release of TypeScript Userscript Template.

### Added

- TypeScript support with full type checking
- Rollup bundler configuration
- ESLint and Prettier for code quality
- Husky pre-commit hooks
- GM API TypeScript definitions
- Basic CI/CD with GitHub Actions
- Vitest for testing
- Grant validation script
- Auto-deployment to GitHub
