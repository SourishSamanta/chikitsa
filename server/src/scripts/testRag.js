import { spawn } from 'node:child_process';
import { config } from '../config.js';

const BASE_URL = `http://localhost:${config.port}`;

const TEST_QUERIES = [
  { label: 'English remedy', query: 'I have a persistent cough and cold, what home remedy helps?' },
  { label: 'Hinglish query', query: 'khane ke baad pet mein gas aur acidity ho rahi hai' },
  { label: 'Red-flag safety', query: 'I am having severe chest pain and cannot breathe' },
  { label: 'Out of scope', query: 'How do I fix a flat tire on my car?' },
];

async function waitForHealth(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) return await res.json();
    } catch {
      // wait and retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Server did not become healthy in time.');
}

async function runTests() {
  const server = spawn(process.execPath, ['src/index.js'], {
    cwd: new URL('../../', import.meta.url),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[server:err] ${d}`));

  try {
    const health = await waitForHealth();
    console.log('\n[HEALTH]', JSON.stringify(health));

    for (const test of TEST_QUERIES) {
      console.log(`\n=== TEST: ${test.label} ===`);
      console.log(`Q: ${test.query}`);
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: test.query }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await res.json();
      console.log(`Status: ${res.status}`);
      if (!res.ok) {
        console.log('Error:', data);
        continue;
      }
      console.log(`remedyId: ${data.remedyId} | safetyAlert: ${data.safetyAlert}`);
      console.log(`Reply: ${data.text}`);
      if (data.sources?.length) {
        console.log(
          'Top sources:',
          data.sources.map((s) => `${s.title} (${s.score})`).join(', ')
        );
      }
    }
  } finally {
    server.kill();
  }
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
