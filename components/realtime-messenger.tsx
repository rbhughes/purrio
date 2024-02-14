"use client";

import React from "react";

import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/sb_types";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

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

const DELAY = 1000 * 60;

type Message = Database["public"]["Tables"]["message"]["Row"];

interface MessengerArgs {
  new: Message;
}

function refactorArray(arr: MessengerArgs[]) {
  return arr.reduce((result: Record<string, MessengerArgs["new"]>, item) => {
    const { repo_id } = item.new;
    if (repo_id) {
      result[repo_id] = item.new;
    }
    return result;
  }, {} as Record<string, MessengerArgs["new"]>);
}

export default function RealtimeMessenger({
  user,
  directive,
}: {
  user: User;
  directive: string;
}) {
  const supabase = createClient();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [activity, setActivity] = React.useState<string | null>(null);

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime message")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          let msg: Message = payload.new;

          if (msg.directive === "activity") {
            setActivity(msg.activity);
          }

          setTimeout(() => {
            setActivity(null);
          }, DELAY);

          // NOTE: the reverse to put newest item at top of array
          setMessages((prev) => [msg, ...prev]);

          setTimeout(() => {
            setMessages((prev) =>
              prev.filter((item) => item.row_created !== msg.row_created)
            );
          }, DELAY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button
          className={`purr-activity-button transition-opacity ease-in-out duration-600 ${
            activity ? "opacity-100 ring-4 ring-amber-400" : "opacity-10"
          }`}
        > */}
        <Button
          className={`purr-activity-button transition-opacity ease-in-out duration-600 ${
            activity ? "opacity-100 ring-4 ring-amber-400" : "opacity-10"
          }`}
        >
          {activity ? activity : "(activity)"}
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-full">
        {/* <DialogHeader>
          <DialogTitle>dialog title</DialogTitle>
          <DialogDescription>dialog desc</DialogDescription>
        </DialogHeader> */}

        <div className="flex items-center space-x-2">
          {/* <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div> */}

          <h1>recon</h1>
          <ul>
            {messages
              .filter((m) => m.directive === "recon")
              .map((m) => (
                <li key={m.row_created}>
                  {m.row_created}--{m.message}===={directive}
                </li>
              ))}
          </ul>
          <h1>upsert</h1>
          <ul>
            {messages
              .filter((m) => m.directive === "upsert")
              .map((m) => (
                <li key={m.row_created}>
                  {m.row_created}--{m.message}===={directive}
                </li>
              ))}
          </ul>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      {/* <AssetBatchDialog repo_id={"a repo id"} /> */}
    </Dialog>
  );

  // return (
  //   <Button
  //     className="fixed bottom-14 left-2 bg-red-600 w-40"
  //     onClick={() => console.log("hello")}
  //   >
  //     {/* {message} */}
  //   </Button>
  // );

  // return (
  //   <div className="bg-slate-100 h-40 overflow-auto break-all font-mono outline m-5">
  //     <h1>recon</h1>
  //     <ul>
  //       {messages
  //         .filter((m) => m.directive === "recon")
  //         .map((m) => (
  //           <li key={m.row_created}>
  //             {m.row_created}--{m.message}===={directive}
  //           </li>
  //         ))}
  //     </ul>
  //     <h1>upsert</h1>
  //     <ul>
  //       {messages
  //         .filter((m) => m.directive === "upsert")
  //         .map((m) => (
  //           <li key={m.row_created}>
  //             {m.row_created}--{m.message}===={directive}
  //           </li>
  //         ))}
  //     </ul>
  //   </div>
  // );
}
