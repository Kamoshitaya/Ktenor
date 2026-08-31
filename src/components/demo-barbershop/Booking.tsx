"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { serviceGroups, type ServiceItem } from "@/content/demo-barbershop/services";
import { team } from "@/content/demo-barbershop/team";

const DAY_COUNT = 6;
// A few slots read as taken so the picker feels like a real live calendar,
// not an empty demo grid — deterministic per day so it doesn't reshuffle.
const SLOTS = ["09:00", "10:00", "11:00", "12:30", "14:00", "15:00", "16:00", "17:30", "18:30"];
const TAKEN: Record<number, string[]> = {
  0: ["10:00", "16:00"],
  1: ["09:00", "14:00"],
  2: ["11:00", "17:30"],
  3: ["12:30", "18:30"],
  4: ["09:00", "15:00"],
  5: ["16:00", "17:30"],
};

type Selected = ServiceItem & { category: string };
type Status = "idle" | "sending" | "sent";

function buildDays() {
  const fmtDay = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
  const fmtDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  return Array.from({ length: DAY_COUNT }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { top: fmtDay.format(d).toUpperCase(), bottom: fmtDate.format(d) };
  });
}

export function Booking() {
  // This page is statically prerendered, so "today" at build time and
  // "today" for a real visitor are two different dates — computing this
  // during render would bake stale dates into the HTML and mismatch on
  // hydration. Starting empty and filling it in after mount keeps server
  // and client output identical, then the real dates appear a tick later.
  const [days, setDays] = useState<{ top: string; bottom: string }[]>([]);
  useEffect(() => setDays(buildDays()), []);

  const [selected, setSelected] = useState<Selected | null>(null);
  const [barber, setBarber] = useState("First free");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const complete = Boolean(selected && slot && name.trim() && phone.trim());
  const price = selected ? selected.price : null;

  function pick(category: string, itemName: string) {
    if (!itemName) {
      setSelected((s) => (s?.category === category ? null : s));
      return;
    }
    const item = serviceGroups.find((g) => g.category === category)?.items.find((i) => i.name === itemName);
    if (item) setSelected({ ...item, category });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete) {
      setError("Pick a service, a time and leave your name and phone.");
      return;
    }
    setError(null);
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  }

  function reset() {
    setSelected(null);
    setBarber("First free");
    setSlot(null);
    setName("");
    setPhone("");
    setStatus("idle");
  }

  return (
    <section id="booking" className="relative isolate bg-[var(--charcoal-raised)] py-20 md:py-28">
      <div className="section-wash" data-tone="brass" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">Booking</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] uppercase leading-tight text-ivory">
            Take a chair.
          </h2>
          <p className="mt-3 text-sm text-ivory-muted">
            Choose the service, the barber and the hour. We hold the slot and confirm by phone.
          </p>
        </header>

        {status === "sent" ? (
          <div data-reveal className="mx-auto mt-12 max-w-md rounded-lg border border-[var(--line)] bg-[var(--charcoal)] p-10 text-center">
            <span aria-hidden className="mx-auto flex w-fit gap-1.5">
              <span className="h-6 w-1.5 rounded-full bg-copper" />
              <span className="h-6 w-1.5 rounded-full bg-copper/70" />
              <span className="h-6 w-1.5 rounded-full bg-copper" />
            </span>
            <h3 className="mt-6 font-display text-[1.6rem] uppercase text-ivory">Request received.</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ivory-muted">
              In a real booking this is where {"we'd"} confirm your slot by SMS. This is a demo —
              nothing was actually booked or sent anywhere.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 rounded-sm border border-copper/50 px-6 py-3 text-sm font-semibold text-copper transition-colors hover:bg-copper/10"
            >
              Book another
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            data-reveal
            className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]"
          >
            <div className="flex flex-col gap-9 rounded-lg border border-[var(--line)] bg-[var(--charcoal)] p-6 sm:p-8">
              <fieldset>
                <legend className="flex w-full items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-copper">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-copper text-[11px]">
                    1
                  </span>
                  Choose service
                  <span className="h-px flex-1 bg-[var(--line)]" />
                </legend>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {serviceGroups.map((g) => (
                    <label key={g.category} className="block">
                      <span className="text-xs uppercase tracking-[0.1em] text-ivory-muted">{g.category}</span>
                      <select
                        value={selected?.category === g.category ? selected.name : ""}
                        onChange={(e) => pick(g.category, e.target.value)}
                        className="mt-1.5 w-full rounded-sm border border-[var(--line)] bg-[var(--charcoal-raised)] px-3 py-2.5 text-sm text-ivory outline-none focus-visible:border-copper"
                      >
                        <option value="">—</option>
                        {g.items.map((i) => (
                          <option key={i.name} value={i.name}>
                            {i.name} · {i.price}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="flex w-full items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-copper">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-copper text-[11px]">
                    2
                  </span>
                  Choose barber
                  <span className="h-px flex-1 bg-[var(--line)]" />
                </legend>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => setBarber("First free")}
                    aria-pressed={barber === "First free"}
                    className={`rounded-sm border p-3 text-left transition-colors ${
                      barber === "First free"
                        ? "border-copper bg-copper/15"
                        : "border-[var(--line)] hover:border-copper/40"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-ivory">First free</span>
                    <span className="text-xs text-ivory-muted">Any barber on shift</span>
                  </button>
                  {team.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setBarber(b.name)}
                      aria-pressed={barber === b.name}
                      className={`flex items-center gap-2.5 rounded-sm border p-2.5 text-left transition-colors ${
                        barber === b.name
                          ? "border-copper bg-copper/15"
                          : "border-[var(--line)] hover:border-copper/40"
                      }`}
                    >
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-full">
                        <Image src={b.photo} alt="" fill sizes="36px" className="object-cover grayscale" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ivory">
                          {b.name.split(" ")[0]}
                        </span>
                        <span className="block truncate text-xs text-ivory-muted">{b.role}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="flex w-full items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-copper">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-copper text-[11px]">
                    3
                  </span>
                  Pick a time
                  <span className="h-px flex-1 bg-[var(--line)]" />
                </legend>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setDay(i);
                        setSlot(null);
                      }}
                      aria-pressed={day === i}
                      className={`shrink-0 rounded-sm border px-4 py-2 text-center text-xs font-semibold uppercase transition-colors ${
                        day === i
                          ? "border-copper bg-copper/15 text-copper"
                          : "border-[var(--line)] text-ivory-soft hover:border-copper/40"
                      }`}
                    >
                      <span className="block">{d.top}</span>
                      <span className="mt-0.5 block text-[10px] font-normal normal-case text-ivory-muted">
                        {d.bottom}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {SLOTS.map((t) => {
                    const taken = TAKEN[day]?.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={taken}
                        onClick={() => setSlot(t)}
                        aria-pressed={slot === t}
                        className={`rounded-sm border px-2 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:text-ivory-muted/40 disabled:line-through ${
                          slot === t
                            ? "border-copper bg-copper/15 text-copper"
                            : taken
                              ? "border-[var(--line)]"
                              : "border-[var(--line)] text-ivory-soft hover:border-copper/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="flex w-full items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-copper">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-copper text-[11px]">
                    4
                  </span>
                  Your details
                  <span className="h-px flex-1 bg-[var(--line)]" />
                </legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className="rounded-sm border border-[var(--line)] bg-[var(--charcoal-raised)] px-4 py-3 text-body text-ivory outline-none transition-colors placeholder:text-ivory-muted focus-visible:border-copper"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    type="tel"
                    autoComplete="tel"
                    className="rounded-sm border border-[var(--line)] bg-[var(--charcoal-raised)] px-4 py-3 text-body text-ivory outline-none transition-colors placeholder:text-ivory-muted focus-visible:border-copper"
                  />
                </div>
              </fieldset>

              {error ? (
                <p role="alert" className="text-sm text-[#e0a0a0]">
                  {error}
                </p>
              ) : null}
            </div>

            <aside className="sticky top-24 rounded-lg border border-[var(--line)] bg-[var(--charcoal)] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-copper">Your chair</h3>
              <span className="mt-2 block h-px w-8 bg-copper/60" />

              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-ivory-muted">Service</dt>
                  <dd className="mt-1 text-ivory">
                    {selected ? `${selected.name} · ${selected.duration}` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-ivory-muted">Barber</dt>
                  <dd className="mt-1 text-ivory">{barber === "First free" ? "First free" : barber}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-ivory-muted">When</dt>
                  <dd className="mt-1 text-ivory">
                    {days[day] ? `${days[day].top} ${days[day].bottom}` : "—"}
                    {slot ? ` · ${slot}` : " · pick a slot"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t border-[var(--line)] pt-4">
                <span className="text-xs uppercase tracking-[0.08em] text-ivory-muted">Total</span>
                <span className="font-display text-xl text-copper">{price ?? "—"}</span>
              </div>

              <button
                type="submit"
                disabled={!complete || status === "sending"}
                className="mt-5 w-full rounded-sm bg-copper px-5 py-3.5 text-sm font-semibold text-charcoal-deep transition-opacity disabled:cursor-not-allowed disabled:bg-[var(--line)] disabled:text-ivory-muted"
              >
                {status === "sending"
                  ? "Sending…"
                  : complete
                    ? "Request appointment"
                    : "Complete the steps"}
              </button>
              <p className="mt-3 text-center text-[11px] uppercase tracking-[0.08em] text-ivory-muted/70">
                Demo form · no data is sent
              </p>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
