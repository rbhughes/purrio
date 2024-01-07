//import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { RepoReconForm } from "./components/repo-recon-form";
import RepoTable from "./repo-table";

import { fetchGeoTypes, fetchHostnames } from "@/lib/actions";

import RealtimeMessenger from "@/components/realtime-messenger";

import { Toggler } from "./toggler";

export const dynamic = "force-dynamic";

const fakeRepoVis = () => {
  return <>FAKE REPO VIS</>;
};

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

        <Toggler
          componentA={<RepoTable repos={repos!} />}
          componentB={fakeRepoVis()}
        />

        <RealtimeMessenger user={user} directive={"recon"} />

        {process.env.NODE_ENV === "development" && (
          <div className="bg-amber-400 mt-20 w-fit ">
            TODO
            <ul>
              <li>move view/toggle column list</li>
              <li>clean up repo-recon form</li>
              <li>add recon-root to repo model</li>
              <li>toggle: table vs some kinda datavis</li>
              <li>row action: refresh</li>
              <li>row action: forget</li>
              <li>table action: export selected to csv</li>
              <li>table action: refresh selected</li>
              <li>icon for geographix</li>
              <li>icon for petra</li>
              <li>icon for kingdom</li>
              <li>icon for las</li>
              <li>icon for toggle</li>
            </ul>
          </div>
        )}
      </div>
    )
  );
}
