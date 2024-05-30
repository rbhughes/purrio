import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/loader";
import { fetchWorkers } from "@/lib/actions";
import Repos from "./repos";

export default async function Page() {
  const workers = await fetchWorkers();

  if (workers.length < 1) {
    redirect("/settings");
  }

  const workerHostnames = workers.map((w) => w.hostname);

  return (
    <div>
      <Suspense fallback={<Loader target="Repos" />}>
        <Repos workerHostnames={workerHostnames} />
      </Suspense>
      <Toaster richColors />
    </div>
  );
}
