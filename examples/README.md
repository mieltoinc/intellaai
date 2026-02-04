# Intella AI examples

These examples show how to use the `intella` package for sandboxes, sessions, and agent execution.

## Prerequisites

- Node 18+
- For **local sandbox** examples: no API keys required.
- For **E2B/remote** examples: set `E2B_API_KEY` (or provider-specific keys).
- For **agent execution**: set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` as needed; Redis and Intella CLI for session/streaming flows.

## Run examples

From the `intellaai` package root:

```bash
bun install
bun run example:basic
bun run example:local-sandbox
bun run example:session
```

Or with `bunx tsx`:

```bash
bunx tsx examples/basic-usage.ts
bunx tsx examples/local-sandbox.ts
bunx tsx examples/session-and-agent.ts
```

## Examples

| Example | Description |
|--------|-------------|
| [basic-usage.ts](./basic-usage.ts) | List providers, init local sandbox, run a command, close. |
| [local-sandbox.ts](./local-sandbox.ts) | Local sandbox: commands, file ops, `runCode`. |
| [session-and-agent.ts](./session-and-agent.ts) | Create session in local sandbox, execute agent (streaming), end session. |
