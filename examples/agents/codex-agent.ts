/**
 * Codex Agent Example
 *
 * Basic usage of the Codex agent via the Intella SDK.
 * Codex is powered by the Codex CLI (OpenAI); supports reasoning, approvals, sandbox modes.
 *
 * Prerequisites:
 * - @intella/sdk (and ai-sdk-provider-codex-cli from SDK)
 * - Set OPENAI_API_KEY (or use Codex CLI auth)
 *
 * Run from packages/intellaai: bun run example:codex
 * Or: bunx tsx examples/agents/codex-agent.ts
 */

import { AgentType, Intella } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('Default agent before selection:', intella.getDefaultAgentType());
  console.log('Available agents:', intella.listAgents());
  console.log('');

  intella.selectAgent(AgentType.CODEX, {
    model: 'gpt-5.2-codex', // Options: 'gpt-5.2-codex', 'gpt-5.2', 'gpt-5.1-codex-max', 'gpt-5.1-codex-mini'
    verbose: true,
  });

  console.log('Default agent after selection:', intella.getDefaultAgentType());
  console.log('Codex agent config:', intella.getAgentConfig('codex'));
  console.log('');

  console.log('Executing task with Codex agent...\n');
  const response = await intella.executeTask(
    'Explain what a recursive function is in 2-3 sentences, with a simple example.'
  );

  console.log('\n=== Response ===');
  console.log('Agent Type:', response.agentType);
  console.log('Response:', response.text);
  console.log('\n=== Metadata ===');
  console.log(JSON.stringify(response.metadata, null, 2));

  if (response.agentType === AgentType.CODEX) {
    console.log('\n✅ SUCCESS: Codex agent was used!');
  } else {
    console.log(`\n❌ WARNING: Expected '${AgentType.CODEX}' but got '${response.agentType}'`);
  }
}

main().catch(console.error);
