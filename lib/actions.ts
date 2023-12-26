"use server";

import { z } from "zod";
//import { RepoReconFormSchema } from "./repo-recon-schema";
import { RepoReconFormSchema } from "@/app/(protected)/repos/repo-recon-form-schema";
import { AssetJobFormSchema } from "@/app/(protected)/assets/asset-job-form-schema";

//import { createClient } from "@/lib/supabase/server";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

import { cookies } from "next/headers";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
// type Batch = Database["public"]["Tables"]["batch"]["Row"];

type RepoReconInputs = z.infer<typeof RepoReconFormSchema>;
type AssetJobInputs = z.infer<typeof AssetJobFormSchema>;

export async function addRepoReconTask(formData: RepoReconInputs) {
  const cookieStore = cookies();
  console.log("____top of addEntry_____(written to SERVER) formData_______");
  console.log(formData);
  console.log("___________________safeParse result___________________________");

  const result = RepoReconFormSchema.safeParse(formData);
  console.log(result);
  console.log("__________________________________________________");

  if (result.success) {
    const supabase = createClient(cookieStore);

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

// TODO: make this random?
const pickWorker = async (): Promise<string> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("worker")
    .select("hostname")
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return "localhost";
  } else {
    return data.hostname;
  }
};

// {
//   "geo_type": "geographix",
//   "repo_id": "d4aac149-ca2a-100b-83ec-7a5b70a73457",
//   "asset": "well",
//   "chunk": 100,
//   "filter": "w_row_changed_date > CONVERT(DATE, GETDATE() - 1790)"
// }
export async function addAssetJobTask(assetJob: AssetJob) {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("task").insert({
    hostname: await pickWorker(),
    directive: "batcher",
    status: "PENDING",
    body: {
      geo_type: assetJob.repo_geo_type,
      repo_id: assetJob.repo_id,
      asset: assetJob.asset,
      chunk: assetJob.chunk,
      filter: assetJob.filter,
    },
  });

  if (error) {
    console.error(error);
  }
}

export async function deleteAssetJob(id: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("asset_job").delete().eq("id", id);
  if (error) {
    console.log("deleteAssetJob WAS NOT A SUCCESS");
  }
}

export async function saveAssetJob(formData: AssetJobInputs) {
  const cookieStore = cookies();
  const result = AssetJobFormSchema.safeParse(formData);

  if (result.success) {
    const supabase = createClient(cookieStore);

    await supabase.from("asset_job").upsert({
      active: formData.active,
      asset: formData.asset,
      chunk: formData.chunk,
      cron: formData.cron,
      filter: formData.filter,
      last_invoked: formData.last_invoked,
      repo_fs_path: formData.repo_fs_path,
      repo_geo_type: formData.repo_geo_type,
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
