import React from "react";
import { createClient } from "@/lib/supabase/server";

import { RepoRecon } from "./components/repo-recon";
import RepoTable from "./repo-table";

//import { fetchGeoTypes, fetchHostnames } from "./server-actions";
import { fetchGeoTypes, fetchHostnames } from "@/lib/actions";

import { Database } from "@/lib/sb_types";
import Messenger from "@/components/Messenger";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient();

  const geotypes = await fetchGeoTypes(supabase);
  const hostnames = await fetchHostnames(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user ? user.email! : "guest";

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("row_changed", { ascending: false });

  return (
    user && (
      <div>
        <RepoRecon email={email} geotypes={geotypes} hostnames={hostnames} />

        <Messenger user={user} directive={"recon"} />
        <RepoTable repos={repos!} />
      </div>
    )
  );
}
