/**
 * Claude Agent Example
 *
 * Basic usage of the Claude Code agent via the Intella SDK.
 *
 * Prerequisites:
 * - @intella/sdk (and ai, ai-sdk-provider-claude-code from SDK)
 * - Claude Code CLI: npm install -g @anthropic-ai/claude-code
 * - Authenticate: claude login
 *
 * Run from packages/intellaai: bun run example:claude
 * Or: bunx tsx examples/agents/claude-agent.ts
 */

import { AgentType, Intella } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('Default agent before selection:', intella.getDefaultAgentType());
  console.log('Available agents:', intella.listAgents());
  console.log('');

  intella.selectAgent(AgentType.CLAUDE, {
    model: 'sonnet', // Options: 'opus', 'sonnet', 'haiku'
    verbose: true,
  });

  console.log('Default agent after selection:', intella.getDefaultAgentType());
  console.log('Claude agent config:', intella.getAgentConfig('claude'));
  console.log('');

  console.log('Executing task with Claude Code agent...\n');
  const response = await intella.executeTask(
    'Write a brief explanation of quantum computing in 2-3 sentences.'
  );

  console.log('\n=== Response ===');
  console.log('Agent Type:', response.agentType);
  console.log('Response:', response.text);
  console.log('\n=== Metadata ===');
  console.log(JSON.stringify(response.metadata, null, 2));

  if (response.agentType === AgentType.CLAUDE) {
    console.log('\n✅ SUCCESS: Claude Code agent was used!');
  } else {
    console.log(`\n❌ WARNING: Expected '${AgentType.CLAUDE}' but got '${response.agentType}'`);
  }
}

main().catch(console.error);
