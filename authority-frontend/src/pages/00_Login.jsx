import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useFloodCommand } from '../context/FloodCommandContext';

export default function LoginPage() {
  const { login, authToken } = useFloodCommand();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (authToken) return <Navigate to="/command" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);
    if (!result.success) setError(result.error || 'Unable to sign in. Check your credentials and try again.');
  };

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-6 text-ink">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-elevated space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple flex items-center justify-center text-white"><ShieldCheck className="w-6 h-6" /></div>
          <div><h1 className="text-lg font-bold">Authority Sign In</h1><p className="text-sm text-ink-secondary">Flood Response Command Center</p></div>
        </div>
        <label className="block text-sm font-semibold">Username
          <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-ink outline-none focus:border-purple" />
        </label>
        <label className="block text-sm font-semibold">Password
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-ink outline-none focus:border-purple" />
        </label>
        {error && <p role="alert" className="rounded-lg bg-status-alert-soft px-3 py-2 text-sm text-status-alert">{error}</p>}
        <button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-purple px-4 py-2.5 font-bold text-white transition-colors hover:bg-purple-deep disabled:opacity-60">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-ink-muted">Demo operator: operator1 / demo1234</p>
      </form>
    </main>
  );
}
