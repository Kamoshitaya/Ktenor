"use client";

import { Logo, Wordmark } from "@/components/brand/Logo";

/**
 * Internal reference page for reviewing the foundation in both themes.
 * Not linked from anywhere in the site navigation.
 */

const swatches = [
  "--c-bg",
  "--c-bg-raised",
  "--c-bg-overlay",
  "--c-text",
  "--c-text-secondary",
  "--c-text-muted",
  "--c-accent",
  "--c-accent-mid",
  "--c-accent-deep",
  "--c-silver",
];

const scale = ["--text-display", "--text-h1", "--text-h2", "--text-h3"];

export default function DesignPage() {
  return (
    <div className="container-page py-[var(--spacing-block)]">
      <p className="text-caption uppercase tracking-[0.22em] text-text-muted">
        Internal reference
      </p>
      <h1 className="mt-2 text-h2">Foundation</h1>

      <section className="mt-[var(--spacing-block)] border-t border-line pt-[var(--spacing-block)]">
        <h2 className="mb-8 text-h3">Logo</h2>
        <div className="flex flex-wrap items-end gap-x-16 gap-y-10">
          <div>
            <Logo title="Ktenor" className="h-36 w-auto" />
            <p className="mt-4 text-caption text-text-muted">mark</p>
          </div>
          <div>
            <Logo variant="compact" className="h-36 w-auto" />
            <p className="mt-4 text-caption text-text-muted">compact</p>
          </div>
          <div>
            <Wordmark className="text-[2.25rem]" />
            <p className="mt-4 text-caption text-text-muted">lockup</p>
          </div>
        </div>

        <div className="mt-12 flex items-end gap-10">
          {[16, 24, 32, 48].map((px) => (
            <div key={px}>
              <Logo variant="compact" style={{ height: px }} className="w-auto" />
              <p className="mt-3 text-caption text-text-muted tabular">{px}px</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[var(--spacing-block)] border-t border-line pt-[var(--spacing-block)]">
        <h2 className="mb-8 text-h3">Palette</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((token) => (
            <div key={token}>
              <div
                className="h-20 w-full rounded-[var(--radius-sm)] border border-line-strong"
                style={{ background: `var(${token})` }}
              />
              <p className="mt-2 text-caption text-text-secondary">
                {token.replace("--c-", "")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[var(--spacing-block)] border-t border-line pt-[var(--spacing-block)]">
        <h2 className="mb-8 text-h3">Type scale</h2>
        <div className="space-y-5">
          {scale.map((token) => (
            <div key={token} className="flex items-baseline gap-6">
              <span className="w-24 shrink-0 text-caption text-text-muted">
                {token.replace("--text-", "")}
              </span>
              <span
                className="font-display font-medium"
                style={{ fontSize: `var(${token})`, lineHeight: 1.08 }}
              >
                Ktenor
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-[65ch] space-y-3">
          <p className="text-[length:var(--text-lead)]">
            Satoshi at lead size — hero sub-headlines and section intros.
          </p>
          <p className="text-text-secondary">
            Body copy. Every pair on this page clears WCAG AA in both themes.
          </p>
          <p className="text-sm text-text-muted">
            Muted — the lowest contrast allowed anywhere on the site.
          </p>
        </div>
      </section>

      <section className="mt-[var(--spacing-block)] border-t border-line pt-[var(--spacing-block)] pb-[var(--spacing-section)]">
        <h2 className="mb-8 text-h3">Liquid glass</h2>
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] p-8 sm:p-14">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 80% at 25% 40%, var(--c-accent-deep), transparent 70%), radial-gradient(50% 70% at 75% 60%, var(--c-accent), transparent 75%)",
              opacity: 0.55,
            }}
          />
          <div className="glass max-w-md rounded-[var(--radius-md)] p-6">
            <p className="font-display text-h3">Glass surface</p>
            <p className="mt-2 text-sm text-text-secondary">
              Blur, saturation and hairline all come from tokens. On a weak
              device the blur drops to zero and the fill carries the surface.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
