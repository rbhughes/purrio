"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export const Loader = ({ target }: { target: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Please wait...</CardTitle>
        <CardDescription>
          Loading resources for: <b>{target}</b>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Spinner size="large" className="text-orange-500" />
      </CardContent>
    </Card>
  );
};
