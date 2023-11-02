import { sessionExists } from "@/lib/supabase/server";

export default async function Crumble() {
  const currentSession = await sessionExists();

  return <div className="bg-red-200">{currentSession ? "YES" : "NO"}</div>;
}
