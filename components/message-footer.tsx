"use client";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FooterNotes } from "@/components/footer-notes";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/sb_types";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

const DELAY = 1000 * 60 * 30;

type Message = Database["public"]["Tables"]["message"]["Row"];

const filterNotesByPathname = (notes: Message[], pathname: string) => {
  interface Matcher {
    [key: string]: string;
  }

  // there's also the workflow type "any" that matches anything
  let routeToWorkflow: Matcher = {
    assets: "load",
    repos: "recon",
    search: "search",
  };

  let pn = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  let matcher = routeToWorkflow[pn];

  return notes.filter(
    (m: Message) =>
      (m.workflow === matcher || m.workflow === "any") && m.directive === "note"
  );
};

export const MessageFooter = ({ user }: { user: User }) => {
  const supabase = createClient();

  const pathname = usePathname();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [busy, setBusy] = React.useState<boolean>(false);
  //const [activity, setActivity] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const doit = async () => {
  //     const { data: messages } = await supabase
  //       .from("message")
  //       .select()
  //       .order("created_at", { ascending: false });

  //     if (messages) {
  //       setMessages(messages);
  //     }
  //   };
  //   doit();
  // }, []);

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

        async (payload: any) => {
          let msg: Message = payload.new;

          if (msg.workflow === "any") {
            setBusy(true);
            setTimeout(() => {
              setBusy(false);
            }, 5000);
          }

          if (msg.directive === "busy") {
            let job_id = (msg.data as any).job_id;
            setBusy(true);
            console.log("GOT A BUSY", job_id);
          }
          if (msg.directive === "done") {
            let job_id = (msg.data as any).job_id;
            await supabase.from("message").delete().eq("data->>job_id", job_id);
            setBusy(false);
            console.log("GOT A DONE", job_id);
          }

          // NOTE: the reverse to put newest item at top of array
          setMessages((prev) => [msg, ...prev]);

          setTimeout(() => {
            setMessages((prev) =>
              prev.filter((item) => item.created_at !== msg.created_at)
            );
          }, DELAY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  //console.log(messages);
  // <p
  //   className={` transition-opacity ease-in-out duration-600 ${
  //     busy ? "opacity-100 ring-4 ring-amber-400 w-full" : "opacity-10"
  //   }`}
  // >
  //   {busy && `Worker is active. Click for details`}
  // </p>

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger className="flex w-full">
        <footer
          className={`w-full h-[60px] border-t border-t-foreground/10 \
             flex justify-center items-center bg-gradient-to-b from-secondary ${
               busy && "bg-yellow-400"
             }`}
        >
          <div
            className={` transition-opacity ease-in-out duration-500 ${
              busy ? "opacity-100" : "opacity-10 "
            }`}
          >
            <p className="italic">{busy && "click for activity log"}</p>
          </div>
        </footer>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="ml-32 italic">
            {busy ? "recent activity..." : "worker(s) idle"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="max-h-96 overflow-y-auto">
          <FooterNotes notes={filterNotesByPathname(messages, pathname)} />
        </div>

        <DrawerFooter>
          {/* <Button>Submit</Button> */}
          {/* <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  // return (
  //   <footer
  //     className="w-full h-[60px] border-t border-t-foreground/10 \
  //            flex justify-center items-center bg-gradient-to-b from-secondary"
  //   >
  //     {/* <RealtimeMessenger user={user!} directive={"recon"} /> */}
  //     footsie
  //   </footer>
  // );
};
