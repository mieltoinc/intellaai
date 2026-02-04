/* eslint-disable no-console */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const CLI_COMMAND = 'intella';
const CLI_PACKAGE = 'intella-cli';

const run = (command, args, options = {}) =>
  spawnSync(command, args, { stdio: 'inherit', ...options });

const isCliAvailable = () => {
  const result = spawnSync(CLI_COMMAND, ['--version'], { stdio: 'ignore' });
  return result.status === 0;
};

const installGlobal = (targetPath) => {
  if (targetPath) {
    return run('npm', ['install', '-g', targetPath]).status === 0;
  }
  return run('npm', ['install', '-g', CLI_PACKAGE]).status === 0;
};

const installFromTemp = () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'intellaai-cli-'));
  const installResult = run('npm', ['install', CLI_PACKAGE], { cwd: tempDir });
  if (installResult.status !== 0) {
    return false;
  }

  const cliPath = path.join(tempDir, 'node_modules', CLI_PACKAGE);
  if (!fs.existsSync(cliPath)) {
    return false;
  }

  return installGlobal(cliPath);
};

if (isCliAvailable()) {
  process.exit(0);
}

console.log('[intellaai] intella CLI not found. Installing globally...');

const installed = installGlobal() || installFromTemp();
if (!installed) {
  console.warn(
    '[intellaai] Failed to install intella CLI automatically. You can try:',
  );
  console.warn('  npm install -g intella-cli');
}
