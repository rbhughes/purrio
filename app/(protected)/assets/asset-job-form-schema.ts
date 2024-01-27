import { z } from "zod";

// TODO: if this doesn't match the RHF validation, it swallows the error

export const AssetJobFormSchema = z.object({
  id: z.coerce.number().optional(),
  active: z.boolean({
    required_error: "active is required",
  }),
  asset: z.string({
    required_error: "select an asset",
  }),
  chunk: z.coerce.number({
    required_error: "enter a chunk value",
  }),
  cron: z.string().optional(),
  filter: z.string().optional(),
  repo_fs_path: z.string().nullable(),
  geo_type: z.string(),
  repo_id: z.string().min(1, { message: "Select a source repo" }),
  repo_name: z.string().nullable(),
});

// //last_invoked: z.date().nullable(),
// last_invoked: z.string().datetime({ offset: true }).nullable(),
