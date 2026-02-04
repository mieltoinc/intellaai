# Intella AI

**Intella** is a universal SDK for running durable AI agents inside isolated sandboxes and delegating tasks to them from your app. It orchestrates multiple agents (Claude, Codex, OpenCode) and runs them across sandbox providers (E2B, Daytona, Modal, Vercel, or your local machine). You can use it to automate tasks like code review, data analysis, docs generation and many more.


## Installation

```bash
bun add intella
```

or

```bash
npm install intella
```

or

```bash
yarn add intella
```


## Supported Agents


| Agent          | Description |
|----------------|-------------|
| **Claude Code** | Claude via `claude` CLI; auth via `claude login` or `ANTHROPIC_API_KEY`. Default model: sonnet. |
| **Codex**       | Codex CLI; uses OpenAI API key. Default model: gpt-5.2-codex. |
| **OpenCode**    | OpenCode SDK; auth via `opencode login` or `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`. Default model: anthropic/claude-sonnet-4-5-20250929. |
| **GeminiCode**  | Gemini CLI SDK; `In Progress` |
| **OpenClaw**    | ClawdBot API; `In Progress` |

See [examples/agents/README.md](./examples/agents/README.md).

## Supported sandboxes

| Sandbox              | Features |
|----------------------|----------|
| **E2B**              | Code interpreter, template-based sandboxes, Python and JavaScript execution. |
| **Daytona**          | Language-oriented sandboxes (Python, TypeScript, Go, Rust). |
| **Modal**            | Registry image support, secret management. |
| **Vercel**           | Vercel-based sandbox environment. |
| **Local**            | Runs on the current machine; uses current directory as workspace. |
| **Cloudflare**       | Cloudflare sandbox; `In Progress` |
| **Docker/Firecracker** | Docker/Firecracker sandbox; `In Progress` |
See [examples/sandbox/README.md](./examples/sandbox/README.md).


## Key features


- **Multi-agent orchestration** – Run tasks with sequential, parallel, or conditional strategies across agents.
- **Streaming** – Stream agent responses in real time.
- **Sandbox lifecycle** – Create, attach to, and close sandboxes; run commands and code inside them.
- **Sandbox setup** – Install packages (apt, npm, pip, etc.), clone repos, and run setup commands on init.
- **File operations** – Read, write, upload, and manage files inside sandboxes.
- **Sessions** – Create and manage sessions; execution history can be persisted for durability.
- **Durable task delivery** – Task queues and results are durable so work survives restarts.

## Durable Agents using Redis Streams

Intella uses Redis Streams as the transport layer for task execution and streaming output. Streams provide durable, resumable delivery of commands and results.

- **Durable delivery** – Commands and results are persisted in Redis, so work is not lost if a sandbox or daemon restarts.
- **Resumable processing** – Consumers can resume from the last acknowledged message, enabling reliable recovery.
- **Scalable fan-out** – Multiple sandboxes can consume work independently without losing ordering within each stream.
- **Continuous streaming** – Agent output is published incrementally, so clients can stream results in real time.
_ **Agent executions** – Agents task requests and executions are automatically persisted in Redis and synced back locally if the sandbox is restarted or need to resume sessions.

This architecture gives you durable, resumable agent execution with live streaming, backed by Redis.

## Demo: create a sandbox, clone a repo, run a command

Use sandbox setup to clone a repo and run a command:

```typescript
import { Intella, SandboxProviderType } from 'intella';

const sdk = new Intella();
const sandbox = await sdk.initializeSandbox(SandboxProviderType.E2B, {
  templateId: 'base',
  gitClone: [
    {
      url: 'https://github.com/user/project.git',
      options: { path: '/workspace', autoInstall: true },
    },
  ],
  runCmd: [{ command: 'npm test', options: { path: '/workspace/project' } }],
});
await sandbox.close();
```

## Demo: create a session and delegate a task

Create a session inside the sandbox and stream agent output with `sandbox.createSession` and `sandbox.executeAgent`:

```typescript
import { IntellaSDK, SandboxProviderType } from 'intella';

const sdk = new IntellaSDK();
const sandbox = await sdk.initializeSandbox(SandboxProviderType.E2B, {
  templateId: 'base',
});

const session = await sandbox.createSession({
  agentType: 'claude',
  model: 'sonnet',
  setup: {
    gitClone: [
      { url: 'https://github.com/user/project.git', options: { path: '/workspace' } },
    ],
    runCmd: [{ command: 'npm install', options: { path: '/workspace/project' } }],
  },
});

for await (const chunk of sandbox.executeAgent(
  { prompt: 'Summarize the repo and suggest next steps.', sessionId: session.id },
  'claude'
)) {
  process.stdout.write(chunk.chunk ?? '');
}

await sandbox.close();
```

## Demo: file operations

Assuming you already have a `sandbox` instance:

```typescript
// Create directories and write files
await sandbox.createDirectory('/workspace/data');
await sandbox.writeFile('/workspace/data/input.txt', 'hello');

// Read and list files
const text = await sandbox.readFile('/workspace/data/input.txt');
const files = await sandbox.listFiles('/workspace/data');

// Delete a file
await sandbox.deleteFile('/workspace/data/input.txt');
```

## Demo: git operations

Assuming you already have a `sandbox` instance:

```typescript
await sandbox.git.clone('https://github.com/user/project.git', '/workspace', {
  branch: 'main',
});

const status = await sandbox.git.status('/workspace/project');
const branches = await sandbox.git.branches('/workspace/project');

await sandbox.git.createBranch('/workspace/project', 'feature/demo');
await sandbox.git.checkoutBranch('/workspace/project', 'feature/demo');
await sandbox.git.add('/workspace/project', ['README.md']);
await sandbox.git.commit(
  '/workspace/project',
  'Update README',
  'Your Name',
  'you@example.com'
);
```

## Demo: code operations

Assuming you already have a `sandbox` instance:

```typescript
const codeResult = await sandbox.runCode('print(2 + 2)', {
  language: 'python3',
  timeout: 30_000,
});
```

