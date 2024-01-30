"use client";
import React from "react";

import { Switch } from "@/components/ui/switch";

import { Table } from "lucide-react";
import { AreaChart } from "lucide-react";

///
import { usePathname } from "next/navigation";
///

export default function TableVisSwitch({
  compA,
  compB,
}: {
  compA: any;
  compB: any;
}) {
  const pathname = usePathname();

  const [showCompA, setShowCompA] = React.useState(true);

  const handleToggle = () => {
    setShowCompA(!showCompA);
  };

  //const activeComponent = showCompA ? compA : compB;

  return (
    <>
      <div className=" flex items-center space-x-4 rounded-lg border shadow my-4 p-4 w-fit">
        <Table />
        <Switch id="toggle" onClick={handleToggle}></Switch>
        <AreaChart />
        {pathname}
      </div>

      {showCompA ? compA : compB}
    </>
  );
}
