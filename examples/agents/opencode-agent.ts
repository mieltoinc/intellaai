/**
 * OpenCode Agent Example
 *
 * Basic usage of the OpenCode agent via the Intella SDK.
 * OpenCode supports multiple model backends (e.g. Anthropic); model format: provider/model-id.
 *
 * Prerequisites:
 * - @intella/sdk (and ai-sdk-provider-opencode-sdk from SDK)
 * - Authenticate with OpenCode (e.g. opencode login) or set provider API keys
 *
 * Run from packages/intellaai: bun run example:opencode
 * Or: bunx tsx examples/agents/opencode-agent.ts
 */

import { AgentType, Intella } from 'intella';
import 'dotenv/config';

async function main() {
  const intella = new Intella();

  console.log('Default agent before selection:', intella.getDefaultAgentType());
  console.log('Available agents:', intella.listAgents());
  console.log('');

  intella.selectAgent(AgentType.OPENCODE, {
    model: 'anthropic/claude-sonnet-4-5-20250929', // provider/model-id
    verbose: true,
    cwd: process.cwd(),
  });

  console.log('Default agent after selection:', intella.getDefaultAgentType());
  console.log('OpenCode agent config:', intella.getAgentConfig('opencode'));
  console.log('');

  console.log('Executing task with OpenCode agent...\n');
  const response = await intella.executeTask(
    'In 2-3 sentences, explain the difference between synchronous and asynchronous programming.'
  );

  console.log('\n=== Response ===');
  console.log('Agent Type:', response.agentType);
  console.log('Response:', response.text);
  console.log('\n=== Metadata ===');
  console.log(JSON.stringify(response.metadata, null, 2));

  if (response.agentType === AgentType.OPENCODE) {
    console.log('\n✅ SUCCESS: OpenCode agent was used!');
  } else {
    console.log(`\n❌ WARNING: Expected '${AgentType.OPENCODE}' but got '${response.agentType}'`);
  }
}

main().catch(console.error);
