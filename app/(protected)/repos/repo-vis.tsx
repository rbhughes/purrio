"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Map as MapIcon, Globe } from "lucide-react";

import { Map, Marker } from "pigeon-maps";
import { GeoTypeUI } from "@/lib/purr_ui";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

function VisEPSG({ repo }: { repo: Repo }) {
  return (
    <div className="flex flex-row justify-between mx-4 mb-2">
      <Badge variant="outline" className="rounded-lg justify-between gap-2">
        storage
        <Globe />
        <span className="text-lg">{repo.storage_epsg}</span>
        <span className="text-muted-foreground italic text-xs">
          ({repo.storage_name})
        </span>
      </Badge>
      <Badge variant="outline" className="rounded-lg justify-between gap-2">
        display
        <MapIcon />
        <span className="text-lg">{repo.display_epsg}</span>
        <span className="text-muted-foreground italic text-xs">
          <pre>({repo.display_name})</pre>
        </span>
      </Badge>
    </div>
  );
}

function VisConn({ repo }: { repo: Repo }) {
  return (
    <Card>
      <pre className="text-muted-foreground text-xs">
        {JSON.stringify(repo.conn, null, 2)}
      </pre>
    </Card>
  );
}

function VisCounts({ repo }: { repo: Repo }) {
  const filteredKeys = Object.keys(repo).filter(
    (key) => key.startsWith("wells_with_") || key.startsWith("well_count")
  );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">asset</TableHead>
          <TableHead className="text-center">count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredKeys.map((key) => {
          const colName = key.replace("wells_with_", "");
          return (
            <TableRow key={key}>
              <TableCell className="text-right">{colName}</TableCell>
              <TableCell className="text-center">
                {(repo as any)[key]}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function VisMap() {
  return (
    <Map defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
      <Marker width={50} anchor={[50.879, 4.6997]} />
    </Map>
  );
}

function VisCard({ repo }: { repo: Repo }) {
  return (
    <Card>
      <CardTitle>
        <div className="flex p-2 justify-between">
          <div className="flex">
            <span className="mt-2  mr-2">
              {GeoTypeUI[repo.geo_type as string].icon}
            </span>
            <span className="text-xl mt-1">{repo.name}</span>
          </div>
          <pre className="p-2 mt-1 mr-1">{repo.fs_path}</pre>
        </div>
      </CardTitle>

      <VisEPSG repo={repo} />
      <VisConn repo={repo} />

      <CardContent className="flex flex-row justify-between">
        <div className="border border-1 rounded-lg w-3/12 m-2">
          <VisCounts repo={repo} />
        </div>
        <div className="border border-1 rounded-lg w-9/12 m-2">
          <VisMap />
        </div>
      </CardContent>
    </Card>
  );
}

export default function RepoVis({ repos }: { repos: Repo[] }) {
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime repo")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repo",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <div className="flex flex-col gap-4">
      {repos.map((repo) => {
        //return <>{repo.name}</>;
        return <VisCard key={repo.id} repo={repo} />;
      })}
    </div>
  );
  // {
  //   repos.map((repo) => <h1>{repo.fs_path}</h1>);
  // }
  // )

  // return (
  //   <Card>
  //     <CardContent>
  //       <div className="bg-amber-100 ">
  //         <pre>{JSON.stringify(repos, null, 2)}</pre>
  //       </div>
  //     </CardContent>
  //   </Card>
  // );
}
