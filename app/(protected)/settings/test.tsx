"use client";

import { Button } from "@/components/ui/button";

import { enqueueAssetStats } from "@/lib/actions";

//import React from "react";

export default function Thing() {
  const processClick: any = async () => {
    const { data, error } = await enqueueAssetStats();

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  };

  return (
    <>
      <Button onClick={processClick}>enqueue</Button>
    </>
  );
}
