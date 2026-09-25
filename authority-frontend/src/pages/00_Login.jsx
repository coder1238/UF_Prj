import React, { useState } from 'react';

export default function LoginPage({ onSignIn }) {
  const [username, setUsername] = useState('operator1');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSignIn();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-10 font-sans text-ink">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-7 shadow-elevated sm:p-9"
      >
        <div className="space-y-3 text-center">
          <img
            src="/branding/hydrosense-logo-full.png"
            alt="HydroSense"
            className="mx-auto h-28 w-56 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Authority sign in</h1>
            <p className="mt-1 text-sm text-ink-secondary">Municipal flood response command</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-semibold">
            <span>Username</span>
            <input
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-ink outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-semibold">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-ink outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
            />
          </label>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            className="w-full rounded-lg bg-purple px-4 py-3 text-sm font-bold text-white shadow-subtle transition hover:bg-purple-deep focus:outline-none focus:ring-2 focus:ring-purple/30 focus:ring-offset-2"
          >
            Sign In
          </button>
          <p className="text-center text-xs text-ink-muted">Demo credentials pre-filled — just click Sign In</p>
        </div>
      </form>
    </main>
  );
}
