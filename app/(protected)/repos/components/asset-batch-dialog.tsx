import { Button } from "@/components/ui/button";

import { CopyIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

//TODO: match styling of DialogTrigger to dropdownMenu (width)
export function AssetBatchDialog({ arg }: { arg: number }) {
  return (
    <>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8  p-2 data-[state=open]:bg-muted"
        >
          Batches
        </Button>
      </DialogTrigger>

      {/* <DialogContent className="sm:max-w-md"> */}
      {/* <DialogContent className="max-w-full"> */}
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Share link MY ARG {arg}</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
