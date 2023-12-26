"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Database } from "@/lib/sb_types";

type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
import { deleteAssetJob, addAssetJobTask } from "@/lib/actions";

export default function AssetJobCard({ assetJob }: { assetJob: AssetJob }) {
  //return <pre>{JSON.stringify(assetJob, null, 2)}</pre>;

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{assetJob.repo_name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{assetJob.repo_fs_path}</p>
        <p>{assetJob.repo_id}</p>
        <p>{assetJob.asset}</p>
        <p>{assetJob.chunk}</p>
        <p>{assetJob.cron}</p>
        <p>{assetJob.filter}</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
        <Button onClick={() => deleteAssetJob(assetJob.id)}>delete</Button>
        <Button onClick={async () => await addAssetJobTask(assetJob)}>
          enqueue
        </Button>
      </CardFooter>
    </Card>
  );
}
