/**
 * Vercel Sandbox Example
 *
 * Uses the Vercel sandbox provider only.
 *
 * Prerequisites: VERCEL_OIDC_TOKEN (or VERCEL_TEAM_ID, VERCEL_PROJECT_ID, VERCEL_TOKEN)
 *
 * Run from packages/intellaai: bun run example:vercel
 * Or: bunx tsx examples/sandbox/vercel-usage.ts
 */

import { Intella, SandboxProviderType } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('=== Vercel Sandbox Example ===\n');

  await intella.initializeSandbox(SandboxProviderType.VERCEL, {
    env: { NODE_ENV: 'development' },
  });

  console.log('Vercel sandbox initialized');

  const result = await intella.executeInSandbox('echo "Hello from Vercel Sandbox!"');
  console.log('Command result:', result.result.stdout);
  console.log('Exit code:', result.result.exitCode);

  const sandbox = intella.getActiveSandbox();
  if (sandbox) {
    const info = await sandbox.getInfo();
    console.log('Sandbox info:', { sandboxId: info.sandboxId, provider: info.provider, isRunning: info.isRunning });
  }

  await intella.closeSandbox();
  console.log('Vercel sandbox closed');
}

main().catch(console.error);
