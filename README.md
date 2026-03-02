# TypeScript Userscript Template

[![CI](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/ci.yml/badge.svg)](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/ci.yml)
[![Release](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/release.yml/badge.svg)](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional template for building userscripts with TypeScript, allowing you to write modular, type-safe, **tested** code that compiles into a single userscript file.

## Why Use This Template?

**Transform your userscript development:**

🎯 **Type Safety** - Catch bugs at compile-time, not in production. TypeScript prevents common errors before they reach users.

📦 **Modularity** - Split monolithic scripts into focused, reusable modules. No more scrolling through 1000+ line files.

🧪 **Built-in Testing** - Write tests with Vitest. Verify your code works before releasing to users.

🔍 **IDE Superpowers** - Full autocomplete for GM APIs, instant refactoring, and go-to-definition across your entire codebase.

🚀 **Modern Tooling** - ESLint, Prettier, Husky, and GitHub Actions already configured. Professional CI/CD out of the box.

⚡ **Tree-Shaking** - Automatically removes unused code. Import large libraries without bloating your userscript.

📚 **Maintainability** - Come back to your project months later and actually understand what you wrote. Clear structure + types = sustainable code.

**Stop fighting with brittle monolithic JavaScript. Start building maintainable, professional userscripts.**

## Installation

Download the latest built userscript from the [GitHub Releases](https://github.com/<yourusername>/typescript-userscript-template/releases/latest) page and install it in your userscript manager.

*(Replace `yourusername` and `typescript-userscript-template` with your actual GitHub username and repository name)*

> **Note:** `dist/` is gitignored — builds are attached as release artifacts, not committed to the repo.

## Using This Template

**Option 1: Use GitHub Template (Recommended)**
1. Click the "**Use this template**" button at the top of this repository
2. Choose a name for your new repository
3. Clone your new repository
4. Run `npm install`
5. Start coding!

**Option 2: Clone Directly**
```bash
git clone https://github.com/yourusername/typescript-userscript-template.git my-userscript
cd my-userscript
rm -rf .git  # Remove template git history
git init     # Start fresh
npm install
```

## Features

- ✅ **TypeScript Support** - Write your userscripts with full TypeScript features and type checking
- ✅ **Modular Code** - Split your code into multiple files and modules
- ✅ **Testing Framework** - Vitest included for unit and integration tests
- ✅ **Automatic Bundling** - Rollup bundles everything into a single userscript file
- ✅ **Tree-Shaking** - Unused code is automatically removed from the final bundle
- ✅ **GM API Support** - Full TypeScript support for Tampermonkey/Greasemonkey APIs
- ✅ **Userscript Metadata** - Automatically inject userscript headers from `meta.json`
- ✅ **Development Mode** - Watch mode with inline sourcemaps for debugging
- ✅ **Code Quality** - ESLint + Prettier for consistent code style
- ✅ **Pre-commit Hooks** - Automatic validation before commits with Husky
- ✅ **CI/CD** - GitHub Actions for automated testing and releases

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml     # GitHub Actions CI workflow
├── src/
│   ├── index.ts       # Main entry point
│   └── utils.ts       # Utility functions (example)
├── tests/
│   ├── utils.test.ts  # Example tests for utilities
│   └── index.test.ts  # Example tests for main logic
├── dist/                  # Gitignored — created by build
│   └── userscript.user.js  # Built userscript (auto-generated)
├── meta.json          # Userscript metadata
├── vitest.config.ts   # Test configuration
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
├── rollup.config.js   # Build configuration
├── eslint.config.js   # ESLint configuration
├── .prettierrc        # Prettier configuration
└── LICENSE            # MIT License
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will also automatically set up git hooks using Husky for pre-commit validation.

### 2. Configure Your Userscript

Edit `meta.json` to customize your userscript metadata:

```json
{
  "name": "My TypeScript Userscript",
  "namespace": "https://github.com/yourusername",
  "version": "1.0.0",
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
- `version`: **This is your userscript version** - what users see in Tampermonkey. Bump this when releasing updates.

**Versioning strategy:**

This depends on whether you're in **template mode** or **userscript mode** (set via `"templateMode"` in `package.json`):

| | `package.json` | `meta.json` |
|---|---|---|
| **Template mode** | Template infrastructure version | Always `1.0.0` - never changed |
| **Userscript mode** | Kept in sync with `meta.json` | Your userscript version (what Tampermonkey shows users) |

In **userscript mode**, both files are always bumped together so your git tag, `package.json`, and `meta.json` all reflect the same version.

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
   npm run lint        # Check for errors
   npm run lint:fix    # Auto-fix errors
   npm run format      # Format code with Prettier
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
// src/utils.ts
export function log(message: string): void {
  console.log(`[UserScript] ${message}`);
}

export function waitForElement(selector: string, timeout = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout: ${selector}`));
      } else {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  });
}

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
- Linting, formatting, type checking
- **Runs test suite to catch bugs**
- Grant validation and markdown link checks
- Builds the project to ensure everything works
- Ensures code quality and catches issues early

