import { Suspense } from "react";
import { fetchWorkers } from "@/lib/actions";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/loader";
import Repos from "./repos";

export default async function Page() {
  const workers = await fetchWorkers();

  return (
    <div>
      <Suspense fallback={<Loader target="Repos" />}>
        <Repos workers={workers} />
      </Suspense>
      <Toaster richColors />
    </div>
  );
}
