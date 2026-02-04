# Agent Examples

One example per agent: **Claude**, **Codex**, **OpenCode**.

| Agent     | File              | Prerequisites                                      |
|-----------|-------------------|----------------------------------------------------|
| **Claude**  | claude-agent.ts   | Claude Code CLI, `claude login`                    |
| **Codex**   | codex-agent.ts    | `OPENAI_API_KEY` (or Codex CLI auth)               |
| **OpenCode**| opencode-agent.ts | OpenCode auth; model `provider/model-id`           |

Run from repo root:

```bash
bun run --filter intella example:claude
bun run --filter intella example:codex
bun run --filter intella example:opencode
```

Or from `packages/intellaai`:

```bash
bun run example:claude
bun run example:codex
bun run example:opencode
```

Or with tsx:

```bash
cd packages/intellaai && bunx tsx examples/agents/claude-agent.ts
cd packages/intellaai && bunx tsx examples/agents/codex-agent.ts
cd packages/intellaai && bunx tsx examples/agents/opencode-agent.ts
```