**`.github/workflows/version-bump.yml`** - Automated Version Bumping:
- Manually triggered from GitHub Actions UI
- Select patch/minor/major version bump
- **Auto-detects mode** from `package.json` - no manual checkbox needed
- Builds and creates a GitHub release in one workflow
- Guards against forgetting to update `repository.url`

**`.github/workflows/release.yml`** - Release Automation (local pushes):
- Triggers when you push a version tag from your local machine
- Builds the userscript and creates a GitHub release

### Template Mode vs Userscript Mode

The version-bump workflow automatically detects how to behave based on `package.json`:

```json
{
  "userscript": {
    "templateMode": true   // ← set to false (or remove) when building a real userscript
  }
}
```

| | `templateMode: true` | `templateMode: false` (or absent) |
|---|---|---|
| **Updates** | `package.json` only | `package.json` + `meta.json` |
| **Use case** | Template/boilerplate maintainers | Userscript developers |
| **Default** | ✅ (ships with template) | Set when starting your userscript |

**When you start using this template**, set `templateMode: false` (or remove the field) in `package.json`. From that point, every version bump will keep `package.json` and `meta.json` in sync.

### Creating a Release

#### Option 1: GitHub Actions (Recommended)

1. Go to **Actions** tab in your GitHub repository
2. Select **Version Bump** workflow
3. Click **Run workflow**
4. Choose the version bump type:
   - **patch**: 1.0.0 → 1.0.1 (bug fixes, minor updates)
   - **minor**: 1.0.0 → 1.1.0 (new features)
   - **major**: 1.0.0 → 2.0.0 (breaking changes)
5. Click **Run workflow**

This automatically:
- Validates your `repository.url` is configured correctly
- Detects template vs userscript mode
- Updates `package.json` (and `meta.json` in userscript mode)
- Commits with conventional commits format
- Creates and pushes the version tag
- **Builds and creates a GitHub release immediately**

#### Option 2: Local (CLI)

```bash
# Bump version - commit message is set automatically via .npmrc
npm version patch   # 1.0.0 → 1.0.1 (bug fixes, minor updates)
npm version minor   # 1.0.0 → 1.1.0 (new features)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)

# Push the commit + tag - this triggers release.yml automatically
git push --follow-tags
```

> **Note:** If in userscript mode, also update `meta.json` manually to match before pushing.

---

Either method will:
1. Build your userscript
2. Create a GitHub release
3. Attach the built file to the release
4. Generate release notes from your commits

Users can then install directly from the release:
```
https://github.com/user/repo/releases/latest/download/userscript.user.js
```

**To remove CI/CD:** Simply delete the `.github/workflows/` folder if you don't need it.

## Updating from Template

**Note:** This template is a **starting point** - most users heavily customize it. Updates are **optional** and typically only needed if you want new features from the template.

### When to Update

✅ **Update if you want:**
- New GitHub Actions workflows or improvements
- Better build/test configurations
- Security updates to tooling

❌ **Don't update if:**
- You've heavily customized configs
- Everything works fine for you
- You prefer stability over new features

---

### Manual Update

Check the [template repository](https://github.com/matthiasseghers/typescript-userscript-template) and [CHANGELOG.md](CHANGELOG.md) for changes, then manually update:
- `.github/workflows/` - CI/CD workflows
- `eslint.config.js`, `tsconfig.json`, `.prettierrc` - Linting/formatting
- `rollup.config.js`, `vitest.config.ts` - Build/test config
- `package.json` - Dependencies (or use Dependabot)

### Dependency Updates

Use Dependabot (included) for automatic dependency updates, or:
```bash
npm update              # Update to latest compatible versions
npm outdated            # Check for major version updates
```

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

## Scripts Reference

**Build:**
- `npm run build` - Build the userscript for production (no sourcemaps)
- `npm run dev` - Watch mode for development (with inline sourcemaps)

**Testing:**
- `npm test` - Run tests once
- `npm run test:watch` - Watch mode for tests
- `npm run test:ui` - Interactive test UI dashboard
- `npm run test:coverage` - Generate coverage report

**Code Quality:**
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run type-check` - Run TypeScript type checking

**Validation:**
- `npm run check-grants` - Validate GM API grants
- `npm run check-links` - Check for broken links in markdown files
- `npm run validate` - Run all checks including tests (recommended before committing)

## License

MIT

## Contributing

Feel free to customize this template for your needs!
