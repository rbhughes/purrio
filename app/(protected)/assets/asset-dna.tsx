"use client";

import { useAssetStore } from "@/store/use-asset-store";
import React from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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

  // TODO: sort this out if colored Switch should be a thing
  // [data-state="open"] {
  //   opacity: 0.1;
  // }
  return (
    <>
      <span className="flex items-center space-x-2 float-right">
        <Label htmlFor="sqlToggle">Show SQL </Label>
        <Switch
          id="sqlToggle"
          onClick={handleToggle}
          checked={isOpen}
          //style={{ backgroundColor: "#facc15" }}
        />
      </span>

      <Sheet modal={false} open={isOpen}>
        <SheetContent
          className="sm:max-w-fit overflow-auto text-xs bg-slate-100"
          side="left"
        >
          <SheetHeader>
            <SheetTitle className="flex justify-between">
              {suite}: {asset}
              <Button size="sm" variant="destructive" onClick={handleToggle}>
                <X />
              </Button>
            </SheetTitle>
            <SheetDescription className="text-center">
              some stuff
            </SheetDescription>
            {suite === "geographix" && geographixAssets[asset] && (
              <pre>{geographixAssets[asset].select}</pre>
            )}
            {suite === "petra" && petraAssets[asset] && (
              <pre>{petraAssets[asset].select}</pre>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
