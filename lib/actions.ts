"use server";

import { z } from "zod";
import { RepoReconFormSchema } from "@/app/(protected)/repos/repo-recon-form-schema";
import { AssetJobFormSchema } from "@/app/(protected)/assets/asset-job-form-schema";

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

import { cookies } from "next/headers";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
type Repo = Database["public"]["Tables"]["repo"]["Row"];

type RepoReconFormInputs = z.infer<typeof RepoReconFormSchema>;
type AssetJobFormInputs = z.infer<typeof AssetJobFormSchema>;

// // this should match purrio_client:
// interface ReconBody {
//   recon_root: string;
//   geo_type: string;
//   ggx_host?: string;
//   kingdom_server?: string;
//   kingdom_username?: string;
//   kingdom_password?: string;
//   worker?: string;
// }

///////////////////////////////////////////////////////////////////////////////

export async function enqueueRepoReconTask(formData: RepoReconFormInputs) {
  const cookieStore = cookies();
  const zodRes = RepoReconFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: zodRes.error };
  } else {
    const supabase = createClient(cookieStore);

    const supRes = await supabase.from("task").insert({
      worker: await pickWorker(),
      directive: "recon",
      body: formData,
      status: "PENDING",
    });

    if (supRes.status !== 201) {
      return { data: supRes.statusText, error: null };
    } else {
      return { data: null, error: supRes.statusText };
    }
  }
}

export async function enqueueAssetJobTask(formData: AssetJobFormInputs) {
  const cookieStore = cookies();
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: zodRes.error };
  } else {
    const supabase = createClient(cookieStore);

    const supRes = await supabase.from("task").insert({
      worker: await pickWorker(),
      directive: "batcher",
      status: "PENDING",
      body: formData,
    });

    if (supRes.status !== 201) {
      return { data: supRes.statusText, error: null };
    } else {
      return { data: null, error: supRes.statusText };
    }
  }
}

export async function deleteRepo(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("repo").delete().eq("id", id);
  if (error) {
    console.log("deleteRepo WAS NOT A SUCCESS");
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

export async function updateAssetJob(formData: AssetJobFormInputs) {
  const cookieStore = cookies();
  const result = AssetJobFormSchema.safeParse(formData);

  if (!result.success) {
    return { status: false, error: JSON.stringify(result) };
  }

  const supabase = createClient(cookieStore);

  const res = await supabase
    .from("asset_job")
    .update({
      active: formData.active,
      asset: formData.asset,
      chunk: formData.chunk,
      cron: formData.cron,
      filter: formData.filter,
      repo_fs_path: formData.repo_fs_path,
      //repo_geo_type: formData.repo_geo_type,
      geo_type: formData.geo_type,
      repo_id: formData.repo_id,
      repo_name: formData.repo_name,
    })
    .eq("id", formData.id);

  if (res.status === 204) {
    return { status: true, error: null };
  } else {
    return { status: false, error: JSON.stringify(res) };
  }
}

export async function createAssetJob(formData: AssetJobFormInputs) {
  const cookieStore = cookies();
  const result = AssetJobFormSchema.safeParse(formData);

  if (!result.success) {
    return { status: false, error: JSON.stringify(result) };
  }

  const supabase = createClient(cookieStore);

  const res = await supabase.from("asset_job").insert({
    active: formData.active,
    asset: formData.asset,
    chunk: formData.chunk,
    cron: formData.cron,
    filter: formData.filter,
    repo_fs_path: formData.repo_fs_path,
    //repo_geo_type: formData.repo_geo_type,
    geo_type: formData.geo_type,
    repo_id: formData.repo_id,
    repo_name: formData.repo_name,
  });

  if (res.status === 204) {
    return { status: true, error: null };
  } else {
    return { status: false, error: JSON.stringify(res) };
  }
}

///////////////////////////////////////////////////////////////////////////////

export async function fetchWorkers(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase.from("worker").select("hostname");
  if (error) {
    console.error(error);
    return [];
  } else {
    const workers: string[] = data.map((x) => String(x.hostname));
    return workers;
  }
}

// TODO: make this random?
export const pickWorker = async (): Promise<string> => {
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
