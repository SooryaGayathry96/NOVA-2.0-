const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

async function main() {
  const dir = process.cwd();
  console.log(`[Git] Initializing Git repository in: ${dir}`);

  // 1. git init
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('[Git] Initialized empty Git repository in .git/');

  // 2. git add .
  console.log('[Git] Staging files (respecting .gitignore)...');
  const matrix = await git.statusMatrix({ fs, dir });
  let addedCount = 0;

  for (const [filepath, head, workdir, stage] of matrix) {
    if (workdir && workdir !== 0) {
      await git.add({ fs, dir, filepath });
      addedCount++;
    }
  }
  console.log(`[Git] Staged ${addedCount} files.`);

  // 3. git commit -m "Initial NOVA 2.0 project"
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'NOVA 2.0 Mission Control',
      email: 'cadet@nova.space',
    },
    message: 'Initial NOVA 2.0 project',
  });

  console.log(`[Git] Created commit: ${sha.slice(0, 7)} (main) "Initial NOVA 2.0 project"`);
}

main().catch((err) => {
  console.error('[Git Error]:', err);
  process.exit(1);
});
