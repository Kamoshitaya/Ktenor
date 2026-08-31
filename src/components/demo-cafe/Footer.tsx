import { BeanMark } from "./BeanMark";
import { site } from "@/content/demo-cafe/site";

export function Footer() {
  return (
    <footer className="bg-ink py-8 text-[var(--cream)]">
      <div className="container-page flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <BeanMark className="size-5 text-terracotta" />
          <span className="font-display text-[1.05rem]">{site.name}</span>
        </div>
        <p className="text-sm text-[var(--cream)]/70">
          {site.address.replace(", Slovakia", "")} · {site.phoneDisplay}
        </p>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--cream)]/50">
          A Ktenor demo project
        </p>
      </div>
    </footer>
  );
}
