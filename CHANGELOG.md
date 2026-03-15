# Changelog

All notable changes to this template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initialize TypeScript userscript template with full project structure
- Unit tests and Vitest configuration
- Enhanced build scripts with grant validation and link checks
- CI workflows for testing and release, including split version-bump and release workflows

### Fixed

- CI badge link in README
- Release workflow not triggering correctly

### Changed

- Removed combined release workflow in favour of dedicated `release.yml` triggered by tag push
- Updated README to reflect new workflow structure

### Dependencies

- Bump `undici` from 7.19.2 to 7.24.1
- Bump `minimatch` from 3.1.2 to 3.1.5
- Bump `rollup` from 4.54.0 to 4.59.0
- Bump `basic-ftp` from 5.1.0 to 5.2.0