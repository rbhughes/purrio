import "../globals.css";

import { sessionExists } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Next.js and Supabase Starter Kit",
//   description: "The fastest way to build apps with Next.js and Supabase",
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await sessionExists();

  if (!session) {
    redirect("/");
  }

  return (
    <section>{children}</section>
    // <main className="min-h-screen flex flex-col items-center">
    //   {session ? children : <p>no session</p>}
    // </main>
  );
}
