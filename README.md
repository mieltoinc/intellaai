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

## Using SandboxAgent

**SandboxAgent** combines **sandbox** and optional **session** in one flow. Use it when you want a single entry point to create a sandbox and optionally a session (with post-create setup like `runCmd`, `gitClone`, `npmInstall`).

**Prerequisites:** `REDIS_URL` (e.g. `redis://localhost:6379`). For local sandbox no API keys; for E2B set `E2B_API_KEY`; for session/agent set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` as needed.

### API overview

| Method | Purpose |
|--------|--------|
| `SandboxAgent.createSandboxAgent(options)` | Create and initialize a sandbox only. Returns `ISandboxProvider`. |
| `SandboxAgent.connect(options)` | Create sandbox + optional session; returns a `SandboxAgent` instance with `sandbox`, `session` (and optionally `agent`) set. |
| `instance.endSession()` | End the current session if any. |
| `instance.close()` | Close sandbox and clear references. |

Options: **redisUrl**, **sandbox** `{ provider, config? }`, **agent** (optional) `{ type: AgentType, config? }`, **session** (optional) `{ sessionId?, postCreate?: SessionInitSetup }` for setup (runCmd, gitClone, npmInstall, etc.).

### Sandbox only

```typescript
import { SandboxAgent, SandboxProviderType } from 'intella';

const sandbox = await SandboxAgent.createSandboxAgent({
  redisUrl: process.env.REDIS_URL!,
  sandbox: { provider: SandboxProviderType.LOCAL, config: { env: {} } },
});
await sandbox.executeCommand('echo hi');
await sandbox.close();
```

### Sandbox + session

```typescript
import { SandboxAgent, SandboxProviderType, AgentType } from 'intella';

const sa = await SandboxAgent.connect({
  redisUrl: process.env.REDIS_URL!,
  sandbox: {
    provider: SandboxProviderType.LOCAL,
    config: { env: { REDIS_URL: process.env.REDIS_URL }, templateId: 'intella-sdk' },
  },
  agent: { type: AgentType.CLAUDE, config: { model: 'sonnet' } },
  session: {
    sessionId: 'my-session',
    postCreate: { runCmd: [{ command: 'echo "ready"' }] },
  },
});
console.log(sa.session?.id);
await sa.endSession();
await sa.close();
```

### Streaming with streamEvents

Use `sandbox.streamEvents(StreamEventType.Session, sessionId, options)` to consume agent text chunks from the session stream, or `streamEvents(StreamEventType.Sandbox, sandboxId, { commandId, ... })` for command results from the sandbox results stream.

```typescript
import { SandboxAgent, SandboxProviderType, AgentType, StreamEventType } from 'intella';

const sa = await SandboxAgent.connect({ /* redisUrl, sandbox, agent, session */ });
const sandbox = sa.sandbox!;
const sessionId = sa.session!.id;

// Publish a command, then stream session chunks
await sandbox.publishCommand({ type: 'agent:execute', sessionId, data: taskRequest, ... }, redisUrl);
for await (const chunk of sandbox.streamEvents(StreamEventType.Session, sessionId, { redisUrl })) {
  if (chunk.chunk) process.stdout.write(chunk.chunk);
}
```

For full examples (basic-usage, local-usage, with-session-and-setup, stream-events-usage), see the **SandboxAgent** examples in the Intella SDK: `packages/intella-sdk/examples/sandbox-agent/`.

### Using sandbox.createSession()

Once you have a sandbox (from `Intella.initializeSandbox()` or `SandboxAgent.createSandboxAgent()` / `SandboxAgent.connect()`), create a session with `sandbox.createSession()`. The session runs inside the sandbox and is used for agent execution (e.g. `sandbox.executeAgent()` or `sandbox.publishCommand()` + `streamEvents()`).

**Options:** `sessionId?`, `agentType`, `model?`, `metadata?`, `setup?` (`SessionInitSetup`: `runCmd`, `gitClone`, `npmInstall`, etc.).

**Minimal:**

```typescript
import { Intella, SandboxProviderType, AgentType } from 'intella';

const intella = new Intella();
const sandbox = await intella.initializeSandbox(SandboxProviderType.LOCAL, {
  config: { env: { REDIS_URL: process.env.REDIS_URL } },
});
await sandbox.ensureDaemonRunning?.();

const session = await sandbox.createSession({
  agentType: AgentType.CLAUDE,
  model: 'sonnet',
});
console.log('Session:', session.id, session.status);

// Later: end session and close sandbox
await sandbox.endSession(session.id);
await intella.closeSandbox();
```

**With setup (gitClone, runCmd):**

```typescript
const session = await sandbox.createSession({
  sessionId: 'my-session',
  agentType: AgentType.CLAUDE,
  model: 'sonnet',
  setup: {
    gitClone: [
      {
        url: 'https://github.com/user/project.git',
        options: { path: '/workspace', branch: 'main', autoInstall: true },
      },
    ],
    runCmd: [
      { command: 'npm install', options: { path: '/workspace/project' } },
    ],
  },
  metadata: { project: 'my-project' },
});
```

The returned session has a `.close()` method you can call instead of `sandbox.endSession(session.id)`. Related: `sandbox.getSession(sessionId)`, `sandbox.endSession(sessionId)`, `sandbox.runSessionSetup(sessionId, setup)`.

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

