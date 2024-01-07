"use client";
import React from "react";

import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";

export const Toggler = ({
  componentA,
  componentB,
}: {
  componentA: any;
  componentB: any;
}) => {
  const [showComponentA, setShowComponentA] = React.useState(true);

  const handleToggle = () => {
    setShowComponentA(!showComponentA);
    //console.log(`showTable is now ${!showTable}`);
  };

  const activeComponent = showComponentA ? componentA : componentB;

  return (
    <>
      <div className="my-10">
        <Toggle size="lg" aria-label="toggle me" onClick={handleToggle}>
          TOGGLE ME
        </Toggle>
      </div>
      {/* <Label htmlFor="airplane-mode">Airplane Mode</Label> */}

      {showComponentA ? componentA : componentB}
    </>
  );
};
