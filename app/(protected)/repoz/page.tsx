import React from "react";
import { createClient } from "@/lib/supabase/server";

//import { RepoRecon } from "./repo-recon";
//import ShowRepo from "./show-repo";
//import ShowRepos from "./show-repos";
import ShowRepoz from "./show-repoz";

import { fetchGeoTypes, fetchHostnames } from "@/lib/actions";

import { Database } from "@/lib/sb_types";

export const dynamic = "force-dynamic";

type Repo = Database["public"]["Tables"]["repos"]["Row"];

export default async function Page() {
  const supabase = createClient();

  const geotypes = await fetchGeoTypes(supabase);
  const hostnames = await fetchHostnames(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user ? user.email! : "guest";

  const { data: repos } = await supabase
    .from("repos")
    .select()
    .order("row_changed", { ascending: false });

  return (
    <div>
      {/* <RepoRecon email={email} geotypes={geotypes} hostnames={hostnames} /> */}
      <ShowRepoz repos={repos!} />
    </div>
  );
}
