import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/loader";
import { fetchUserId } from "@/lib/actions";
import Search from "./search";

export default async function Page() {
  const userId = await fetchUserId();

  return (
    <div>
      <Suspense fallback={<Loader target="AssetJobs" />}>
        <Search userId={userId} />
      </Suspense>
      <Toaster richColors />
    </div>
  );
}
