import { z } from "zod";

export const RepoReconFormSchema = z.object({
  recon_root: z
    .string({
      required_error: "enter a recon root",
    })
    .min(4, { message: "must be over 4 chars" }),
  geo_type: z.string({
    required_error: "select a geo_type",
  }),
  worker: z.string({
    required_error: "select a hostname",
  }),
  ggx_host: z.union([z.string().min(4), z.string().length(0)]),
});
