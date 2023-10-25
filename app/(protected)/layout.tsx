import "../globals.css";

import { sessionExists } from "@/utils/supabase/server";

// export const metadata = {
//   title: "Next.js and Supabase Starter Kit",
//   description: "The fastest way to build apps with Next.js and Supabase",
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSession = await sessionExists();

  return (
    <main className="min-h-screen flex flex-col items-center">
      {currentSession ? children : <p>no session</p>}
    </main>
  );
}
