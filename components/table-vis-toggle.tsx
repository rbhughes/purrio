"use client";
import React from "react";

import { Switch } from "@/components/ui/switch";
import { Table } from "lucide-react";
import { AreaChart } from "lucide-react";

interface TableVisToggleProps {
  onToggle?: (checked: boolean) => void;
}

const TableVisToggle: React.FC<TableVisToggleProps> = ({ onToggle }) => {
  const [toggle, setToggle] = React.useState(true);

  const handleToggle = () => {
    setToggle(!toggle);
    if (onToggle) {
      onToggle(toggle);
    }
  };

  return (
    <div className="flex bg-white items-center space-x-2 rounded-lg border shadow my-4 p-2 w-fit">
      <Table />
      <Switch id="toggle" onClick={handleToggle}></Switch>
      <AreaChart />
    </div>
  );
};

export default TableVisToggle;
