import { z } from "zod";

export const AssetJobFormSchema = z.object({
  id: z.coerce.number().optional(),
  active: z.boolean({
    required_error: "active is required",
  }),
  asset: z.string({
    required_error: "select an asset",
  }),
  recency: z.coerce.number({
    required_error: "days ago or zero for no limit",
  }),
  /////////
  // chunk: z.coerce
  //   .number({
  //     required_error: "enter a chunk value",
  //   })
  //   .nullable(),
  // cron: z.string().nullable(),

  // TODO: 2024-01-28 | revisit the any() types. janky nonsense behavior
  // conflict with supabase-assigned type inference?
  // Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.

  // filter: z.string().nullable(),
  tag: z.any().nullable(),
  chunk: z.any().nullable(),
  cron: z.any().nullable(),
  filter: z.any().nullable(),

  /////////
  repo_fs_path: z.string().nullable(),
  geo_type: z.string(),
  repo_id: z.string().min(1, { message: "Select a source repo" }),
  repo_name: z.string().nullable(),
});

// //last_invoked: z.date().nullable(),
// last_invoked: z.string().datetime({ offset: true }).nullable(),
