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

export function AuxKingdom({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name="kingdom_server"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kingdom server</FormLabel>
            <FormControl>
              <Input placeholder="hostname or ip" {...field} />
            </FormControl>
            <FormDescription>This is kingdom_server</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ---------- */}

      <FormField
        control={form.control}
        name="kingdom_username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kingdom username</FormLabel>
            <FormControl>
              <Input placeholder="kingdom username" {...field} />
            </FormControl>
            <FormDescription>This is kingdom username</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ---------- */}

      <FormField
        control={form.control}
        name="kingdom_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kingdom password</FormLabel>
            <FormControl>
              <Input placeholder="hostname or ip" {...field} />
            </FormControl>
            <FormDescription>This is kingdom_password</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
