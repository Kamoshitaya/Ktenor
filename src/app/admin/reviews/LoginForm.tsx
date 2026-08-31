"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(true);
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <h1 className="text-[length:var(--text-h2)]">Reviews admin</h1>
        <p className="mt-2 text-sm text-text-secondary">Password required.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          className={`mt-6 w-full rounded-[var(--radius-sm)] border bg-bg-raised px-4 py-3.5 text-body text-text outline-none focus-visible:border-accent ${
            error ? "border-[var(--c-danger-border)]" : "border-line-strong"
          }`}
        />
        {error ? (
          <p role="alert" className="mt-2 text-caption text-danger">
            Wrong password.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full cursor-pointer rounded-[var(--radius-sm)] bg-text px-6 py-3.5 text-sm font-medium text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
