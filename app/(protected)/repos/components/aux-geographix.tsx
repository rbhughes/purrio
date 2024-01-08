import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function AuxGeographix({ form }: { form: any }) {
  return (
    <div className="flex flex-row">
      <div className="w-1/6">
        <FormField
          control={form.control}
          name="ggx_host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GGX Host</FormLabel>
              <FormControl>
                <Input placeholder="ggx_host" {...field} />
              </FormControl>
              <FormDescription>SQLAnywhere Hostname</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
