/** One-command local BDD runner. Starts and cleans up the synthetic demo server. */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const cwd = path.dirname(fileURLToPath(import.meta.url));
const server = spawn(process.execPath, ['../../demo-app/server.mjs'], { cwd, stdio: ['ignore', 'pipe', 'inherit'] });
let stopped = false;
const stop = () => { if (!stopped) { stopped = true; server.kill(); } };
process.on('SIGINT', () => { stop(); process.exit(130); });
process.on('SIGTERM', () => { stop(); process.exit(143); });

try {
  let ready = false;
  for (let i=0; i<50; i++) {
    if (server.exitCode != null) break;
    try {
      const response = await fetch('http://127.0.0.1:4173/api/health');
      if (response.ok) { ready = true; break; }
    } catch { /* server is still starting */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('Demo service could not start on port 4173. Check if the port is taken.');
  const command = process.platform === 'win32' ? 'wdio.cmd' : 'wdio';
  const wdio = spawn(path.join(cwd, 'node_modules', '.bin', command), ['run', 'wdio.conf.ts'], { cwd, stdio: 'inherit' });
  const code = await new Promise((resolve,reject)=>{ wdio.once('exit',(code,signal)=>resolve(code ?? (signal ? 1 : 0))); wdio.once('error',reject); });
  process.exitCode = code;
} catch (error) { console.error(error); process.exitCode = 1; }
finally { stop(); }
