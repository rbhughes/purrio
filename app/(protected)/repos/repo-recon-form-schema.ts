import { z } from "zod";

// TODO: if this doesn't match the RHF validation, it swallows the error

export const RepoReconFormSchema = z.object({
  recon_root: z
    .string({
      required_error: "enter a recon root",
    })
    .min(4, { message: "must be over 4 chars" }),
  suite: z.string({
    required_error: "select a suite",
  }),
  worker: z.string({
    required_error: "select a hostname",
  }),
  ggx_host: z.union([z.string().min(4), z.string().length(0)]).optional(),
  kingdom_server: z.union([z.string().min(4), z.string().length(0)]).optional(),
  kingdom_username: z
    .union([z.string().min(1), z.string().length(0)])
    .optional(),
  kingdom_password: z
    .union([z.string().min(1), z.string().length(0)])
    .optional(),
});
