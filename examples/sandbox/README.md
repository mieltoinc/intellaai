# Sandbox Examples

| Provider  | File            | Prerequisites                                      |
|-----------|-----------------|----------------------------------------------------|
| **E2B**     | e2b-usage.ts    | E2B_API_KEY                                        |
| **Daytona** | daytona-usage.ts| DAYTONA_API_KEY, DAYTONA_API_URL                   |
| **Modal**   | modal-usage.ts  | MODAL_TOKEN_ID, MODAL_TOKEN_SECRET                  |
| **Vercel**  | vercel-usage.ts | VERCEL_OIDC_TOKEN or VERCEL_TEAM_ID/PROJECT_ID/TOKEN |
| **Local**   | local-usage.ts  | None (runs on current machine)                     |


## Running Examples

```bash
bun run example:e2b
bun run example:daytona
bun run example:modal  
bun run example:vercel
bun run example:local
```

## Running Examples with tsx

```bash
bunx tsx examples/sandbox/e2b-usage.ts
bunx tsx examples/sandbox/daytona-usage.ts
bunx tsx examples/sandbox/modal-usage.ts
bunx tsx examples/sandbox/vercel-usage.ts
bunx tsx examples/sandbox/local-usage.ts
```