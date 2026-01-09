# TypeScript Userscript Template

[![CI](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/ci.yml/badge.svg)](https://github.com/matthiasseghers/typescript-userscript-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A template for building userscripts with TypeScript, allowing you to write modular, type-safe code that compiles into a single userscript file.

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
- ✅ **Automatic Bundling** - Rollup bundles everything into a single userscript file
- ✅ **Tree-Shaking** - Unused code is automatically removed from the final bundle
- ✅ **GM API Support** - Full TypeScript support for Tampermonkey/Greasemonkey APIs
- ✅ **Userscript Metadata** - Automatically inject userscript headers from `meta.json`
- ✅ **Development Mode** - Watch mode for automatic rebuilding during development
- ✅ **Code Quality** - ESLint + Prettier for consistent code style
- ✅ **CI/CD** - GitHub Actions for automated testing and deployment

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml     # GitHub Actions CI workflow
├── src/
│   ├── index.ts       # Main entry point
│   └── utils.ts       # Utility functions (example)
├── dist/
│   └── userscript.user.js  # Built userscript (auto-generated)
├── meta.json          # Userscript metadata
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
    "GM_setValue",
    "GM_xmlhttpRequest",
    "GM_notification"
  ],
  "run-at": "document-end",
  "connect": [
    "*"
  ]
}
```

**Key fields:**
- `match`: URLs where your userscript runs
- `grant`: GM API permissions your script needs
- `connect`: Domains allowed for cross-origin requests

### 3. Build Your Userscript

```bash
# One-time build
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch
# or
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

2. **Lint and format your code**:
   ```bash
   npm run lint        # Check for errors
   npm run lint:fix    # Auto-fix errors
   npm run format      # Format code with Prettier
   ```

3. **Run in watch mode** during development:
   ```bash
   npm run dev
   ```

4. **Test in browser**:
   - After each build, copy the updated `dist/userscript.user.js` to your userscript manager
   - Or set up automatic reloading (see Tips below)

## Writing Your Userscript

### Example: Basic Structure

```typescript
// src/index.ts
import { log, waitForElement, store, retrieve, notify } from './utils';

async function main(): Promise<void> {
  log('Userscript started!');
  
  try {
    // Get stored data
    const count = await retrieve<number>('count', 0);
    await store('count', count + 1);
    
    const element = await waitForElement('#my-element');
    element.textContent = `Modified! (Visit #${count + 1})`;
    
    // Show notification
    notify('Userscript is running!', 'Success');
  } catch (error) {
    console.error('Error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
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

- **Cross-origin requests**: Add domains to the `connect` array to allow `GM_xmlhttpRequest` to those domains

- **Multiple userscripts**: Duplicate this template folder for each userscript project

- **Source maps**: Source maps are disabled by default for cleaner output. Enable them in `rollup.config.js` by setting `sourcemap: true` if you need to debug TypeScript code in browser DevTools

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

### CI/CD with GitHub Actions

Two workflows are included:

**`.github/workflows/ci.yml`** - Continuous Integration:
- Runs on every push and pull request
- Linting, formatting, type checking, grant validation
- Builds the project to ensure everything works
- Ensures code quality and catches issues early

**`.github/workflows/deploy.yml`** - Deployment (optional):
- Deploys to GitHub Pages for easy installation
- Enable GitHub Pages in repo settings to use

**To remove CI/CD:** Simply delete the `.github/workflows/` folder if you don't need it.

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

- `npm run build` - Build the userscript once
- `npm run dev` - Watch mode for development
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run type-check` - Run TypeScript type checking
- `npm run check-grants` - Validate GM API grants
- `npm run validate` - Run all checks (recommended before committing)

## License

MIT

## Contributing

Feel free to customize this template for your needs!
