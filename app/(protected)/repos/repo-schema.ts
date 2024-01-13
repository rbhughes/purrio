import { z } from "zod";

export const RepoSchema = z.object({
  id: z.string(),
  //conn: z.object({dbf: z.string()}),
  conn_aux: z.object({ ggx_host: z.string() }).nullable(),
  geo_type: z.string(),
  name: z.string(),
  fs_path: z.string(),
  repo_mod: z.string(),
  files: z.number(),
  directories: z.number(),
  bytes: z.number(),
  storage_epsg: z.number(),
  display_epsg: z.number(),
  storage_name: z.string(),
  display_name: z.string(),
  row_changed: z.string().datetime({ offset: true }),
  row_created: z.string().datetime({ offset: true }),
  row_touched: z.string().datetime({ offset: true }),
});

export type Repo = z.infer<typeof RepoSchema>;
