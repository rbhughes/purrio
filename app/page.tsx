import { checkUser } from "@/utils/supabase/server";
import { Logo } from "@/components/logo";
import { redirect } from "next/navigation";

export default async function Index() {
  const user = await checkUser();

  return user ? (
    redirect("/search")
  ) : (
    <>
      <Logo variant="xlHorizontal" />
      <>NO USER (put public page here)</>
    </>
  );
}
