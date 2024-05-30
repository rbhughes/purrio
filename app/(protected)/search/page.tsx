import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/loader";
import { fetchUserId, fetchWorkers } from "@/lib/actions";
import Search from "./search";

export default async function Page() {
  const userId = await fetchUserId();
  const workers = await fetchWorkers();

  if (workers.length < 1) {
    redirect("/settings");
  }

  const workerSuites = workers.map((w) => w.suite);

  return (
    <div>
      <Suspense fallback={<Loader target="AssetJobs" />}>
        <Search userId={userId} workerSuites={workerSuites} />
      </Suspense>
      <Toaster richColors />
    </div>
  );
}
