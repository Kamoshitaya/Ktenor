export type LegalBlock = { heading: string; body: string[] };
export type LegalDoc = { title: string; updated: string; intro: string; blocks: LegalBlock[] };

/**
 * One layout for every legal page. The privacy policy and the terms are read
 * the same way — scanned by heading, then read in full where it matters — so
 * they share a measure, a rhythm and a type scale rather than each page
 * drifting its own way.
 */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <article className="container-page py-[var(--spacing-section)]">
      <div className="max-w-[68ch]">
        <h1 className="text-[length:var(--text-h1)]">{doc.title}</h1>
        <p className="mt-4 text-caption text-text-muted">{doc.updated}</p>
        <p className="mt-8 text-[length:var(--text-lead)] text-text-secondary">{doc.intro}</p>

        <div className="mt-[var(--spacing-block)] space-y-12">
          {doc.blocks.map((block) => (
            <section key={block.heading}>
              <h2 className="text-[length:var(--text-h3)]">{block.heading}</h2>
              <div className="mt-4 space-y-4">
                {block.body.map((paragraph) => (
                  <p key={paragraph} className="text-text-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
