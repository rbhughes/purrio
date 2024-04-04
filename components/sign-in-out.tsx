import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { signin, signout } from "@/lib/actions";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default async function SignInOut() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <form action={signout}>
      <Button className="purr-nav-button rounded-full" variant="ghost">
        sign out
      </Button>
    </form>
  ) : (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="purr-nav-button rounded-full data-[state=open]:opacity-[.1]"
          variant="ghost"
        >
          sign in
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form className="flex flex-col gap-4">
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <Button
            className="purr-nav-button rounded-full self-center"
            formAction={signin}
          >
            Sign In
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
