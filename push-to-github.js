const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const readline = require('readline');

async function askToken() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n🔑 Enter your GitHub Personal Access Token (PAT): ', (token) => {
      rl.close();
      resolve(token.trim());
    });
  });
}

async function push() {
  const dir = process.cwd();
  let token = process.argv[2] || process.env.GITHUB_TOKEN;

  if (!token) {
    token = await askToken();
  }

  if (!token) {
    console.error('❌ Error: No GitHub Personal Access Token was provided.');
    console.log('\nTo generate a token:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token (classic)"');
    console.log('3. Check the "repo" scope box and click Generate');
    console.log('4. Run: node push-to-github.js <YOUR_TOKEN>\n');
    process.exit(1);
  }

  const url = 'https://github.com/SooryaGayathry96/NOVA-2.0-.git';

  try {
    await git.addRemote({ fs, dir, remote: 'origin', url, force: true });
  } catch (e) {}

  console.log('\n🚀 Connecting to GitHub repository...');
  try {
    const res = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({ username: token, password: '' }),
    });

    console.log('✅ PUSH SUCCESSFUL!');
    console.log(`🌐 Your project is now published live on GitHub:`);
    console.log(`   ${url}\n`);
  } catch (err) {
    console.error('\n❌ Git Push Failed:', err.message);
    if (err.data && err.data.response) {
      console.error('Details:', err.data.response);
    }
    console.log('\nTroubleshooting tip: Ensure your token has the "repo" scope enabled.');
  }
}

push();
