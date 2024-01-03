import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { RepoReconForm } from "./components/repo-recon-form";
import RepoTable from "./repo-table";

import { fetchGeoTypes, fetchHostnames } from "@/lib/actions";

import RealtimeMessenger from "@/components/realtime-messenger";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
        <RepoReconForm
          email={email}
          geotypes={geotypes}
          hostnames={hostnames}
        />

        <RealtimeMessenger user={user} directive={"recon"} />
        <RepoTable repos={repos!} />
      </div>
    )
  );
}
