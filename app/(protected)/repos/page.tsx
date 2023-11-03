import { createClient } from "@/lib/supabase/server";

import { RepoRecon } from "./repo-recon";

export const dynamic = "force-dynamic";

import { fetchGeoTypes, fetchHostnames } from "./server-actions";

export default async function Page() {
  const supabase = createClient();

  const geotypes = await fetchGeoTypes(supabase);
  const hostnames = await fetchHostnames(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user ? user.email! : "guest";

  const { data: repos } = await supabase.from("repos").select();

  return (
    <div>
      <RepoRecon email={email} geotypes={geotypes} hostnames={hostnames} />
      <pre>{JSON.stringify(repos, null, 2)}</pre>;
    </div>
  );
}
