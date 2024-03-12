import { z } from "zod";

export const SearchFormSchema = z.object({
  assets: z.string().array().min(1, { message: "Pick at least one asset" }),
  suites: z.string().array().min(1, { message: "Pick at least one suite" }),
  tag: z.string().optional(),
  term: z.string(),
});
