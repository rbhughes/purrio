import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

//import { UseFormReturn } from "react-hook-form";

export function AuxGeographix({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="ggx_host"
      render={({ field }) => (
        <FormItem>
          <FormLabel>GGX Host</FormLabel>
          <FormControl>
            <Input placeholder="ggx_host" {...field} />
          </FormControl>
          <FormDescription>This is a ggx host</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
