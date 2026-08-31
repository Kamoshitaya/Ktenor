export function BladeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M5 22 22 5c1.4-1.4 3.6-1.4 5 0s1.4 3.6 0 5L10 27"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M5 22c-1 1.6-1.5 3.5-1.5 4.5S5 27 6.5 26 8 24 8 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
