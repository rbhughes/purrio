import AuthButton from "../components/AuthButton";
import { redirect } from "next/navigation";

import { sessionExists } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Index() {
  const session = await sessionExists();

  // change to search later
  if (session) {
    return redirect("/repos");
  }

  return (
    <div className="flex flex-col min-h-screen gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-purple-200">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          {/* {session ? <h1>already a session</h1> : <AuthButton />} */}
          {session ? (
            <h1>already a session</h1>
          ) : (
            <Link
              href="/login"
              className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
              Login (page)
            </Link>
          )}
        </div>
      </nav>

      <main className="flex flex-grow flex-col gap-6">
        THIS IS THE PUBLIC PAGE?
      </main>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        footsie
      </footer>
    </div>
  );
}
