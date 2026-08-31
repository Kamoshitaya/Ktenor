import { notFound } from "next/navigation";

/**
 * Catches anything under /sk or /en that matches no real page, so the branded
 * not-found boundary renders inside the locale layout — with the header,
 * footer and the visitor's language — instead of the framework default.
 */
export default function CatchAll(): never {
  notFound();
}
