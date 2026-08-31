"use client";

import { useState } from "react";

export function InitCmsButton() {
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [detail, setDetail] = useState("");

  async function run() {
    setStatus("busy");
    setDetail("");
    try {
      const response = await fetch("/api/admin/init-cms-schema", { method: "POST" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus("error");
        setDetail(data?.error ?? `HTTP ${response.status}`);
        return;
      }
      setStatus("done");
      setDetail(JSON.stringify(data));
    } catch (err) {
      setStatus("error");
      setDetail(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-[length:var(--text-h2)]">Init CMS schema</h1>
        <p className="mt-2 text-sm text-text-secondary">
          One-off: creates the missing Payload tables in production. Safe to run once.
        </p>
        <button
          type="button"
          onClick={run}
          disabled={status === "busy" || status === "done"}
          className="mt-6 w-full cursor-pointer rounded-[var(--radius-sm)] bg-text px-6 py-3.5 text-sm font-medium text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "busy" ? "Running…" : status === "done" ? "Done" : "Run schema push"}
        </button>
        {detail ? (
          <p className="mt-4 break-all text-caption text-text-secondary">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}
