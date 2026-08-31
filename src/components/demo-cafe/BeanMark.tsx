export function BeanMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 3.5c6.5 0 12.5 5.2 12.5 12.2 0 6.6-5.6 12.8-12.5 12.8S3.5 22.3 3.5 15.7C3.5 8.7 9.5 3.5 16 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16 4.2c-2.6 4.1-2.6 8-1 11.5 1.6 3.5 1.6 7.4-1 11.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
