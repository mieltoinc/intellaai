/**
 * Session and agent execution example for intella
 *
 * Creates a session in the local sandbox, runs an agent task with streaming,
 * then ends the session. Requires Redis and Intella CLI; set ANTHROPIC_API_KEY
 * (or OPENAI_API_KEY for intella-lite).
 *
 * Run: npm run example:session
 */

import { Intella, SandboxProviderType, AgentType } from 'intella';
import 'dotenv/config';

async function main() {
  const sdk = new Intella();

  await sdk.initializeSandbox(SandboxProviderType.LOCAL, {
    cwd: process.cwd(),
    env: {
      NODE_ENV: 'development',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
      REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
    }
  });

  const sandbox = sdk.getActiveSandbox();
  if (!sandbox) throw new Error('Failed to get sandbox');

  await sandbox.ensureDaemonRunning();
  console.log('Daemon running\n');

  const session = await sandbox.createSession({
    agentType: AgentType.CLAUDE,
    model: 'sonnet',
  });
  console.log('Session created:', session.id);

  console.log('Streaming agent response:\n');
  for await (const chunk of sandbox.executeAgent(
    {
      prompt: 'Say "Hello from intella" in one short sentence.',
      sessionId: session.id,
    },
    AgentType.CLAUDE
  )) {
    process.stdout.write(chunk.chunk ?? '');
  }
  console.log('\n');

  await sandbox.endSession(session.id);
  await sdk.closeSandbox();
  console.log('Session ended, sandbox closed.');
}

main().catch(console.error);
