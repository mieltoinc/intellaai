/**
 * Basic usage example for intellaai
 *
 * Uses the local sandbox (no API keys). Lists providers, initializes sandbox,
 * runs a command, then closes.
 *
 * Run: npm run example:basic (from package root)
 */

import { IntellaSDK, SandboxProviderType } from 'intella';

async function main() {
  const sdk = new IntellaSDK();

  console.log('Available sandbox providers:', sdk.listSandboxProviders());
  console.log('\n=== Local sandbox (basic) ===\n');

  await sdk.initializeSandbox(SandboxProviderType.LOCAL, {
    cwd: process.cwd(),
    env: { NODE_ENV: 'development' },
  });

  const sandbox = sdk.getActiveSandbox();
  if (!sandbox) throw new Error('Failed to get sandbox');

  console.log('Sandbox ID:', sandbox.getSandboxId());

  const result = await sandbox.executeCommand('echo "Hello from intella"');
  console.log('Command stdout:', result.stdout);
  console.log('Exit code:', result.exitCode);

  await sdk.closeSandbox();
  console.log('\nSandbox closed.');
}

main().catch(console.error);
