import { z } from "zod";

export const AssetJobFormSchema = z.object({
  active: z.boolean({
    required_error: "active is required",
  }),
  repo_id: z.string({
    required_error: "select a repo_id",
  }),
  asset: z.string({
    required_error: "select an asset",
  }),
  chunk: z.number({
    required_error: "enter a chunk value",
  }),
  filter: z.string().optional(),
  cron: z.string().optional(),
});
