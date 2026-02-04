/**
 * Local sandbox example for intellaai
 *
 * Commands, file operations, and runCode. No remote API keys required.
 *
 * Run: npm run example:local-sandbox
 */

import { IntellaSDK, SandboxProviderType } from 'intella';

async function main() {
  const sdk = new IntellaSDK();

  await sdk.initializeSandbox(SandboxProviderType.LOCAL, {
    cwd: process.cwd(),
    env: { NODE_ENV: 'development' },
  });

  const sandbox = sdk.getActiveSandbox();
  if (!sandbox) throw new Error('Failed to get sandbox');

  console.log('=== Commands ===');
  const cmd = await sandbox.executeCommand('echo "Hello" && node -e "console.log(1+1)"');
  console.log('stdout:', cmd.stdout);
  console.log('exitCode:', cmd.exitCode);

  console.log('\n=== File operations ===');
  const dir = './.intella-example-tmp';
  await sandbox.createDirectory(dir);
  await sandbox.writeFile(`${dir}/hello.txt`, 'Hello from intella file write');
  const content = await sandbox.readFile(`${dir}/hello.txt`);
  console.log('Read back:', content);
  const files = await sandbox.listFiles(dir);
  console.log('Files in dir:', files.map((f: string) => f));

  console.log('\n=== runCode (Python) ===');
  const codeResult = await sandbox.runCode('print(2 + 2)', {
    language: 'python',
    timeout: 10_000,
  });
  console.log('stdout:', codeResult.stdout?.join('') ?? codeResult.text);
  if (codeResult.error) console.log('error:', codeResult.error);

  await sandbox.deleteFile(`${dir}/hello.txt`);
  await sdk.closeSandbox();
  console.log('\nDone.');
}

main().catch(console.error);
