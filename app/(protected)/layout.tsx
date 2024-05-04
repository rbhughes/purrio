import "../globals.css";

import { redirect } from "next/navigation";
import { checkUser } from "@/utils/supabase/server";

import ZustandInit from "@/store/zustand-init";
// import Hydration from "@/store/hydration";
//import HydrateStore from "@/store/use-repo-table-store";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = await checkUser();
  if (!user) {
    redirect("/");
  }
  console.log("protected layout ---->");
  return (
    <>
      {/* <HydrateStore /> */}
      <ZustandInit />
      {/* <Hydration /> */}
      {children}
    </>
  );
}
