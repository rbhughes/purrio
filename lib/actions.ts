"use server";

import { z } from "zod";
//import { RepoReconFormSchema } from "./repo-recon-schema";
import { RepoReconFormSchema } from "@/app/(protected)/repos/repo-recon-schema";

import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

type Inputs = z.infer<typeof RepoReconFormSchema>;

export async function addRepoReconTask(formData: Inputs) {
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
    console.log("IT WAS NOT A SUCCESS");
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
