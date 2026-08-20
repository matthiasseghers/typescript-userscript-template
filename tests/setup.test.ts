/// <reference types="node" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Integration test for scripts/setup.js
 *
 * Spawns setup.js in a disposable temp directory that mirrors the real
 * project layout.  A thin runner script replaces readline with canned
 * answers so the setup runs non-interactively.  The script will fail
 * at `npm install` (no real node_modules in the temp dir) but every
 * file-mutation step happens before that call, so we can assert
 * post-setup state.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETUP_SCRIPT = path.resolve(__dirname, '..', 'scripts', 'setup.js');

/**
 * A small ESM wrapper that stubs `readline` and `child_process` so
 * setup.js can run without a TTY and without `npm install`.
 */
function writeRunner(dir: string) {
  const answers = JSON.stringify([
    'My Script',
    'A cool script',
    'Test Author',
    'testuser',
    'my-script',
    'y',
  ]);

  const readlineStub = [
    'const _answers = ' + answers + ';',
    'let _idx = 0;',
    'const readline = {',
    '  createInterface() {',
    '    return {',
    '      question(q, cb) { cb(_answers[_idx++]); },',
    '      on() { return this; },',
    '      close() {},',
    '    };',
    '  },',
    '};',
  ].join('\n');

  const runner = [
    "import { readFileSync, writeFileSync } from 'node:fs';",
    '',
    "let src = readFileSync('scripts/setup.js', 'utf8');",
    '',
    'src = src.replace(',
    '  /import readline from [\'"]readline[\'"];/,',
    '  ' + JSON.stringify(readlineStub) + ',',
    ');',
    '',
    'src = src.replace(',
    '  /import {[^}]*} from [\'"]child_process[\'"];/,',
    "  'const execSync = () => {};',",
    ');',
    '',
    "writeFileSync('scripts/_setup_runner.js', src);",
    "await import('./scripts/_setup_runner.js');",
  ].join('\n');

  fs.writeFileSync(path.join(dir, '_run.js'), runner);
}

function fixturePackageJson() {
  return JSON.stringify(
    {
      name: 'typescript-userscript-template',
      version: '4.0.0',
      description: 'A template for building userscripts with TypeScript',
      type: 'module',
      scripts: {
        build: 'rollup -c --environment BUILD:production',
        test: 'vitest run',
        lint: 'eslint "src/**/*.ts"',
        'check-grants': 'node scripts/check-grants.js',
        validate:
          'npm run lint && npm run type-check && npm run test && npm run check-grants && npm run build',
        setup: 'node scripts/setup.js',
      },
      author: '',
      repository: {
        type: 'git',
        url: 'https://github.com/matthiasseghers/typescript-userscript-template.git',
      },
      userscript: { templateMode: true },
    },
    null,
    2
  );
}

function fixtureMetaJson() {
  return JSON.stringify(
    {
      name: 'My TypeScript Userscript',
      namespace: 'https://github.com/yourusername',
      version: '0.1.0',
      description: 'A userscript built with TypeScript',
      author: 'Your Name',
      match: ['https://example.com/*'],
      grant: ['none'],
      'run-at': 'document-end',
    },
    null,
    2
  );
}

const FIXTURE_README_TEMPLATE = '# {{name}}\n{{description}}\n';
const FIXTURE_HUSKY_PRECOMMIT = '# Run validation\nnpm run check-grants && npm run validate\n';

let tmpDir: string;

function setupFixtures() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-test-'));

  // Create directory structure
  fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '.husky'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });

  // Write fixture files
  fs.writeFileSync(path.join(tmpDir, 'package.json'), fixturePackageJson());
  fs.writeFileSync(path.join(tmpDir, 'meta.json'), fixtureMetaJson());
  fs.writeFileSync(path.join(tmpDir, 'README.md'), '# old readme');
  fs.writeFileSync(path.join(tmpDir, 'MIGRATION_GUIDE.md'), '# Migration');
  fs.writeFileSync(path.join(tmpDir, 'scripts', 'README.template.md'), FIXTURE_README_TEMPLATE);
  fs.writeFileSync(path.join(tmpDir, '.husky', 'pre-commit'), FIXTURE_HUSKY_PRECOMMIT);
  fs.writeFileSync(path.join(tmpDir, 'scripts', 'check-grants.js'), '// stub');
  fs.writeFileSync(path.join(tmpDir, 'src', 'index.ts'), '');

  // Copy the real setup.js so we test the actual code
  fs.copyFileSync(SETUP_SCRIPT, path.join(tmpDir, 'scripts', 'setup.js'));
}

function runSetup() {
  writeRunner(tmpDir);

  try {
    execFileSync('node', ['_run.js'], {
      cwd: tmpDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15_000,
    });
  } catch {
    // The runner may exit non-zero if setup.js itself calls
    // process.exit, but all file mutations are already applied.
  }
}

describe('setup.js preserves check-grants', () => {
  beforeEach(() => {
    setupFixtures();
    runSetup();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should keep scripts/check-grants.js', () => {
    expect(fs.existsSync(path.join(tmpDir, 'scripts', 'check-grants.js'))).toBe(true);
  });

  it('should keep the check-grants script in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.scripts).toHaveProperty('check-grants');
  });

  it('should keep check-grants in the validate script chain', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.scripts.validate).toContain('check-grants');
  });

  it('should keep check-grants in the husky pre-commit hook', () => {
    const hookPath = path.join(tmpDir, '.husky', 'pre-commit');
    const content = fs.readFileSync(hookPath, 'utf8');
    expect(content).toContain('check-grants');
  });
});
