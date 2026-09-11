"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { hotspots, TOOTH_COUNT } from "@/content/demo-dental/teeth";
import { treatments } from "@/content/demo-dental/services";
import { useDental } from "./DentalContext";
import { SceneBoundary } from "./SceneBoundary";
import { Icon, Reveal, SectionHeading } from "./ui";

/* three.js has no business running on the server, and it should not sit in the
   first-load bundle either — it arrives only once this section is near view. */
const ToothScene = dynamic(() => import("./ToothScene"), { ssr: false });

/** The arch is mirrored, so both sides of a pair map to the same hotspot. */
function hotspotForIndex(index: number | null) {
  if (index === null) return null;
  const mirrored = TOOTH_COUNT - 1 - index;
  return hotspots.find((h) => h.index === index || h.index === mirrored) ?? null;
}

/**
 * Can this browser give us a context at all? Asking costs one, so it is
 * handed straight back — on a machine that has run out (a dozen tabs of 3D
 * will do it) the answer is no, and we want the fallback rather than a black
 * rectangle and a console full of renderer errors.
 */
function webglWorks() {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function ToothTeaser() {
  const { t, go } = useDental();
  const reduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [stage, setStage] = useState<"waiting" | "ready" | "unsupported">("waiting");
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = holder.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStage(webglWorks() ? "ready" : "unsupported");
          observer.disconnect();
        }
      },
      { rootMargin: "220px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeHotspot = hotspotForIndex(selected) ?? hotspotForIndex(hovered);
  const treatment = activeHotspot
    ? treatments.find((item) => item.id === activeHotspot.treatmentId)
    : null;

  const sceneFallback = (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-sage-200">
      <Icon name="tooth" size={40} />
      <p className="max-w-[26ch] text-sm leading-relaxed">{t(copy.home.toothFallback)}</p>
    </div>
  );

  return (
    <section className="rb-section bg-cream-deep">
      <div className="rb-container">
        <SectionHeading
          eyebrow={t({ sk: "Interaktívny model", en: "Interactive model" })}
          title={t(copy.home.toothTitle)}
          lead={t(copy.home.toothLead)}
          align="center"
        />

        {/*
          Aligned to the top, not centred: the treatment card below the hotspot
          list appears and disappears, and with items-center that changing
          column height re-centres the canvas beside it — the model visibly
          jumped ~50px every time a tooth was picked.
        */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <div
              ref={holder}
              /* Dark ground, so a white outline on white enamel has something
                 to read against. It also matches the canvas's own clear colour,
                 which keeps the frame seamless while the model loads. */
              className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-card)] border border-sage-900/20 bg-[#16302a] sm:aspect-16/10"
            >
              {stage === "ready" ? (
                /* The hint sits inside the boundary too — telling someone to
                   drag a model that failed to load is worse than saying
                   nothing. */
                <SceneBoundary fallback={sceneFallback}>
                  <ToothScene
                    hovered={hovered}
                    selected={selected}
                    onHover={setHovered}
                    onSelect={(index) =>
                      setSelected((current) => (current === index ? null : index))
                    }
                    reduceMotion={reduceMotion}
                  />
                  <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-cream/15 px-3 py-1 text-[0.72rem] font-semibold text-cream backdrop-blur-sm">
                    {t(copy.home.toothHint)}
                  </p>
                </SceneBoundary>
              ) : stage === "unsupported" ? (
                sceneFallback
              ) : (
                <div className="grid h-full place-items-center text-sage-300">
                  <Icon name="tooth" size={44} />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {/*
                The canvas cannot be reached with a keyboard, so the same three
                teeth are also plain buttons. This is the accessible path, and
                it doubles as the obvious one on a phone.
              */}
              {hotspots.map((spot) => {
                const isActive = activeHotspot?.treatmentId === spot.treatmentId;
                return (
                  <button
                    key={spot.treatmentId}
                    type="button"
                    onMouseEnter={() => setHovered(spot.index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(spot.index)}
                    onBlur={() => setHovered(null)}
                    onClick={() =>
                      setSelected((current) => (current === spot.index ? null : spot.index))
                    }
                    aria-pressed={isActive}
                    className={`rb-card w-full px-5 py-4 text-left ${
                      isActive ? "border-coral shadow-[0_16px_34px_-24px_rgb(184_74_46/0.6)]" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          isActive ? "bg-coral" : "bg-sage-300"
                        }`}
                      />
                      <span className="font-display font-bold text-sage-900">
                        {t(spot.label)}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm text-ink-soft">{t(spot.note)}</span>
                  </button>
                );
              })}

              <AnimatePresence mode="wait">
                {treatment && (
                  <motion.div
                    key={treatment.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="rounded-[var(--radius-card)] bg-sage-900 p-5 text-sage-200"
                  >
                    <p className="font-display text-base font-bold text-cream">
                      {t(treatment.name)}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed">{t(treatment.description)}</p>
                    <p className="tabular mt-3 font-display font-bold text-cream">
                      {t(copy.common.from)} €{treatment.priceFrom}
                    </p>
                    <button
                      type="button"
                      onClick={() => go("services", { treatmentId: treatment.id })}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-bold text-sage-900 transition-transform hover:scale-[1.03]"
                    >
                      {t(copy.home.toothCta)}
                      <Icon name="arrow" size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
