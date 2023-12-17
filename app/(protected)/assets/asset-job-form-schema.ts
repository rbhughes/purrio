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
  cron: z.string().optional(),
  filter: z.string().optional(),
  last_invoked: z.date().nullable(),
  repo_id: z.string({
    required_error: "select a repo_id",
  }),
  repo_fs_path: z.string().nullable(),
  repo_name: z.string().nullable(),
});
