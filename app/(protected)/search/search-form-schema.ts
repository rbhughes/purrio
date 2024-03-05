import { z } from "zod";

export const SearchFormSchema = z.object({
  term: z.string(),
  asset: z.string({
    required_error: "select an asset",
  }),
  tag: z.string().optional(),
  suites: z.string().array(),
});
