"use client";

import { useAssetStore } from "@/store/use-asset-store";
import { Resizable } from "re-resizable";
import React from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// NOTE: The shadcn Sheet code will have an "x" button that is not functional
// using Switch like below. Comment out lines in: @/components/ui/sheet.tsx

//  <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"> */
//    <Cross2Icon className="h-4 w-4" /> */
//    <span className="sr-only">Close</span> */
//  </SheetPrimitive.Close> */

interface DNAProps {
  suite: string;
  asset: string;
}

export default function AssetDNA(props: DNAProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const geographixAssets = useAssetStore((state) => state.geographixAssets);
  const petraAssets = useAssetStore((state) => state.petraAssets);
  let { suite, asset } = props;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <span className="flex items-center space-x-2 float-right">
        <Label htmlFor="sqlToggle">Show SQL </Label>
        <Switch id="sqlToggle" onClick={handleToggle} checked={isOpen} />
      </span>

      <Sheet modal={false} open={isOpen}>
        <SheetContent
          className="sm:max-w-fit overflow-auto text-xs bg-slate-100"
          side="left"
        >
          <SheetHeader>
            <SheetTitle className="text-center">
              {suite}: {asset}
            </SheetTitle>
            <SheetDescription className="text-center">
              some stuff
            </SheetDescription>

            {suite === "geographix" && (
              <pre>{geographixAssets[asset].select}</pre>
            )}

            {suite === "petra" && <pre>{petraAssets[asset].select}</pre>}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

/*
export default function AssetDNA(props: DNAProps) {
  const geographixAssets = useAssetStore((state) => state.geographixAssets);
  const petraAssets = useAssetStore((state) => state.petraAssets);
  let { suite, asset } = props;

  console.log(geographixAssets);
  return (
    <Resizable
      className="bg-slate-100 overflow-hidden"
      defaultSize={{
        width: 320,
        height: 200,
      }}
    >
      {suite}
      {asset}
      <div>
        {geographixAssets[asset] && <pre>{geographixAssets[asset].select}</pre>}
      </div>
    </Resizable>
  );
}
*/
