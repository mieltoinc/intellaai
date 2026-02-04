/**
 * Local Sandbox Example
 *
 * Uses the local sandbox provider only. Runs on the current machine (no API keys).
 *
 * Prerequisites: None
 *
 * Run from packages/intellaai: bun run example:local
 * Or: bunx tsx examples/sandbox/local-usage.ts
 */

import { Intella, SandboxProviderType } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('=== Local Sandbox Example ===\n');

  await intella.initializeSandbox(SandboxProviderType.LOCAL, {
    cwd: process.cwd(),
    env: { NODE_ENV: 'development' },
  });

  console.log('Local sandbox initialized');

  const result = await sdk.executeInSandbox('echo "Hello from Local Sandbox!"');
  console.log('Command result:', result.result.stdout);
  console.log('Exit code:', result.result.exitCode);

  const sandbox = sdk.getActiveSandbox();
  if (sandbox) {
    const info = await sandbox.getInfo();
    console.log('Sandbox info:', { sandboxId: info.sandboxId, provider: info.provider, isRunning: info.isRunning });
  }

  await intella.closeSandbox();
  console.log('Local sandbox closed');
}

main().catch(console.error);
