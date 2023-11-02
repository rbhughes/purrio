"use server";

import { z } from "zod";
import { RepoReconFormSchema } from "./repo-recon-schema";

import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

type Inputs = z.infer<typeof RepoReconFormSchema>;

export async function addEntry(data: Inputs) {
  console.log("____top of addEntry_____(written to SERVER)_______");
  console.log(data);
  console.log("__________________________________________________");

  const result = RepoReconFormSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function fetchHostnames(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase.from("workers").select("hostname");
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
