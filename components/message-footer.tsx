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
import { usePathname, useSearchParams } from "next/navigation";

const DELAY = 1000 * 6000;

type Message = Database["public"]["Tables"]["message"]["Row"];

// interface MessengerArgs {
//   new: Message;
// }

export const MessageFooter = ({ user }: { user: User }) => {
  const supabase = createClient();

  const pathname = usePathname();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [busy, setBusy] = React.useState<boolean>(false);
  //const [activity, setActivity] = React.useState<string | null>(null);

  React.useEffect(() => {
    const doit = async () => {
      const { data: messages } = await supabase
        .from("message")
        .select()
        .order("created_at", { ascending: false });

      if (messages) {
        setMessages(messages);
      }
    };
    doit();
  }, []);

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

          if (msg.directive === "busy") {
            let job_id = (msg.data as any).job_id;
            setBusy(true);
          }
          if (msg.directive === "done") {
            let job_id = (msg.data as any).job_id;
            await supabase.from("message").delete().eq("data->>job_id", job_id);
            setBusy(false);
          }

          // if (msg.directive === "activity") {
          //   setActivity(msg.activity);
          // }

          // setTimeout(() => {
          //   setActivity(null);
          // }, DELAY);

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

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger className="flex w-full">
        <footer
          className="w-full h-[60px] border-t border-t-foreground/10 \
             flex justify-center items-center bg-gradient-to-b from-secondary"
        >
          {/* <p
            className={` transition-opacity ease-in-out duration-600 ${
              activity ? "opacity-100 ring-4 ring-amber-400" : "opacity-10"
            }`}
          >
            {activity ? activity : "(activity)"}
          </p> */}
          {busy ? <>BUSY</> : <>NOT BUSY</>}
          stuff on footer
        </footer>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Recent worker activity...</DrawerTitle>
        </DrawerHeader>

        <FooterNotes
          pathname={pathname.substring(1)} //remove leading slash
          notes={messages.filter((m) => m.directive === "note")}
        />

        {/* <h1>recon</h1>
        <ul>
          {messages
            .filter((m) => m.directive === "recon")
            .map((m) => (
              <li key={m.created_at}>
                {m.created_at}--{m.message}===={directive}
              </li>
            ))}
        </ul>
        <h1>load_asset</h1>
        <ul>
          {messages
            .filter((m) => m.directive === "load_asset")
            .map((m) => (
              <li key={m.created_at}>
                {m.created_at}--{m.message}===={directive}
              </li>
            ))}
        </ul> */}

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
