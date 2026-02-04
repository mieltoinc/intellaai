/**
 * Daytona Sandbox Example
 *
 * Uses the Daytona sandbox provider only.
 *
 * Prerequisites: DAYTONA_API_KEY, DAYTONA_API_URL
 *
 * Run from packages/intellaai: bun run example:daytona
 * Or: bunx tsx examples/sandbox/daytona-usage.ts
 */

import { Intella, SandboxProviderType } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('=== Daytona Sandbox Example ===\n');

  await intella.initializeSandbox(SandboxProviderType.DAYTONA, {
    templateId: 'default',
    baseURL: process.env.DAYTONA_API_URL || 'http://localhost:3000',
    env: { NODE_ENV: 'development' },
  });

  console.log('Daytona sandbox initialized');

  const result = await intella.executeInSandbox('echo "Hello from Daytona Sandbox!"');
  console.log('Command result:', result.result.stdout);
  console.log('Exit code:', result.result.exitCode);

  const sandbox = intella.getActiveSandbox();
  if (sandbox) {
    const status = await sandbox.getStatus();
    console.log('Sandbox status:', status);
    const info = await sandbox.getInfo();
    console.log('Sandbox info:', { sandboxId: info.sandboxId, provider: info.provider, isRunning: info.isRunning });
  }

  await intella.closeSandbox();
  console.log('Daytona sandbox closed');
}

main().catch(console.error);
