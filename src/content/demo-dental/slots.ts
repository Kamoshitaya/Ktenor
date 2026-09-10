import { doctors } from "./team";

/**
 * Mock availability for the booking calendar.
 *
 * Nothing is hard-coded to a calendar date: a demo with fixed dates looks
 * broken a month after it ships. Instead the grid always starts from today,
 * and whether a slot is taken comes from a hash of doctor + date + time. That
 * keeps it stable across re-renders and page loads (so a slot does not flicker
 * between free and taken) while never going stale.
 */

const MORNING = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45"] as const;
const AFTERNOON = ["13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30"] as const;

/** Friday closes at 15:00 and Saturday is a short morning — see openingHours. */
const FRIDAY_AFTERNOON = ["13:00", "13:45", "14:30"] as const;
const SATURDAY_MORNING = ["09:00", "09:45", "10:30", "11:15", "12:00"] as const;

export type DayPart = "morning" | "afternoon";

export type Slot = {
  time: string;
  part: DayPart;
  taken: boolean;
};

export type BookingDay = {
  /** YYYY-MM-DD, used as a stable key and for the hash. */
  iso: string;
  date: Date;
  weekday: number; // 0 = Sunday
  isClosed: boolean;
  slots: Slot[];
};

/** Small deterministic string hash — same input, same answer, every time. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function timesFor(weekday: number): { morning: readonly string[]; afternoon: readonly string[] } {
  if (weekday === 0) return { morning: [], afternoon: [] }; // Sunday
  if (weekday === 6) return { morning: SATURDAY_MORNING, afternoon: [] }; // Saturday
  if (weekday === 5) return { morning: MORNING, afternoon: FRIDAY_AFTERNOON }; // Friday
  return { morning: MORNING, afternoon: AFTERNOON };
}

/**
 * A given doctor is busy for roughly half their slots, weighted so the next
 * couple of days look fuller than the end of the fortnight — which is how a
 * real diary fills up.
 */
function isTaken(doctorId: string, iso: string, time: string, dayOffset: number): boolean {
  const pressure = dayOffset <= 1 ? 78 : dayOffset <= 4 ? 58 : dayOffset <= 9 ? 42 : 28;
  return hash(`${doctorId}|${iso}|${time}`) % 100 < pressure;
}

/**
 * @param doctorId  a specific dentist, or null for "whoever is free first",
 *                  where a slot counts as open if any dentist has it.
 */
export function buildDays(doctorId: string | null, today = new Date(), count = 14): BookingDay[] {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const ids = doctorId ? [doctorId] : doctors.map((d) => d.id);

  return Array.from({ length: count }, (_, dayOffset) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayOffset);

    const weekday = date.getDay();
    const iso = toIso(date);
    const { morning, afternoon } = timesFor(weekday);
    const isClosed = morning.length === 0 && afternoon.length === 0;

    const build = (times: readonly string[], part: DayPart): Slot[] =>
      times.map((time) => ({
        time,
        part,
        taken: ids.every((id) => isTaken(id, iso, time, dayOffset)),
      }));

    return {
      iso,
      date,
      weekday,
      isClosed,
      slots: [...build(morning, "morning"), ...build(afternoon, "afternoon")],
    };
  });
}

/** Which dentists still have a given slot open — used to resolve "anyone". */
export function doctorsFreeAt(iso: string, time: string, dayOffset: number): string[] {
  return doctors.filter((d) => !isTaken(d.id, iso, time, dayOffset)).map((d) => d.id);
}
