# Docs Generation

Rules for writing documentation for **intellaai**. All docs live in `packages/intellaai/docs/` and follow Mintlify conventions.

## Mintlify rules

Follow the rules in `.cursor/rules/mintlify.mdc` when writing docs:

- **Writing style**: Clear, direct language; second person ("you"); active voice; present tense for current states
- **Structure**: Inverted pyramid; progressive disclosure; numbered steps for procedures; YAML frontmatter on every page
- **Components**: Use Mintlify callouts (Note, Tip, Warning, Info, Check), Steps, Tabs, CodeGroup, Accordions, Cards, etc.
- **Quality**: Complete runnable examples; proper error handling; realistic data; descriptive alt text; keyword-rich headings

## Import convention

**Always use `intella` as the package import.** Never reference `@intella/sdk` in docs or examples.

```typescript
// Correct
import { SandboxAgent, AgentType, SandboxProviderType } from 'intella';

// Wrong — do not use @intella/sdk in docs
import { SandboxAgent } from '@intella/sdk';
```

## Default package manager and runtime

**Use Bun as the default.** When showing install or run commands:

- Prefer `bun add` over npm/yarn for installation
- Prefer `bun run` for scripts
- When using `<CodeGroup>`, put the Bun variant first or make it the primary example

```bash
# Preferred
bun add intella
bun run example.ts
```

For install commands with multiple package managers, order as: **bun** → npm → yarn.

```mdx
<CodeGroup>
  ```bash bun
  bun add intella
  ```
  ```bash npm
  npm install intella
  ```
  ```bash yarn
  yarn add intella
  ```
</CodeGroup>
```

## Required page structure

Every `.mdx` page must start with YAML frontmatter:

```yaml
---
title: "Clear, specific, keyword-rich title"
description: "Concise description explaining page purpose and value"
---
```

## Code examples

- Use `intella` imports only
- Show bun as the default install/run tool
- Include complete, runnable examples
- Never include real API keys or secrets
- Add comments for non-obvious logic
