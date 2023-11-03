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
  hostname: z.string({
    required_error: "select a hostname",
  }),
  tag: z.string(),
  ggx_host: z.string().min(4).optional(),
});
