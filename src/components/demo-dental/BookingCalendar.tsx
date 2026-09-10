"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { buildDays, type BookingDay } from "@/content/demo-dental/slots";
import { useDental } from "./DentalContext";

const LOCALE_TAG = { sk: "sk-SK", en: "en-GB" } as const;

export type SlotSelection = { iso: string; time: string; dayIndex: number };

export function BookingCalendar({
  doctorId,
  value,
  onSelect,
}: {
  doctorId: string | null;
  value: SlotSelection | null;
  onSelect: (selection: SlotSelection) => void;
}) {
  const { t, locale } = useDental();
  const reduceMotion = useReducedMotion();

  /* Built once per doctor. Re-deriving on every render would rebuild fourteen
     days of slots on each keystroke elsewhere in the form. */
  const days = useMemo(() => buildDays(doctorId), [doctorId]);

  const hasRoom = (day: BookingDay | undefined) =>
    Boolean(day && !day.isClosed && day.slots.some((slot) => !slot.taken));

  const firstOpen = days.findIndex((day) => hasRoom(day));
  const [chosenDayIndex, setChosenDayIndex] = useState(Math.max(0, firstOpen));

  /*
   * Switching dentist can empty the day that was picked. The fallback is
   * derived rather than written back with an effect, so there is no render
   * pass showing an empty grid before a correction lands.
   */
  const dayIndex = hasRoom(days[chosenDayIndex])
    ? chosenDayIndex
    : firstOpen >= 0
      ? firstOpen
      : chosenDayIndex;

  const setDayIndex = setChosenDayIndex;
  const day = days[dayIndex];
  const morning = day?.slots.filter((slot) => slot.part === "morning") ?? [];
  const afternoon = day?.slots.filter((slot) => slot.part === "afternoon") ?? [];
  const nothingFree = Boolean(day && !day.isClosed && day.slots.every((slot) => slot.taken));

  return (
    <div>
      {/* --- Day strip ---------------------------------------------------- */}
      <div
        className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-3"
        role="tablist"
        aria-label={t(copy.booking.step3Title)}
      >
        {days.map((entry, index) => (
          <DayButton
            key={entry.iso}
            day={entry}
            index={index}
            selected={index === dayIndex}
            locale={locale}
            onSelect={() => setDayIndex(index)}
          />
        ))}
      </div>

      {/* --- Slots -------------------------------------------------------- */}
      <div className="mt-5 min-h-[13rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={day?.iso ?? "none"}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            {day?.isClosed ? (
              <EmptyNote text={t(copy.booking.closedDay)} />
            ) : nothingFree ? (
              <EmptyNote text={t(copy.booking.noSlots)} />
            ) : (
              <div className="space-y-5">
                {morning.length > 0 && (
                  <SlotGroup
                    title={t(copy.booking.morning)}
                    slots={morning}
                    day={day!}
                    dayIndex={dayIndex}
                    value={value}
                    onSelect={onSelect}
                    takenLabel={t(copy.booking.slotTaken)}
                  />
                )}
                {afternoon.length > 0 && (
                  <SlotGroup
                    title={t(copy.booking.afternoon)}
                    slots={afternoon}
                    day={day!}
                    dayIndex={dayIndex}
                    value={value}
                    onSelect={onSelect}
                    takenLabel={t(copy.booking.slotTaken)}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DayButton({
  day,
  index,
  selected,
  locale,
  onSelect,
}: {
  day: BookingDay;
  index: number;
  selected: boolean;
  locale: "sk" | "en";
  onSelect: () => void;
}) {
  const tag = LOCALE_TAG[locale];
  const weekday = day.date.toLocaleDateString(tag, { weekday: "short" });
  const dayNumber = day.date.toLocaleDateString(tag, { day: "numeric" });
  const month = day.date.toLocaleDateString(tag, { month: "short" });
  const free = day.slots.filter((slot) => !slot.taken).length;
  const disabled = day.isClosed || free === 0;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      disabled={disabled}
      className={`flex min-w-[4.6rem] shrink-0 snap-start flex-col items-center gap-0.5 rounded-2xl border-2 px-3 py-2.5 transition-colors duration-200 ${
        selected
          ? "border-sage-700 bg-sage-700 text-cream"
          : disabled
            ? "cursor-not-allowed border-line bg-cream-deep text-ink-faint"
            : "border-line bg-surface text-ink hover:border-sage-300"
      }`}
    >
      <span className="text-[0.68rem] font-bold uppercase tracking-wide">
        {index === 0 ? (locale === "sk" ? "Dnes" : "Today") : weekday}
      </span>
      <span className="tabular font-display text-lg font-bold leading-none">{dayNumber}</span>
      <span className="text-[0.66rem] uppercase opacity-80">{month}</span>
      <span
        className={`tabular mt-0.5 text-[0.62rem] font-semibold ${
          selected ? "text-sage-200" : disabled ? "" : "text-coral-ink"
        }`}
      >
        {disabled ? "—" : free}
      </span>
    </button>
  );
}

function SlotGroup({
  title,
  slots,
  day,
  dayIndex,
  value,
  onSelect,
  takenLabel,
}: {
  title: string;
  slots: BookingDay["slots"];
  day: BookingDay;
  dayIndex: number;
  value: SlotSelection | null;
  onSelect: (selection: SlotSelection) => void;
  takenLabel: string;
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
        {title}
      </h3>
      <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {slots.map((slot) => {
          const isSelected = value?.iso === day.iso && value?.time === slot.time;
          return (
            <button
              key={slot.time}
              type="button"
              disabled={slot.taken}
              title={slot.taken ? takenLabel : undefined}
              onClick={() => onSelect({ iso: day.iso, time: slot.time, dayIndex })}
              className={`tabular min-h-[44px] rounded-xl border-2 px-2 py-2 text-sm font-bold transition-all duration-200 ${
                slot.taken
                  ? "cursor-not-allowed border-line bg-cream-deep text-ink-faint line-through"
                  : isSelected
                    ? "border-sage-700 bg-sage-700 text-cream"
                    : "border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-sage-500"
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-2xl bg-cream-deep px-5 py-8 text-center text-sm text-ink-soft">{text}</p>
  );
}
