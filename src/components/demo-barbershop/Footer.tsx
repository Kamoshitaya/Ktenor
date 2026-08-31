import { BladeMark } from "./BladeMark";
import { site } from "@/content/demo-barbershop/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="container-page flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 text-ivory">
          <BladeMark className="size-5 text-copper" />
          <span className="font-display text-[1.05rem]">{site.name}</span>
        </div>
        <p className="text-sm text-ivory-muted">
          © {new Date().getFullYear()} {site.name}. A fictional demo project by Ktenor.
        </p>
      </div>
    </footer>
  );
}
