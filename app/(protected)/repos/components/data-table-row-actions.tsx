"use client";

import { AssetBatchDialog } from "./asset-batch-dialog";
import { CopyIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

//import { Button } from "@/registry/new-york/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//} from "@/registry/new-york/ui/dropdown-menu";

//import { labels } from "../data/data";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

//import { taskSchema } from "../data/schema";
import { repoSchema } from "../repo-schema";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

// function FakeDialog2({ arg }: { arg: number }) {
//   return (
//     <>
//       <DialogTrigger asChild>
//         <Button variant="outline">Share</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Share link MY ARG {arg}</DialogTitle>
//           <DialogDescription>
//             Anyone who has this link will be able to view this.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2">
//           <div className="grid flex-1 gap-2">
//             <Label htmlFor="link" className="sr-only">
//               Link
//             </Label>
//             <Input
//               id="link"
//               defaultValue="https://ui.shadcn.com/docs/installation"
//               readOnly
//             />
//           </div>
//           <Button type="submit" size="sm" className="px-3">
//             <span className="sr-only">Copy</span>
//             <CopyIcon className="h-4 w-4" />
//           </Button>
//         </div>
//         <DialogFooter className="sm:justify-start">
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </>
//   );
// }

const doThing = (x: any, r: any) => {
  console.log("I should be doing favorite thing:", x);
  console.log(r);
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const repo = repoSchema.parse(row.original);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit</DropdownMenuItem>

          {/* what's up with asChild?:
           https://www.radix-ui.com/primitives/docs/guides/composition*/}
          {/* <DropdownMenuItem asChild> */}
          {/* // but another, simpler solution is to just remove DropDownMenuItem
          https://github.com/shadcn-ui/ui/issues/1128 */}

          {/* // */}
          <AssetBatchDialog arg={111} />
          {/* // */}

          {/* </DropdownMenuItem> */}
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              doThing("favorite", row.getValue("fs_path"));
            }}
          >
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={repo.geo_type}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
