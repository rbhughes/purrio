import { Database } from "@/lib/sb_types";
import { ScrollArea } from "./ui/scroll-area";
//import { Separator } from "./ui/separator";
import { relativeTimeAgo, simplifyDateString } from "@/lib/purr_utils";
type Message = Database["public"]["Tables"]["message"]["Row"];

export const FooterNotes = ({ notes }: { notes: Message[] }) => {
  return (
    <ScrollArea>
      <div className="m-2 p-2 font-mono">
        {notes.map((msg: Message) => (
          <div
            key={msg.id}
            className="flex flex-row w-full gap-2 pb-1 select-all"
          >
            <div className="flex flex-row w-3/12 gap-6">
              <div className="text-orange-500">{msg.id}</div>
              <div>{simplifyDateString(msg.created_at)}</div>
            </div>

            <div className="w-1/12">{msg.worker}</div>
            <div className="w-6/12">{(msg.data as any).note}</div>

            <div className="w-2/12 italic">
              {relativeTimeAgo(msg.created_at)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
