import "../globals.css";

import { sessionExists } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await sessionExists();

  if (!session) {
    redirect("/");
  }

  return <div>{children}</div>;
}
