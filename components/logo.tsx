import React, { FC } from "react";
import { cn } from "@/lib/utils";

export const Logo: FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={cn("text-2xl font-extrabold", className)}>purr.io</span>
  );
};
