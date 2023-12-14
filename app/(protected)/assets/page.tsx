import React from "react";
import { createClient } from "@/lib/supabase/server";

//import { RepoRecon } from "./repo-recon";
//import ShowRepo from "./show-repo";
//import ShowRepos from "./show-repos";

//import { fetchGeoTypes, fetchHostnames } from "./server-actions";

import { Database } from "@/lib/sb_types";

export const dynamic = "force-dynamic";

type Repo = Database["public"]["Tables"]["repo"]["Row"];

export default async function Page() {
  const supabase = createClient();

  //const geotypes = await fetchGeoTypes(supabase);
  //const hostnames = await fetchHostnames(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user ? user.email! : "guest";

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("row_changed", { ascending: false });

  return (
    <div>
      <h1>asset form</h1>
      <pre>repo path a | well survey vector raster etc | filter</pre>
      <pre>repo path b | well survey vector raster etc | filter</pre>
      <pre>requirements</pre>
      <pre>show filterable table with all repos and possible assets</pre>

      <pre>[should look similar to /repos route]</pre>

      <pre>FILTERS</pre>
      <pre>geo_type, basically most repo fields </pre>

      <pre>CHECKBOXES</pre>
      <pre>one per asset</pre>

      <pre>saving state will be in a separate table:</pre>
      <pre>geo_type</pre>
      <pre>repo_id</pre>
      <pre>asset a (boolean) filter (text)</pre>
      <pre>asset b (boolean) filter (text)</pre>
      <pre>asset c (boolean) filter (text)</pre>

      {/* <RepoRecon email={email} geotypes={geotypes} hostnames={hostnames} />

      <ShowRepos repos={repos!} /> */}
    </div>
  );
}
