import type { Metadata } from "next";
import { isAuthorized } from "@/lib/admin-auth";
import { LoginForm } from "../reviews/LoginForm";
import { InitCmsButton } from "./InitCmsButton";

export const metadata: Metadata = {
  title: "Init CMS schema — Ktenor",
  robots: { index: false, follow: false },
};

export default async function InitCmsSchemaPage() {
  const authorized = await isAuthorized();
  return authorized ? <InitCmsButton /> : <LoginForm />;
}
