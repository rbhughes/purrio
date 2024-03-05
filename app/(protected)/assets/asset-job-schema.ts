import { z } from "zod";

export const AssetJobSchema = z.object({
  id: z.number(),
  active: z.boolean(),
  asset: z.string(),
  chunk: z.number(),
  cron: z.string().nullable(),
  filter: z.string().nullable(),
  last_invoked: z.string().datetime({ offset: true }).nullable(),
  repo_fs_path: z.string(),
  suite: z.string(),
  recency: z.number(),
  repo_id: z.string(),
  repo_name: z.string(),
  tag: z.string().nullable(),
  created_at: z.string().datetime({ offset: true }),
});

export type AssetJob = z.infer<typeof AssetJobSchema>;
