"use client";
import React from "react";

import { Switch } from "@/components/ui/switch";
import { Table } from "lucide-react";
import { AreaChart } from "lucide-react";

interface TableVisToggleProps {
  onToggle?: (checked: boolean) => void;
}

const TableVisSwitch: React.FC<TableVisToggleProps> = ({ onToggle }) => {
  const [toggle, setToggle] = React.useState(false); // <-- look

  const handleToggle = () => {
    setToggle(!toggle);
    if (onToggle) {
      onToggle(toggle);
    }
  };

  return (
    //<div className="flex bg-white items-center space-x-2 rounded-lg border shadow my-4 p-2 w-fit">
    <div className="flex justify-evenly items-center rounded-md bg-slate-500 w-28  p-2 ">
      <Table className="text-slate-200" size={20} />
      <Switch id="toggle" onClick={handleToggle}></Switch>
      <AreaChart className="text-slate-200" size={20} />
    </div>
  );
};

export default TableVisSwitch;
