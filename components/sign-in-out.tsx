import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
//import { cookies } from "next/headers";
//import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { login, signout } from "@/lib/actions";

export default async function SignInOut() {
  //const cookieStore = cookies();
  //const supabase = createClient(cookieStore);
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const signOut = async () => {
  //   "use server";

  //   const cookieStore = cookies();
  //   const supabase = createClient(cookieStore);
  //   await supabase.auth.signOut();
  //   //return redirect("/login");
  //   return redirect("/");
  // };

  //<Button className="flex rounded w-full  px-4 py-2.5 transition duration-200 hover:bg-cyan-900"></Button>
  return user ? (
    <form action={signout}>
      <Button className="purr-navbar-button rounded-full">logout</Button>
    </form>
  ) : (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      {/* <button formAction={signup}>Sign up</button> */}
      {/* <button formAction={signout}>Sign Out</button> */}
    </form>
    // <Button className="purr-navbar-button">
    //   <Link href="/login">Login</Link>
    // </Button>
  );
}
