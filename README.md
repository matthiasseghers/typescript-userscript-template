# TypeScript Userscript Template

[![CI](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/ci.yml/badge.svg)](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/ci.yml)
[![Release](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/release.yml/badge.svg)](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/release.yml)
[![Latest Release](https://img.shields.io/github/v/release/matthiasseghers/typescript-userscript-template)](https://github.com/matthiasseghers/typescript-userscript-template/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional template for building userscripts with TypeScript, allowing you to write modular, type-safe, **tested** code that compiles into a single userscript file.

## Why Use This Template?

- **Type safety** — catch bugs at compile-time instead of in production. TypeScript stops common errors before they reach users.
- **Modularity** — split monolithic scripts into focused, reusable modules instead of scrolling through 1000+ line files.
- **Built-in testing** — write tests with Vitest and verify your code works before releasing it.
- **IDE support** — full autocomplete for GM APIs, refactoring, and go-to-definition across the codebase.
- **Modern tooling** — ESLint, Prettier, Husky, and GitHub Actions already configured.
- **Tree-shaking** — unused code is stripped out, so importing libraries doesn't bloat the userscript.
- **Maintainability** — clear structure plus types means you can come back months later and still understand what you wrote.

## Installation

Download the latest built userscript from the [GitHub Releases](https://github.com/matthiasseghers/typescript-userscript-template/releases/latest) page and install it in your userscript manager.

*(After running setup, your releases live at `https://github.com/<your-username>/<your-repo>/releases/latest`.)*

> **Note:** `dist/` is gitignored — builds are attached as release artifacts, not committed to the repo.

## Using This Template

**Option 1: Use GitHub Template (Recommended)**
1. Click the "**Use this template**" button at the top of this repository
2. Choose a name for your new repository
3. Clone your new repository
4. Run `npm run setup`
5. Start coding!

**Option 2: Clone Directly**
```bash
git clone https://github.com/yourusername/typescript-userscript-template.git my-userscript
cd my-userscript
rm -rf .git  # Remove template git history
git init     # Start fresh
npm run setup
```

### What does `npm run setup` do?

Running `npm run setup` launches an interactive wizard that configures the template for your project in one go:

- Asks for your userscript name, description, author, GitHub username, and repository name
- Confirms your inputs before making any changes — restarts if anything looks wrong
- Patches `package.json`, `meta.json`, and `README.md` with your details
- Resets `meta.json`'s version to `0.1.0` so your project starts its own version line
- Deletes any `v*` tags inherited from the template (relevant when cloning with history)
- Asks whether to keep a `templateProvenance` record in `package.json` — the template version you started from, used as the "since" marker when adopting template updates later
- Runs `npm install` automatically
- Removes template-specific files (`MIGRATION_GUIDE.md` and the setup wizard's own test)
- Removes itself — the setup script has no place in your actual project

After setup completes, everything is configured and ready to go.

## Features

- **TypeScript support** - full TypeScript features and type checking
- **Modular code** - split your userscript into multiple files and modules
- **Testing framework** - Vitest included for unit and integration tests
- **Automatic bundling** - Rollup bundles everything into a single userscript file
- **Tree-shaking** - unused code is removed from the final bundle
- **GM API support** - TypeScript types for the Tampermonkey/Greasemonkey APIs
- **Userscript metadata** - injects the userscript header from `meta.json`
- **Development mode** - watch mode with inline sourcemaps for debugging
- **Code quality** - ESLint + Prettier for consistent code style, jscpd duplicate-code detection
- **Security scanning** - CodeQL and Semgrep for vulnerability detection
- **Dependency auditing** - npm audit gates production deps in CI; full scans in the Security workflow
- **Pre-commit hooks** - validation before commits with Husky
- **CI/CD** - GitHub Actions for automated testing and releases

## Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml            # Continuous integration (lint, test, build)
│       ├── security.yml      # Security scanning (CodeQL, npm audit, Semgrep)
│       └── release.yml       # Bumps version, tags, builds, publishes GitHub Release
├── scripts/
│   ├── setup.js               # One-time setup wizard (self-deletes after running)
│   ├── update-meta-version.js # Bumps meta.json version (used by the release workflow)
│   └── check-grants.js        # Validates GM API grants in meta.json
├── src/
│   ├── index.ts       # Main entry point
│   └── utils.ts       # Utility functions (example — replace freely)
├── tests/
│   ├── setup.test.ts  # Tests for the setup wizard (template-only, removed by setup)
│   ├── utils.test.ts  # Example tests for utilities
│   └── index.test.ts  # Example tests for main logic
├── dist/                   # Gitignored — created by build
│   └── userscript.user.js  # Built userscript (auto-generated)
├── meta.json          # Userscript metadata
├── vitest.config.ts   # Test configuration
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
├── rollup.config.js   # Build configuration
├── eslint.config.js   # ESLint configuration
├── .jscpd.json        # Duplicate code detection configuration
├── .prettierrc        # Prettier configuration
└── LICENSE            # MIT License
```

## Quick Start

### 1. Run Setup

```bash
npm run setup
```

This launches the interactive wizard, patches all files with your project details, and runs `npm install` automatically. See [What does `npm run setup` do?](#what-does-npm-run-setup-do) for details.

### 2. Configure Your Userscript

Edit `meta.json` to customize your userscript metadata:

```json
{
  "name": "My TypeScript Userscript",
  "namespace": "https://github.com/yourusername",
  "version": "0.1.0",
  "description": "A userscript built with TypeScript",
  "author": "Your Name",
  "match": [
    "https://example.com/*"
  ],
  "grant": [
    "GM_addStyle",
    "GM_getValue",
    "GM_setValue"
  ],
  "run-at": "document-end"
}
```

**Key fields:**
- `match`: URLs where your userscript runs
- `grant`: GM API permissions your script needs (see [Available GM APIs](#available-gm-apis))
- `run-at`: When to run the script (`document-start`, `document-end`, or `document-idle`)
- `connect`: (Optional) Domains allowed for `GM_xmlhttpRequest` cross-origin requests. Only add if you use `GM_xmlhttpRequest`. Example: `["api.example.com", "cdn.example.org"]`
- `version`: **This is your userscript version** - what users see in Tampermonkey. The Release workflow bumps it automatically (see [Creating a Release](#creating-a-release)); it starts at `0.1.0` after setup.

**Versioning:**

`meta.json`'s `version` is the single source of truth — it is the version Tampermonkey shows and the version the Release workflow bumps and tags. The `version` in `package.json` is plain npm metadata: no workflow touches it, and it only matters if you ever publish the project to npm.

In this template repository, releases demonstrate the pipeline using the bundled example script — a fork's releases look exactly the same, with your own script.

### 3. Build Your Userscript

```bash
# Production build (optimized, no sourcemaps)
npm run build

# Development mode (watch mode with inline sourcemaps for debugging)
npm run dev
```

The built userscript will be in `dist/userscript.user.js`.

### 4. Install in Your Browser

1. Install a userscript manager extension:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)

2. Open `dist/userscript.user.js` and copy its contents

3. Create a new userscript in your userscript manager and paste the code

## Development Workflow

1. **Write TypeScript code** in the `src/` directory
   - `src/index.ts` is the main entry point
   - Create additional `.ts` files as needed
   - Import/export modules as usual

2. **Write tests** for your code:
   ```bash
   npm test              # Run tests once
   npm run test:watch    # Watch mode for test-driven development
   npm run test:ui       # Interactive UI for exploring tests
   npm run test:coverage # Generate coverage report
   ```

3. **Lint and format your code**:
   ```bash
   npm run lint              # Check TypeScript files
   npm run lint:fix          # Auto-fix TypeScript files
   npm run lint:scripts      # Check JavaScript files in scripts/
   npm run lint:scripts:fix  # Auto-fix JavaScript files
   npm run format            # Format code with Prettier
   ```

4. **Run in watch mode** during development:
   ```bash
   npm run dev  # Includes inline sourcemaps for debugging
   ```

5. **Test in browser**:
   - After each build, copy the updated `dist/userscript.user.js` to your userscript manager
   - Or set up automatic reloading (see Tips below)

## Writing Your Userscript

### Example: Testing Your Code

The template includes Vitest for testing. Write tests alongside your code:

```typescript
// tests/utils.test.ts
import { describe, it, expect } from 'vitest';
import { log } from '../src/utils';

describe('utils', () => {
  it('should log with prefix', () => {
    // Your test logic here
  });
});
```

See the MIGRATION_GUIDE.md for more testing examples.

### Example: Basic Structure

```typescript
// src/index.ts
import { log, waitForElement } from './utils';

async function main(): Promise<void> {
  log('Userscript started!');
  
  try {
    const element = await waitForElement('#my-element');
    element.textContent = 'Modified by userscript!';
  } catch (error) {
    console.error('Error:', error);
  }
}

// Start the userscript
// Note: With @run-at document-end, the DOM is already loaded
main();
```

### Example: Creating Utilities

```typescript
// src/utils.ts — log() and waitForElement() ship with the template
export function log(message: string): void {
  console.log(`[UserScript] ${message}`);
}

// waitForElement polls with requestAnimationFrame and rejects
// after a configurable timeout (default 5 000 ms).
// See src/utils.ts for the full implementation.

// Using GM APIs
export function addStyles(css: string): void {
  GM_addStyle(css);
}

export async function store(key: string, value: any): Promise<void> {
  await GM_setValue(key, value);
}

export async function retrieve<T>(key: string, defaultValue?: T): Promise<T> {
  return await GM_getValue(key, defaultValue);
}

export function notify(text: string, title?: string): void {
  GM_notification({ text, title: title || 'UserScript' });
}
```

### Available GM APIs

The template includes TypeScript support for:

- **`GM_addStyle(css)`** - Add CSS styles to the page
- **`GM_getValue(key, default)`** - Get stored value (persistent across page loads)
- **`GM_setValue(key, value)`** - Store value persistently
- **`GM_deleteValue(key)`** - Delete stored value
- **`GM_xmlhttpRequest(details)`** - Make cross-origin HTTP requests
- **`GM_notification(details)`** - Show desktop notifications
- **`GM_openInTab(url)`** - Open URL in new tab
- **`GM_setClipboard(text)`** - Copy text to clipboard
- **`GM_registerMenuCommand(name, fn)`** - Add menu command
- **And many more...**

All functions have full TypeScript autocomplete and type checking!

## Tips

- **GM API autocomplete**: The `@types/tampermonkey` package provides full TypeScript support. Just start typing `GM_` and VS Code will show available functions!

- **Grant permissions**: Always add the GM functions you use to the `grant` array in [meta.json](meta.json), otherwise they won't work

- **Cross-origin requests**: If you use `GM_xmlhttpRequest` to make requests to external domains, add those specific domains to the `connect` array. Example: `"connect": ["api.github.com", "cdn.example.com"]`. Avoid using `"*"` wildcard for security reasons.

- **Multiple userscripts**: Duplicate this template folder for each userscript project

- **Source maps**: Use `npm run dev` for development builds with inline source maps to debug TypeScript in browser DevTools. Production builds (`npm run build`) exclude source maps for smaller file size.

- **Tree-shaking**: Unused exports are automatically removed from the bundle. Only code you actually import and use will be included

- **Background tabs**: `waitForElement` polls with `requestAnimationFrame`, which browsers pause in background tabs — polling resumes and the timeout fires once the tab is visible again.

## Customization

### Adding Dependencies

You can install and use npm packages:

```bash
npm install <package-name>
```

Then import them in your TypeScript files:

```typescript
import { someFunction } from 'package-name';
```

### Modifying Build Configuration

Edit `rollup.config.js` to customize the build process:
- Change output format
- Add additional plugins
- Enable/disable source maps (set `sourcemap: true` for debugging)
- etc.

### TypeScript Configuration

Edit `tsconfig.json` to adjust TypeScript compiler options:
- Target ECMAScript version
- Strict mode settings
- Library inclusions
- `noUnusedLocals` and `noUnusedParameters` - Reports unused variables/parameters at compile time
- etc.

### Linting and Formatting

The template includes ESLint and Prettier:

**Configuration files:**
- `eslint.config.js` - ESLint rules (TypeScript-aware)
- `.prettierrc` - Code formatting preferences
- `.prettierignore` - Files to skip formatting

**Customization:**
- Modify `eslint.config.js` to add/change linting rules
- Update `.prettierrc` for different formatting preferences
- Add GM globals to ESLint if you use additional GM functions

## Installation & Distribution

Users can install your userscript in multiple ways:

### Method 1: From GitHub Releases (Recommended)

After creating a release (see [Creating a Release](#creating-a-release)), users can install from:

```
https://github.com/user/repo/releases/latest/download/userscript.user.js
```

Replace `user/repo` with your GitHub username and repository name.

### Method 2: Build Locally

Users can clone your repo and build manually:

```bash
git clone https://github.com/user/repo.git
cd repo
npm install
npm run build
# Install dist/userscript.user.js in Tampermonkey/Greasemonkey
```

### Method 3: Development Installation

For development, you can use Tampermonkey's built-in editor or a local file:

```bash
npm run dev  # Watch mode with sourcemaps
# Point Tampermonkey to file:///path/to/dist/userscript.user.js
```

## CI/CD with GitHub Actions

Three workflows are included:

**`.github/workflows/ci.yml`** - Continuous Integration:
- Runs on every push and pull request
- **Dependency audit** (fails on high/critical vulnerabilities)
- Linting, formatting, type checking (TypeScript + scripts)
- **Runs test suite to catch bugs**
- Grant validation and markdown link checks
- **Coverage thresholds enforced** — `npm run test:coverage` must meet 80% minimums
- **Post-setup job** — runs the real setup wizard and asserts the post-setup state
- Builds the project to ensure everything works
- Ensures code quality and catches issues early

**`.github/workflows/security.yml`** - Security Scanning:
- Runs on push/PR and weekly schedule
- **CodeQL analysis** for JavaScript/TypeScript security vulnerabilities
- **Semgrep scanning** for XSS and JavaScript-specific security issues
- Reports findings to GitHub Security tab

**`.github/workflows/release.yml`** - Release:
- **Triggered automatically** when a `v*` tag is pushed
- Can also be triggered manually from the Actions UI: choose a bump type (patch/minor/major) to bump `meta.json`, tag, build, and publish in one run — or `none` to re-release the latest tag (retry after a failed release)

### How it fits together

```
Release (manual, bump: patch/minor/major) → bumps meta.json → tags vX.Y.Z → builds → publishes
Release (manual, bump: none) → re-releases the latest tag
Release (automatic) → any v* tag push validates and publishes
```

> **Warning:** Manually pushed tags must match `meta.json`'s version or the release fails with both versions printed.

### Creating a Release

1. Go to **Actions** tab in your GitHub repository
2. Select the **Release** workflow
3. Click **Run workflow**
4. Choose the bump type:
   - **patch**: 0.1.0 → 0.1.1 (bug fixes)
   - **minor**: 0.1.0 → 0.2.0 (new features)
   - **major**: 0.1.0 → 1.0.0 (breaking changes)
   - **none**: re-release the latest tag
5. Click **Run workflow**

This automatically:
- Validates your `repository.url` points at this repository
- Bumps `meta.json`, commits, and pushes the `v*` tag (unless bump is `none`)
- Builds the userscript and creates the GitHub Release with the artifact attached

Users can then install directly from the release:
```
https://github.com/user/repo/releases/latest/download/userscript.user.js
```

### Re-releasing or recovering a failed release

If the release step failed after the bump (e.g. a flaky runner or build error), the tag is already in place — you don't need to bump again. Re-run **Actions → Release → Run workflow** with bump type `none` to re-release the existing tag.

**To remove CI/CD:** Simply delete the `.github/workflows/` folder if you don't need it.

## Updating from Template

**Note:** This template is a **starting point** - most users heavily customize it. Updates are **optional** and typically only needed if you want new features from the template. A fork is a frozen snapshot: it never breaks when the template changes.

### What changed upstream?

Your `package.json` records the template version you started from (unless you declined during setup):

```bash
npm pkg get templateProvenance
```

Then check the [template repository](https://github.com/matthiasseghers/typescript-userscript-template) for releases newer than that version — the release notes describe what changed.

### Adopting updates

```bash
git remote add template https://github.com/matthiasseghers/typescript-userscript-template.git
git fetch template
git checkout template/main -- .github/workflows rollup.config.js eslint.config.js tsconfig.json vitest.config.ts scripts/
```

This pulls whole files, which is safe when you never customized them. For a single fix, use `git cherry-pick <commit-sha>` instead.

> **Note:** GitHub's **Sync fork** button only exists on true forks. Repos created via **Use this template** are independent repositories, so the git remote recipe above is the reliable update path.

| Template-owned (safe to pull wholesale) | Yours (never touched by updates) |
|---|---|
| `.github/workflows/`, `scripts/`, `rollup.config.js`, `eslint.config.js`, `tsconfig.json`, `vitest.config.ts`, `.prettierrc`, `.jscpd.json` | `src/`, `tests/`, `meta.json`, `README.md`, `package.json` identity fields |

### Maintaining multiple scripts from this template

As your collection of userscripts grows, escalate in stages — each stage has a trigger, so don't build ahead of the triggers:

1. **Git-native sync** (always available) — the remote recipe above, per repository
2. **Reusable workflows in a separate central repo** — when you maintain 3+ actively developed scripts and have manually replicated the same CI change more than once; keep the template self-contained for adopters
3. **Shared utils as an npm package** — when real shared runtime code emerges across scripts
4. **Config presets / scaffold CLI** — when config churn or onboarding repetition justifies it

Dependency updates are handled by Dependabot (configured in `.github/dependabot.yml`): weekly minor/patch and security updates for npm and GitHub Actions, grouped into batched PRs. Semver-major bumps are intentionally ignored — apply those deliberately.

## Troubleshooting

### Build fails with "Cannot find module"
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Linting errors about GM_ functions
- TypeScript handles GM_ type checking via `@types/tampermonkey`
- Add GM functions you use to `meta.json` grants
- Run `npm run check-grants` to validate

### Userscript not working in browser
- Check that all GM functions are listed in `meta.json` grants
- Verify the `@match` pattern matches your target URLs
- Check browser console for errors

### TypeScript errors
- Ensure `@types/tampermonkey` is installed: `npm install --save-dev @types/tampermonkey`
- Run `npm run type-check` to see all type errors
- Check that your tsconfig.json is properly configured

### Format/lint errors before commit
- Run `npm run validate` to check everything at once
- Use `npm run lint:fix` and `npm run format` to auto-fix issues

### Release failed
- The Release workflow bumps, tags, builds, and publishes in a single run — if a later step failed after the bump, re-run it with bump type `none` to re-release the existing tag
- Check that `meta.json`'s version matches the tag you are releasing

## Scripts Reference

**Setup (one-time):**
- `npm run setup` - Interactive project setup wizard — configures all files, records template provenance, and installs dependencies. Self-deletes after running.

**Build:**
- `npm run build` - Build the userscript for production (no sourcemaps)
- `npm run dev` - Watch mode for development (with inline sourcemaps)

**Testing:**
- `npm test` - Run tests once
- `npm run test:watch` - Watch mode for tests
- `npm run test:ui` - Interactive test UI dashboard
- `npm run test:coverage` - Generate coverage report (80% thresholds enforced in CI)

**Code Quality:**
- `npm run lint` - Check TypeScript files for linting errors
- `npm run lint:fix` - Auto-fix TypeScript linting errors
- `npm run lint:scripts` - Check JavaScript files in scripts/
- `npm run lint:scripts:fix` - Auto-fix JavaScript linting errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run type-check` - Run TypeScript type checking (includes unused code detection)

**Validation:**
- `npm run check-grants` - Validate GM API grants
- `npm run check-links` - Check for broken links in markdown files
- `npm run validate` - Run all checks including tests (recommended before committing)

## License

MIT

## Contributing

Feel free to customize this template for your needs!