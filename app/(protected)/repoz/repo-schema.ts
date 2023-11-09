import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const repoSchema = z.object({
  id: z.string(),
  geo_type: z.string(),
  name: z.string(),
  fs_path: z.string(),
  repo_mod: z.string(),
  human_size: z.string(),
});

export type Repo = z.infer<typeof repoSchema>;
