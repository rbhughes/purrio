import { Database } from "@/lib/sb_types";
type Message = Database["public"]["Tables"]["message"]["Row"];

// TODO: use pathname to filter only those messages relevant to current route
// TODO:
export const FooterNotes = ({
  pathname,
  notes,
}: {
  pathname: string;
  notes: Message[];
}) => {
  console.log("pathname", pathname);
  /*
  const reposActions = ["recon"];
  const assetsActions = ["batcher", "asset_load", "stats"];
  const searchActions = ["search"];

  switch (pathname) {
    case "repos":
      return messages
        .filter((m) => reposActions.includes(m.directive!))
        .map((m) => <div key={m.created_at}>{JSON.stringify(m)}</div>);
      break;
    case "assets":
      break;
    default:
  }
  */
  return notes.map((m) => (
    <div key={m.id}>
      {m.directive} {m.id} {JSON.stringify(m.data)} | {pathname} | {m.workflow}
      {/* {m.created_at}--{JSON.parse(m.data as string).task_id}===={pathname} */}
    </div>
  ));

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
