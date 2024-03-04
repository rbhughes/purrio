import { z, ZodUnion } from "zod";

const dbisamSchema = z.object({
  driver: z.string(),
  catalogname: z.string(),
});

const sqlanySchema = z.object({
  dbf: z.string(),
  dbn: z.string(),
  pwd: z.string(),
  uid: z.string(),
  host: z.string(),
  astart: z.string(),
  driver: z.string(),
  server: z.string(),
});

const connSchema = z.union([dbisamSchema, sqlanySchema]);

export const RepoSchema = z.object({
  id: z.string(),
  conn: connSchema,
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
  created_at: z.string().datetime({ offset: true }),
  touched_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type Repo = z.infer<typeof RepoSchema>;
