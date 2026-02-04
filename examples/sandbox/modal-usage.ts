/**
 * Modal Sandbox Example
 *
 * Uses the Modal sandbox provider only.
 *
 * Prerequisites: MODAL_TOKEN_ID, MODAL_TOKEN_SECRET
 *
 * Run from packages/intellaai: bun run example:modal
 * Or: bunx tsx examples/sandbox/modal-usage.ts
 */

import { Intella, SandboxProviderType } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('=== Modal Sandbox Example ===\n');

  await intella.initializeSandbox(SandboxProviderType.MODAL, {
    env: { NODE_ENV: 'development' },
  });

  console.log('Modal sandbox initialized');

  const result = await intella.executeInSandbox('echo "Hello from Modal Sandbox!"');
  console.log('Command result:', result.result.stdout);
  console.log('Exit code:', result.result.exitCode);

  const sandbox = intella.getActiveSandbox();
  if (sandbox) {
    const info = await sandbox.getInfo();
    console.log('Sandbox info:', { sandboxId: info.sandboxId, provider: info.provider, isRunning: info.isRunning });
  }

  await intella.closeSandbox();
  console.log('Modal sandbox closed');
}

main().catch(console.error);
