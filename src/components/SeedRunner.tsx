import { useState } from 'react';
import { runDatabaseSeed } from '@/lib/api';

export default function SeedRunner() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');

  async function handleRunSeed() {
    setStatus('running');
    try {
      const result = await runDatabaseSeed('seed-fabnetwork-2025');
      setResultMessage(`✅ Inserted ${result.inserted} locations (${result.errors} errors)`);
      setStatus('done');
    } catch (error: any) {
      setResultMessage(`❌ Error: ${error.message}`);
      setStatus('error');
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">
        <h2 className="font-bold text-lg text-foreground mb-2">Seed Database</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This will insert all locations into Supabase. Run once only.
        </p>
        <button
          onClick={handleRunSeed}
          disabled={status === 'running' || status === 'done'}
          className="w-full bg-foreground text-background rounded-xl py-2.5 font-semibold text-sm hover:opacity-80 transition disabled:opacity-40"
        >
          {status === 'running' ? 'Running…' : status === 'done' ? 'Done!' : 'Run Seed'}
        </button>
        {resultMessage && (
          <p className="mt-4 text-sm font-mono text-foreground/70">{resultMessage}</p>
        )}
      </div>
    </div>
  );
}
