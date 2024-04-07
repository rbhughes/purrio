import SlowThing from "./test";
import { Suspense } from "react";
import { Loader } from "@/components/loader";

export default async function Settings() {
  return (
    <Suspense fallback={<Loader target="Settings" />}>
      <SlowThing />
    </Suspense>
  );
}
