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
import { Separator } from "@/components/ui/separator";

import {
  Map as MapIcon,
  Ban,
  FolderTree,
  Globe,
  CalendarSearch,
  CalendarDays,
} from "lucide-react";
import {
  humanFileSize,
  polygonCentroid,
  polygonZoom,
  parseDateTime,
} from "@/lib/purr_utils";

import { Map, Marker, GeoJson, ZoomControl } from "pigeon-maps";
import { GeoTypeUI } from "@/lib/purr_ui";

import { Database } from "@/lib/sb_types";
//import { parse } from "path";
import { useMeasure } from "@uidotdev/usehooks";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

////////////////////////////////////////////////////////////

// function VisEPSG({ repo }: { repo: Repo }) {
//   return (
//     <>
//       <Badge variant="outline" className="flex flex-col w-fit gap-1 p-2 w-2/12">
//         <div className="flex justify-center items-center gap-2">
//           <Globe />
//           storage
//           <span className="text-xl">{repo.storage_epsg}</span>
//         </div>
//         <span className="text-muted-foreground italic text-xs">
//           ({repo.storage_name})
//         </span>
//       </Badge>

//       <Badge variant="outline" className="flex flex-col w-fit gap-1 p-2 w-2/12">
//         <div className="flex justify-center items-center gap-2">
//           <MapIcon />
//           storage
//           <span className="text-xl">{repo.display_epsg}</span>
//         </div>
//         <span className="text-muted-foreground italic text-xs">
//           ({repo.display_name})
//         </span>
//       </Badge>
//     </>
//   );
//   // return (
//   //   <div className="flex flex-row justify-between mx-4 mb-2">
//   //     <Badge variant="outline" className="rounded-lg justify-between gap-2">
//   //       storage
//   //       <Globe />
//   //       <span className="text-lg">{repo.storage_epsg}</span>
//   //       <span className="text-muted-foreground italic text-xs">
//   //         ({repo.storage_name})
//   //       </span>
//   //     </Badge>
//   //     <Badge variant="outline" className="rounded-lg justify-between gap-2">
//   //       display
//   //       <MapIcon />
//   //       <span className="text-lg">{repo.display_epsg}</span>
//   //       <span className="text-muted-foreground italic text-xs">
//   //         <pre>({repo.display_name})</pre>
//   //       </span>
//   //     </Badge>
//   //   </div>
//   // );
// }

function VisConn({ repo }: { repo: Repo }) {
  return (
    <pre className="text-muted-foreground text-xs">
      {JSON.stringify(repo.conn, null, 2)}
    </pre>
  );
}

function VisWellCounts({ repo }: { repo: Repo }) {
  const filteredKeys = Object.keys(repo).filter(
    (key) => key.startsWith("wells_with_") || key.startsWith("well_count")
  );
  return (
    <Table>
      <TableBody>
        {filteredKeys.map((key) => {
          const colName = key.replace("wells_with_", "");
          return (
            <TableRow key={key}>
              <TableCell className="text-right italic">{colName}</TableCell>
              <TableCell className="text-left font-black">
                {(repo as any)[key]}
              </TableCell>
            </TableRow>
          );
        })}
        {/* <TableRow>
          <TableCell colSpan={2} className="py-5"></TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="text-right italic">files</TableCell>
          <TableCell className="text-left font-black">{repo.files}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">directories</TableCell>
          <TableCell className="text-left font-black">
            {repo.directories}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">size</TableCell>
          <TableCell className="text-left font-black">
            {humanFileSize(repo.bytes!)}
          </TableCell>
        </TableRow> */}
      </TableBody>
    </Table>
  );
}

// function VisDates({ repo }: { repo: Repo }) {
//   const mod_dates = parseDateTime(repo.repo_mod!);
//   const touched_dates = parseDateTime(repo.row_touched!);
//   return (
//     <Table>
//       <TableBody>
//         <TableRow>
//           <TableCell className="text-right">last modified</TableCell>
//           <TableCell className="text-left">
//             <span className="italic">{mod_dates.formattedDateTime}</span>
//             <Separator />
//             <span className="font-black">({mod_dates.daysAgoDescription})</span>
//           </TableCell>
//         </TableRow>
//         <TableRow>
//           <TableCell className="text-right">last touched</TableCell>
//           <TableCell className="text-left">
//             <span className="italic">{touched_dates.formattedDateTime}</span>
//             <Separator />
//             <span className="font-black">
//               ({touched_dates.daysAgoDescription})
//             </span>
//           </TableCell>
//         </TableRow>
//       </TableBody>
//     </Table>
//   );
// }

