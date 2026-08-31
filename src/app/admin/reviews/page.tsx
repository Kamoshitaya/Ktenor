import type { Metadata } from "next";
import { isAuthorized } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";
import { AdminReviewsClient } from "./AdminReviewsClient";

export const metadata: Metadata = {
  title: "Reviews admin — Ktenor",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  const authorized = await isAuthorized();
  return authorized ? <AdminReviewsClient /> : <LoginForm />;
}
