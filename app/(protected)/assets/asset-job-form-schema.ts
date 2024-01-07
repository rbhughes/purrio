import { z } from "zod";

export const AssetJobFormSchema = z.object({
  active: z.boolean({
    required_error: "active is required",
  }),
  asset: z.string({
    required_error: "select an asset",
  }),
  chunk: z.coerce.number({
    required_error: "enter a chunk value",
  }),
  filter: z.string().optional(),
  // cron: z.string().optional(),
  // //last_invoked: z.date().nullable(),
  // last_invoked: z.string().datetime({ offset: true }).nullable(),
  repo_fs_path: z.string().nullable(),
  repo_geo_type: z.string(),
  repo_id: z.string({
    required_error: "select a repo_id",
  }),
  repo_name: z.string().nullable(),
  // row_created: z.string().datetime({ offset: true }),
});
