"use server";

import { z } from "zod";
//import { RepoReconFormSchema } from "./repo-recon-schema";
import { RepoReconFormSchema } from "@/app/(protected)/repos/repo-recon-form-schema";
import { AssetJobFormSchema } from "@/app/(protected)/assets/asset-job-form-schema";

import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

// import { Database } from "@/lib/sb_types";
// type Batch = Database["public"]["Tables"]["batch"]["Row"];

type RepoReconInputs = z.infer<typeof RepoReconFormSchema>;
type AssetJobInputs = z.infer<typeof AssetJobFormSchema>;

export async function addRepoReconTask(formData: RepoReconInputs) {
  console.log("____top of addEntry_____(written to SERVER) formData_______");
  console.log(formData);
  console.log("___________________safeParse result___________________________");

  const result = RepoReconFormSchema.safeParse(formData);
  console.log(result);
  console.log("__________________________________________________");

  if (result.success) {
    const supabase = createClient();

    await supabase.from("task").insert({
      hostname: formData.hostname,
      directive: "recon",
      body: {
        geo_type: formData.geo_type,
        ggx_host: "scarab",
        recon_root: formData.recon_root,
      },
      status: "PENDING",
    });

    return { success: true, data: result.data };
  } else {
    console.log("addRepoReconTask WAS NOT A SUCCESS");
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function saveAssetJob(formData: AssetJobInputs) {
  const result = AssetJobFormSchema.safeParse(formData);

  if (result.success) {
    const supabase = createClient();

    await supabase.from("asset_job").upsert({
      active: formData.active,
      asset: formData.asset,
      chunk: formData.chunk,
      cron: formData.cron,
      filter: formData.filter,
      last_invoked: formData.last_invoked,
      repo_fs_path: formData.repo_fs_path,
      repo_id: formData.repo_id,
      repo_name: formData.repo_name,
    });

    return { success: true, data: result.data };
  } else {
    console.log("saveAssetJob WAS NOT A SUCCESS");
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function fetchHostnames(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase.from("worker").select("hostname");
  if (error) {
    console.error(error);
    return [];
  } else {
    const hostnames: string[] = data.map((x) => String(x.hostname));
    return hostnames;
  }
}

export async function fetchGeoTypes(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_geo_type_values");
  if (error) {
    console.error(error);
    return [];
  } else {
    return data;
  }
}

// export async function fetchBatches(supabase: SupabaseClient): Promise<Batch[]> {
//   const { data, error } = await supabase
//     .from("batch")
//     .select()
//     .order("row_created", { ascending: false });
//   if (error) {
//     console.error(error);
//     return [];
//   } else {
//     return data as Batch[];
//   }
// }
