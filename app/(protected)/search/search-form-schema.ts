import { z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const SearchFormSchema = z.object({
  assets: z.array(optionSchema).min(1, { message: "pick at least one asset" }),
  suites: z.string().array().min(1, { message: "Pick at least one suite" }),
  tag: z.string().optional(),
  terms: z.string(),
  user_id: z.string(),
});
