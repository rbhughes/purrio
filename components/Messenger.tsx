"use client";

import React from "react";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/sb_types";
import { User } from "@supabase/supabase-js";

//import { Toaster } from "@/components/ui/toaster";
//import { toast } from "@/components/ui/use-toast";

// function checkTimestamp(timestamp: string): void {
//   // Convert PostgreSQL timestamp to JavaScript Date object
//   const postgresTimestamp = new Date(timestamp);

//   // Get the current system time
//   const currentSystemTime = new Date();

//   // Calculate the time difference in milliseconds
//   const timeDifference =
//     currentSystemTime.getTime() - postgresTimestamp.getTime();

//   // Check if the timestamp is older than 3 hours (3 * 60 * 60 * 1000 milliseconds)
//   if (timeDifference > 3 * 60 * 60 * 1000) {
//     console.log("The PostgreSQL timestamp is older than 3 hours.");
//   } else {
//     console.log("The PostgreSQL timestamp is within the last 3 hours.");
//   }
// }

const DELAY = 1000 * 30; //30 sec

type Message = Database["public"]["Tables"]["messages"]["Row"];

interface MessengerArgs {
  user: User;
  directive: Message["directive"];
}

export default function Messenger({ user, directive }: MessengerArgs) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [messages, setMessages] = React.useState<Message[]>([]);

  // NOTE: 2023-11-18 | filter only supports one check.
  // NOTE: message.user_id is determined by purr_client .env
  React.useEffect(() => {
    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          let msg: Message = payload.new;

          // reject any messages that don't match this directive
          if (msg.directive != directive) {
            return;
          }

          // NOTE: the reverse to put newest item at top of array
          setMessages((prev) => [msg, ...prev]);

          const timeoutId = setTimeout(() => {
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
    <div className="bg-slate-100 h-40 overflow-auto break-all font-mono">
      <ul>
        {messages.map((m) => (
          <li key={m.row_created}>
            {m.row_created}--{m.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
