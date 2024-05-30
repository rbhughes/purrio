"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

import { RepoReconFormSchema } from "@/app/(protected)/repos/repo-recon-form-schema";
import { AssetJobFormSchema } from "@/app/(protected)/assets/asset-job-form-schema";
import { SearchFormSchema } from "@/app/(protected)/search/search-form-schema";
import { ExportTask } from "@/app/(protected)/search/search-export";

import { z } from "zod";
type RepoReconFormInputs = z.infer<typeof RepoReconFormSchema>;
type AssetJobFormInputs = z.infer<typeof AssetJobFormSchema>;
type SearchFormInputs = z.infer<typeof SearchFormSchema>;

import { Database } from "@/lib/sb_types";
type Worker = Database["public"]["Tables"]["worker"]["Row"];

export interface ActionWithSummary {
  data?: string | null;
  error?: string | null;
}

export interface ActionWithData {
  data?: any;
  error?: string | null;
}

///////////////////////////////////////////////////////////////////////////////

export async function enqueueRepoReconTask(
  formData: RepoReconFormInputs
): Promise<ActionWithSummary> {
  const zodRes = RepoReconFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    const supabase = createClient();

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
): Promise<ActionWithSummary> {
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    const supabase = createClient();

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

export async function enqueueExportTask(task: ExportTask) {
  const supabase = createClient();
  const supRes = await supabase
    .from("task")
    .insert({
      worker: await pickWorker(),
      directive: "export",
      status: "PENDING",
      body: task,
    })
    .select();

  if (supRes.status !== 201) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return {
      data: supRes.data,
      error: null,
    };
  }
}

export async function enqueueSearchTask(
  formData: SearchFormInputs
): Promise<ActionWithData> {
  const zodRes = SearchFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    const supabase = createClient();

    // replace the asset MultipleSelector Option[] with just strings
    let newBody = {
      assets: zodRes.data.assets.map((o) => o.value),
      suites: zodRes.data.suites,
      tag: zodRes.data.tag,
      terms: zodRes.data.terms,
      user_id: zodRes.data.user_id,
    };

    const supRes = await supabase
      .from("task")
      .insert({
        worker: await pickWorker(),
        directive: "search",
        status: "PENDING",
        body: newBody,
      })
      .select();

    if (supRes.status !== 201) {
      return { data: null, error: JSON.stringify(supRes, null, 2) };
    } else {
      return {
        data: supRes.data,
        error: null,
      };
    }
  }
}

// export async function updateProfileSearchHistory(userId: string) {
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);

//   const supRes = await supabase.rpc("update_profile_search_history", {
//     user_id: userId,
//   });
//   console.log("**updateProfileSearchHistory***************************");
//   console.log(supRes);
//   console.log("*****************************");
// }

// //TODO: finish this. take trigger out of useEffect
// export async function updateProfileWithSearchIds(
//   userId: string
//   //): Promise<ActionWithSummary> {
// ) {
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);

//   const supRes = await supabase.rpc("update_profile_search_id_list", {
//     user_id: userId,
//   });
//   console.log("*****************************");
//   console.log(supRes);
//   console.log("*****************************");
// }

export async function enqueueAssetStats(): Promise<any> {
  const supabase = createClient();

  const supRes = await supabase.from("task").insert({
    worker: await pickWorker(),
    directive: "stats",
    status: "PENDING",
    //body: { functionName: "assetInventory" },
    body: {},
  });

  if (supRes.status !== 201) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return {
      data: supRes,
      error: null,
    };
  }
}

export async function deleteRepo(id: string): Promise<ActionWithData> {
  const supabase = createClient();
  const supRes = await supabase.from("repo").delete().eq("id", id);
  if (supRes.status !== 204) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return { data: `deleted Repo: ${id}`, error: null };
  }
}

export async function deleteAssetJob(id: number): Promise<ActionWithData> {
  const supabase = createClient();
  const supRes = await supabase.from("asset_job").delete().eq("id", id);
  if (supRes.status !== 204) {
    return { data: null, error: JSON.stringify(supRes, null, 2) };
  } else {
    return { data: `deleted AssetJob: ${id}`, error: null };
  }
}

export async function createAssetJob(
  formData: AssetJobFormInputs
): Promise<ActionWithData> {
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    delete zodRes.data.id;
    const supabase = createClient();

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
): Promise<ActionWithData> {
  const zodRes = AssetJobFormSchema.safeParse(formData);
  if (!zodRes.success) {
    return { data: null, error: JSON.stringify(zodRes.error) };
  } else {
    console.log("UPDATE ASSET JOB CALLED", formData);
    const supabase = createClient();

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

export const fetchUserId = async (): Promise<string> => {
  // assumes a user is signed in, should fail otherwise
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user!.id;
};

// TODO: make this random?
export const pickWorker = async (): Promise<string> => {
  const supabase = createClient();

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

export const fetchWorkers = async (): Promise<Worker[]> => {
  const supabase = createClient();
  const supRes = await supabase.from("worker").select("*");

  if (supRes.status !== 200) {
    console.error(supRes);
    return [] as Worker[];
  } else {
    return supRes.data as Worker[];
  }
};

// export const fetchAssetDNA = async (
//   suite: (typeof SUITES)[number],
//   asset: (typeof ASSETS)[number]
// ) => {
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);
//   const { data: dna, error: error } = await supabase.functions.invoke(suite, {
//     body: { asset: asset, filter: "" },
//   });
//   return dna;
// };

///
// const { data: dna, error: error } = await supabase.functions.invoke("petra", {
//   body: { asset: "well", filter: "" },
// });

export async function signin(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/search");
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return redirect("/");
}
