import { cookies } from "next/headers";
import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Portal | GrowBroo & Verdant Digital",
  description: "Secure lead management portal and enquiry dashboard.",
};

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "growbroo_admin_session";
const SESSION_SECRET = "growbroo_auth_token_secure_2026";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const isAuth = session?.value === SESSION_SECRET;

  return <AdminClient initialAuthenticated={isAuth} />;
}
