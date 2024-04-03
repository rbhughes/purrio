import "../globals.css";

import { redirect } from "next/navigation";
import { checkUser } from "@/utils/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = await checkUser();
  if (!user) {
    redirect("/");
  }
  console.log("protected layout ---->");

  return <>{children}</>;
}
