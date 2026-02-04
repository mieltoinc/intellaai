/**
 * E2B Sandbox Example
 *
 * Uses the E2B sandbox provider only.
 *
 * Prerequisites: E2B_API_KEY
 *
 * Run from packages/intellaai: bun run example:e2b
 * Or: bunx tsx examples/sandbox/e2b-usage.ts
 */

import { Intella, SandboxProviderType } from '../../dist/index';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('=== E2B Sandbox Example ===\n');

  await intella.initializeSandbox(SandboxProviderType.E2B, {
    templateId: 'base',
    env: { NODE_ENV: 'development' },
  });

  console.log('E2B sandbox initialized');

  const result = await intella.executeInSandbox('echo "Hello from E2B Sandbox!"');
  console.log('Command result:', result.result.stdout);
  console.log('Exit code:', result.result.exitCode);

  const sandbox = intella.getActiveSandbox();
  if (sandbox) {
    await sandbox.writeFile('/tmp/test.txt', 'Hello, World!');
    const content = await sandbox.readFile('/tmp/test.txt');
    console.log('File content:', content);
  }

  await intella.closeSandbox();
  console.log('E2B sandbox closed');
}

main().catch(console.error);
