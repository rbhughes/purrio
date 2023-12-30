"use client";

import React from "react";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/sb_types";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const DELAY = 1000 * 120;

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

export default function Loader({
  user,
  directive,
}: {
  user: User;
  directive: string;
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [message, setMessage] = React.useState<string>("");

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

          // reject any messages that don't match this directive
          // if (msg.directive != directive) {
          //   return;
          // } else {
          //   console.log(msg.directive, " === ", directive);
          // }
          if (msg.directive === "light") {
            console.log(msg);
            setMessage(msg.message || "NOTHING");
          }

          // NOTE: the reverse to put newest item at top of array
          //setMessages((prev) => [msg, ...prev]);

          // const timeoutId = setTimeout(() => {
          //   setMessages((prev) =>
          //     prev.filter((item) => item.row_created !== msg.row_created)
          //   );
          // }, DELAY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Button
      className="fixed bottom-4 left-4 bg-red-600 w-max"
      onClick={() => console.log("hello")}
    >
      {message}
    </Button>
  );

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
