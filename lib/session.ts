import { redirect } from "next/navigation";
import { auth } from "./auth";

/** Redirects to /login when there's no session. Use at the top of a protected server page. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}
