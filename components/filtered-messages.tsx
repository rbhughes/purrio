import { Database } from "@/lib/sb_types";
type Message = Database["public"]["Tables"]["message"]["Row"];

export const FilteredMessages = ({
  pathname,
  messages,
}: {
  pathname: string;
  messages: Message[];
}) => {
  const reposActions = ["recon"];
  const assetsActions = ["batcher", "asset_load", "stats"];
  const searchActions = ["search"];

  switch (pathname) {
    case "repos":
      return messages
        .filter((m) => reposActions.includes(m.directive!))
        .map((m) => (
          <div key={m.created_at}>
            {m.created_at} | {m.directive} | {m.level} | {m.function} |{" "}
            {m.message}
          </div>
        ));
      break;
    case "assets":
      break;
    default:
  }
  // return (
  //   messages
  //     //.filter((m) => m.directive === "load_asset")
  //     .map((m) => (
  //       <div key={m.created_at}>
  //         {m.created_at}--{m.message}===={pathname}
  //       </div>
  //     ))
  // );
};
