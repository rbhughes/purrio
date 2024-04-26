import { z } from "zod";

// TODO: 2024-01-28 | revisit the any() types. janky nonsense behavior
// conflict with supabase-assigned type inference?
// Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.

export const AssetJobFormSchema = z.object({
  id: z.coerce.number().optional(),
  asset: z.string({
    required_error: "select an asset",
  }),
  tag: z.any().nullable(),
  chunk: z.coerce
    .number({
      required_error: "must be a non-zero integer",
    })
    .int()
    .min(1),
  cron: z.any().nullable(),
  where_clause: z.any().nullable(),
  repo_fs_path: z.string().nullable(),
  suite: z.string(),
  recency: z.coerce
    .number({
      required_error: "days ago or zero for no limit",
    })
    .int()
    .min(0),
  repo_id: z.string().min(1, { message: "Select a source repo" }),
  repo_name: z.string().nullable(),
});

// //last_invoked: z.date().nullable(),
// last_invoked: z.string().datetime({ offset: true }).nullable(),
// active: z.boolean({
//   required_error: "active is required",
// }),
