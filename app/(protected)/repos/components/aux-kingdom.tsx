import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function AuxKingdom({ form }: { form: any }) {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-2/6">
        <FormField
          control={form.control}
          name="kingdom_server"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database server</FormLabel>
              <FormControl>
                <Input placeholder="hostname or IP" {...field} />
              </FormControl>
              <FormDescription>Hostname or IP of SQL Server</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ---------- */}

      <div className="w-1/6">
        <FormField
          control={form.control}
          name="kingdom_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>DB username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ---------- */}

      <div className="w-1/6">
        <FormField
          control={form.control}
          name="kingdom_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kingdom password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type="password" />
              </FormControl>
              <FormDescription>DB password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
