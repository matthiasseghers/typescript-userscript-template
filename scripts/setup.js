import readline from 'readline';
import fs from 'fs';
import { execSync } from 'child_process';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

rl.on('SIGINT', () => {
  console.log('\n👋 Setup cancelled.');
  process.exit(0);
});

function replace(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  fs.writeFileSync(filePath, content);
}

async function collectInputs() {
  while (true) {
    console.log('\n🛠  TypeScript Userscript Template — Setup\n');

    const name        = await ask('Userscript name: ');
    const description = await ask('Description: ');
    const author      = await ask('Author (your name): ');
    const username    = await ask('GitHub username: ');
    const repo        = await ask('GitHub repository name: ');

    console.log(`
Please confirm:
  Userscript name:        ${name}
  Description:            ${description}
  Author:                 ${author}
  GitHub username:        ${username}
  GitHub repository name: ${repo}
`);

    const confirm = await ask('Look good? (y/n): ');
    if (confirm.trim().toLowerCase() === 'y') {
      return { name, description, author, username, repo };
    }

    console.log('\n↩️  Starting over...');
  }
}

try {
  const { name, description, author, username, repo } = await collectInputs();
  rl.close();

  const TEMPLATE_REPO = 'matthiasseghers/typescript-userscript-template';
  const userRepo = `${username}/${repo}`;

  console.log('\n📝 Patching files...');

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.name = repo;
  pkg.description = description;
  pkg.author = author;
  pkg.repository.url = `https://github.com/${userRepo}`;
  if (pkg.userscript) pkg.userscript.templateMode = false;
  delete pkg.scripts.setup;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  console.log('  ✅ package.json');

  const meta = JSON.parse(fs.readFileSync('meta.json', 'utf8'));
  meta.name = name;
  meta.description = description;
  meta.author = author;
  meta.namespace = `https://github.com/${username}`;
  fs.writeFileSync('meta.json', JSON.stringify(meta, null, 2) + '\n');
  console.log('  ✅ meta.json');

  const readmeTemplate = fs.readFileSync('scripts/README.template.md', 'utf8');
  const readme = readmeTemplate
    .replaceAll('{{name}}', name)
    .replaceAll('{{userRepo}}', userRepo)
    .replaceAll('{{description}}', description);
  fs.writeFileSync('README.md', readme);
  console.log('  ✅ README.md');

  if (fs.existsSync('cliff.toml')) {
    replace('cliff.toml', [[TEMPLATE_REPO, userRepo]]);
    console.log('  ✅ cliff.toml');
  }

  // Remove template-specific files — not relevant to the user's project
  for (const file of ['CHANGELOG.md', 'MIGRATION_GUIDE.md']) {
    if (fs.existsSync(file)) {
      fs.rmSync(file);
      console.log(`  ✅ ${file} removed`);
    }
  }

  // Self-delete
  fs.rmSync('scripts/README.template.md');
  fs.rmSync('scripts/setup.js');
  try { fs.rmdirSync('scripts'); } catch {}
  console.log('  ✅ setup script removed');

  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log(`
✨ Done! Your userscript project is ready.

   Next steps:
   1. Review the changes: git diff
   2. Edit src/index.ts and start building
   3. When ready to release: Actions → Version Bump
`);
} catch (err) {
  console.log(`\n❌ Setup failed: ${err.message}`);
  process.exit(1);
}