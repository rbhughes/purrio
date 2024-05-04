"use client";

import * as React from "react";
import { useRepoTableStore } from "@/store/use-repo-table-store";

const Hydration = () => {
  React.useEffect(() => {
    let x = useRepoTableStore.persist.rehydrate();
  }, []);

  return null;
};

export default Hydration;
