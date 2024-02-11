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
import { humanFileSize, polygonCentroid, polygonZoom } from "@/lib/purr_utils";

import { Map, Marker, GeoJson, ZoomControl } from "pigeon-maps";
import { GeoTypeUI } from "@/lib/purr_ui";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

////////////////////////////////////////////////////////////

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

function VisWellCounts({ repo }: { repo: Repo }) {
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

function VisFSCounts({ repo }: { repo: Repo }) {
  return (
    <Table>
      {/* <TableHeader>
        <TableRow>
          <TableHead className="text-center">asset</TableHead>
          <TableHead className="text-center">count</TableHead>
        </TableRow>
      </TableHeader> */}
      <TableBody>
        <TableRow>
          <TableCell className="text-right">files</TableCell>
          <TableCell className="text-center">{repo.files}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">directories</TableCell>
          <TableCell className="text-center">{repo.directories}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">size</TableCell>
          <TableCell className="text-center">
            {humanFileSize(repo.bytes!)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">last mod</TableCell>
          <TableCell className="text-center">{repo.repo_mod}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">last touched</TableCell>
          <TableCell className="text-center">{repo.row_touched}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

////////////////////////////////

// 2024-02-09 | pigeon maps (and similar) relies on being able to calculate
// div width/height to render the svg. Since RepoVis is hidden by default, the
// calculation barfs and throws some viewbox errors. As a workaround, useRef
// can tell us the parent div width/height; use them to calculate zoom level.
function VisMap({ repo }: { repo: Repo }) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [zoom, setZoom] = React.useState(0);

  React.useEffect(() => {
    if (mapContainerRef.current) {
      setHeight(mapContainerRef.current.clientHeight);
      setWidth(mapContainerRef.current.clientWidth);
    }
  }, [mapContainerRef]);

  React.useEffect(() => {
    if (width + height > 0) {
      setZoom(polygonZoom(repo.outline as number[][], width, height, 10));
    }
  }, [width, height]);

  const repoConvexHull = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: repo.outline,
        },
        properties: { name: repo.name },
      },
    ],
  };
  const centroid = polygonCentroid(repo.outline as number[][]);

  return (
    <div ref={mapContainerRef} className="flex h-full w-full">
      {zoom > 0 && width > 0 && height > 0 && (
        <Map
          width={width}
          height={height}
          defaultCenter={centroid}
          defaultZoom={zoom}
        >
          <GeoJson
            data={repoConvexHull}
            styleCallback={(feature: any, hover: boolean) => {
              if (feature.geometry.type === "LineString") {
                return { strokeWidth: "2", stroke: "red", fill: "#d4e777" };
              }
              return {
                fill: "#d4e6ec99",
                strokeWidth: "1",
                stroke: "white",
                r: "20",
              };
            }}
          />
          <ZoomControl />
        </Map>
      )}
    </div>
  );
}

////////////////////////////////

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
      <VisFSCounts repo={repo} />

      <CardContent className="flex flex-row justify-between">
        <div className="border border-1 rounded-lg w-3/12 m-2">
          <VisWellCounts repo={repo} />
        </div>
        <div className="border border-1 rounded-lg w-9/12 m-2 inline-block">
          <VisMap repo={repo} />
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
        return <VisCard key={repo.id} repo={repo} />;
      })}
    </div>
  );
}