function VisFSCounts({ repo }: { repo: Repo }) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="text-right italic">files</TableCell>
          <TableCell className="text-left font-black">{repo.files}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">directories</TableCell>
          <TableCell className="text-left font-black">
            {repo.directories}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-right">size</TableCell>
          <TableCell className="text-left font-black">
            {humanFileSize(repo.bytes!)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

////////////////////////////////

// 2024-02-09 | pigeon maps (and similar) relies on being able to calculate
// div width/height to render the svg. Since RepoVis is hidden by default, the
// calculation barfs and throws some viewbox errors unless we assign some
// width and height values we get from the useMeasure hook. Also use for Zoom
function VisMap({ repo }: { repo: Repo }) {
  const [ref, { width, height }] = useMeasure();
  const [zoom, setZoom] = React.useState(0);

  React.useEffect(() => {
    if (width && height && width + height > 0) {
      setZoom(polygonZoom(repo.outline as number[][], width, height, 10));
    }
  }, [width, height]);

  if (!repo.outline) {
    return (
      <div className="flex flex-col min-h-full justify-center items-center">
        <Ban size={200} color="lightgrey" />
        <p className="italic">insufficient valid Lat/Lon</p>
      </div>
    );
  }

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
    <div ref={ref} className="flex h-full w-full">
      {zoom > 0 && width && height && width > 0 && height > 0 && (
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
  const mod_dates = parseDateTime(repo.repo_mod!);
  const touched_dates = parseDateTime(repo.row_touched!);

  return (
    <Card className="p-4">
      <CardTitle className="flex justify-between mb-4">
        <div className="flex">
          <span className="mt-1  mr-2">
            {GeoTypeUI[repo.geo_type as string].icon}
          </span>
          <span className="text-2xl ml-1">{repo.name}</span>
        </div>
        <div>
          <pre className="p-2 mr-4 text-muted-foreground">{repo.fs_path}</pre>
        </div>
      </CardTitle>

      {/* <CardTitle>
        <div className="flex items-center w-8/12 gap-20">
          <span className="flex items-center gap-2">
            {GeoTypeUI[repo.geo_type as string].icon}
            <span className="text-xl mt-1">{repo.name}</span>
          </span>
          <pre className="p-2 mt-1 mr-1">{repo.fs_path}</pre>
        </div>
      </CardTitle> */}

      <CardContent className="flex flex-row gap-4">
        {/* ************* */}

        <div className="flex flex-col justify-between w-2/12">
          <VisWellCounts repo={repo} />
        </div>

        {/* ************* */}

        <div className="border border-1 rounded-lg w-6/12 ">
          <VisMap repo={repo} />
        </div>

        {/* ************* */}

        <div className="flex flex-col justify-between w-4/12 m-2">
          {/* <VisFSCounts repo={repo} /> */}

          {/* ************* */}
          <Badge variant="outline" className="flex flex-col gap-1 p-2">
            <div className="flex justify-between items-center w-11/12">
              <span className="flex items-center gap-2">
                <FolderTree />
                total repo size
              </span>
              <span className="text-xl">{humanFileSize(repo.bytes!)}</span>
            </div>
          </Badge>

          <Badge variant="outline" className="flex flex-col gap-1 p-2">
            <div className="flex justify-between items-center w-11/12">
              <span className="flex items-center gap-2">
                <Globe />
                storage epsg
              </span>
              <span className="text-xl">{repo.storage_epsg}</span>
            </div>
            <span className="text-muted-foreground italic text-xs">
              ({repo.storage_name})
            </span>
          </Badge>

          {/* ************* */}

          <Badge variant="outline" className="flex flex-col gap-1 p-2">
            <div className="flex justify-between items-center w-11/12">
              <span className="flex items-center gap-2">
                <MapIcon />
                display epsg
              </span>
              <span className="text-xl">{repo.display_epsg}</span>
            </div>
            <span className="text-muted-foreground italic text-xs">
              ({repo.display_name})
            </span>
          </Badge>

          {/* ************* */}

          <Badge variant="outline" className="flex flex-col gap-1 p-2">
            <div className="flex justify-between items-center w-11/12">
              <span className="flex items-center gap-2">
                <CalendarSearch />
                last touched
              </span>
              <span className="text-lg">{touched_dates.formattedDateTime}</span>
            </div>
            <span className="text-muted-foreground italic text-xs">
              ({touched_dates.daysAgoDescription})
            </span>
          </Badge>

          {/* ************* */}

          <Badge variant="outline" className="flex flex-col gap-1 p-2">
            <div className="flex justify-between items-center w-11/12">
              <span className="flex items-center gap-2">
                <CalendarDays />
                last modified
              </span>
              <span className="text-lg">{mod_dates.formattedDateTime}</span>
            </div>
            <span className="text-muted-foreground italic text-xs">
              ({mod_dates.daysAgoDescription})
            </span>
          </Badge>

          {/* ************* */}

          <VisConn repo={repo} />
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
