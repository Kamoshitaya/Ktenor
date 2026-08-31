import Link from "next/link";

type Variant = "primary" | "secondary" | "quiet";

type Props = {
  variant?: Variant;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  /** Full width below sm — the right default for a lone CTA on a phone. */
  block?: boolean;
  disabled?: boolean;
};

/**
 * One button, five call sites. The CTA styles used to be copy-pasted, which is
 * how the band's primary ended up laid out differently from the hero's and
 * broke its label across three lines.
 *
 * Primary is the brand steel rather than a flat white block: white reads as a
 * generic system button and fights the palette instead of belonging to it.
 */
const base =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium " +
  "transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-standard)] " +
  "active:scale-[0.985] cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "px-7 py-4 text-[var(--c-accent-contrast)] " +
    "bg-[linear-gradient(180deg,var(--btn-top),var(--btn-bottom))] " +
    "shadow-[inset_0_1px_0_var(--btn-highlight)] " +
    "hover:bg-[linear-gradient(180deg,var(--btn-top-hover),var(--btn-bottom-hover))]",
  secondary:
    "surface px-7 py-4 hover:bg-[var(--surface-bg-hover)] hover:border-[var(--surface-border-hover)]",
  quiet:
    "px-5 py-3 border border-line-strong hover:border-accent hover:bg-[var(--surface-bg-hover)]",
};

export function Button({
  variant = "primary",
  href,
  type = "button",
  onClick,
  children,
  className,
  block,
  disabled,
}: Props) {
  const classes = `${base} ${variants[variant]} ${block ? "w-full sm:w-auto" : ""} ${
    disabled ? "pointer-events-none opacity-60" : ""
  } ${className ?? ""}`;

  if (href) {
    const external = href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");
    if (external) {
      return (
        <a href={href} onClick={onClick} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
