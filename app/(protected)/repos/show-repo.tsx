//import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/sb_types";
//import { revalidatePath } from "next/cache";

type Repo = Database["public"]["Tables"]["repos"]["Row"];

export default async function ShowRepo({ repo }: { repo: Repo }) {
  return (
    <p>
      {JSON.stringify(repo)}
      {/* {repo.geo_type} -- {repo.fs_path} -- {repo.row_changed} */}
    </p>
  );
}
