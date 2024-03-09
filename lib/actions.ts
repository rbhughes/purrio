"use server";

import { z } from "zod";
import { RepoReconFormSchema } from "@/app/(protected)/repos/repo-recon-form-schema";
import { AssetJobFormSchema } from "@/app/(protected)/assets/asset-job-form-schema";

import { createClient } from "@/utils/supabase/server";
//import { SupabaseClient } from "@supabase/supabase-js";

import { cookies } from "next/headers";

//import { Database } from "@/lib/sb_types";
//type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
//type Repo = Database["public"]["Tables"]["repo"]["Row"];

import { ASSETS, SUITES } from "@/lib/purr_utils";

type RepoReconFormInputs = z.infer<typeof RepoReconFormSchema>;
type AssetJobFormInputs = z.infer<typeof AssetJobFormSchema>;

export interface ServerActionCRUD {
  data?: string | null;
  error?: string | null;
}

///////////////////////////////////////////////////////////////////////////////

export async function enqueueRepoReconTask(
  formData: RepoReconFormInputs
): Promise<ServerActionCRUD> {
  const cookieStore = cookies();
  const zodRes = RepoReconFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    const supabase = createClient(cookieStore);

    const supRes = await supabase.from("task").insert({
      worker: await pickWorker(),
      directive: "recon",
      body: zodRes.data,
      status: "PENDING",
    });

    if (supRes.status !== 201) {
      return { data: null, error: JSON.stringify(supRes, null, 2) };
    } else {
      return {
        data: `enqueued RepoRecon task: ${zodRes.data.recon_root}`,
        error: null,
      };
    }
  }
}

export async function enqueueAssetJobTask(
  formData: AssetJobFormInputs
): Promise<ServerActionCRUD> {
  const cookieStore = cookies();
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    const supabase = createClient(cookieStore);

    const supRes = await supabase.from("task").insert({
      worker: await pickWorker(),
      directive: "batcher",
      status: "PENDING",
      body: zodRes.data,
    });

    if (supRes.status !== 201) {
      return { data: null, error: JSON.stringify(supRes, null, 2) };
    } else {
      return {
        data: `enqueued: ${zodRes.data.asset} | ${zodRes.data.repo_name}`,
        error: null,
      };
    }
  }
}

export async function enqueueAssetStats(): Promise<any> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const supRes = await supabase.from("task").insert({
    worker: await pickWorker(),
    directive: "stats",
    status: "PENDING",
    //body: { functionName: "assetInventory" },
    body: {},
  });
  console.log("----supRes-------------------");
  console.log(supRes);
  console.log("-----------------------");

  if (supRes.status !== 201) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return {
      data: supRes,
      error: null,
    };
  }
}

export async function deleteRepo(id: string): Promise<ServerActionCRUD> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const supRes = await supabase.from("repo").delete().eq("id", id);
  if (supRes.status !== 204) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return { data: `deleted Repo: ${id}`, error: null };
  }
}

export async function deleteAssetJob(id: number): Promise<ServerActionCRUD> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const supRes = await supabase.from("asset_job").delete().eq("id", id);
  if (supRes.status !== 204) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return { data: `deleted AssetJob: ${id}`, error: null };
  }
}

export async function createAssetJob(
  formData: AssetJobFormInputs
): Promise<ServerActionCRUD> {
  const cookieStore = cookies();
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    delete zodRes.data.id;
    const supabase = createClient(cookieStore);

    const supRes = await supabase.from("asset_job").insert(zodRes.data);

    if (supRes.status !== 201) {
      return { data: null, error: JSON.stringify(supRes, null, 2) };
    } else {
      return {
        data: `created AssetJob: ${zodRes.data.repo_fs_path}`,
        error: null,
      };
    }
  }
}

export async function updateAssetJob(
  formData: AssetJobFormInputs
): Promise<ServerActionCRUD> {
  const cookieStore = cookies();
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    console.log("UPDATE ASSET JOB CALLED", formData);
    const supabase = createClient(cookieStore);

    const ajId = zodRes.data.id;
    delete zodRes.data.id;

    const supRes = await supabase
      .from("asset_job")
      .update(zodRes.data)
      .eq("id", ajId);
    if (supRes.status !== 204) {
      return { data: null, error: JSON.stringify(supRes, null, 2) };
    } else {
      return {
        data: `updated AssetJob: ${zodRes.data.repo_fs_path}`,
        error: null,
      };
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
// These should be "expedient"

export const fetchWorkers = async (): Promise<string[]> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const supRes = await supabase.from("worker").select("hostname");

  if (supRes.status !== 200) {
    console.error(supRes);
    return [];
  } else {
    const workers: string[] = supRes.data!.map((x) => String(x.hostname));
    return workers;
  }
};

// TODO: make this random?
export const pickWorker = async (): Promise<string> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const supRes = await supabase
    .from("worker")
    .select("hostname")
    .limit(1)
    .single();

  if (supRes.status !== 200) {
    console.error(supRes);
    return "locahost";
  } else {
    return supRes.data!.hostname;
  }
};

export const fetchAssetStuff = async (
  suite: (typeof SUITES)[number],
  asset: (typeof ASSETS)[number]
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: dna, error: error } = await supabase.functions.invoke(suite, {
    body: { asset: asset, filter: "" },
  });
  return dna;
};

///
// const { data: dna, error: error } = await supabase.functions.invoke("petra", {
//   body: { asset: "well", filter: "" },
// });
