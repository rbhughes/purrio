//"use client";

//import { Button } from "@/components/ui/button";

//import { enqueueAssetStats } from "@/lib/actions";

//import React from "react";

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
};

export default async function SlowThing() {
  await sleep(2000);

  return (
    <>
      SLOWLY LOADING COMPONENT
      <div className="flex items-center h-fit w-fit bg-blue-100">
        <span className="text-2xl text-orange-500  font-black">&#x26C1;</span>
        <span className="pl-1">GeoGraphix</span>
      </div>
    </>
  );

  // const processClick: any = async () => {
  //   const { data, error } = await enqueueAssetStats();

  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log(data);
  //   }
  // };

  // return (
  //   <>
  //     <Button onClick={processClick}>enqueue</Button>
  //   </>
  // );
}
