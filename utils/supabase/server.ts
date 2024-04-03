import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// just a convenience function
export const checkUser = async (): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return false;
  }
  return true;
};

// Using supabase.auth.getSession() is potentially insecure as it loads data
// directly from the storage medium (typically cookies) which may not be
// authentic. Prefer using supabase.auth.getUser() instead. To suppress this
// warning call supabase.auth.getUser() before you call supabase.auth.getSession().

// export const sessionExists = async () => {
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   return session ? true : false;
// };
