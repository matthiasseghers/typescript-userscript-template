#!/usr/bin/env node

/**
 * Validates that package.json and meta.json have matching versions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read package.json
const packagePath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const packageVersion = packageJson.version;

// Read meta.json
const metaPath = path.join(rootDir, 'meta.json');
const metaJson = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const metaVersion = metaJson.version;

// Compare versions
if (packageVersion !== metaVersion) {
  console.error('❌ Version mismatch detected:');
  console.error(`   package.json: ${packageVersion}`);
  console.error(`   meta.json:    ${metaVersion}`);
  console.error('\nPlease update both files to have the same version.\n');
  process.exit(1);
}

console.log(`✅ Versions are in sync: ${packageVersion}`);
process.exit(0);
