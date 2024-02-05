import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

export default function MissingReposWarning({
  withMissingRepos,
}: {
  withMissingRepos: AssetJob[];
}) {
  //return <h1>{JSON.stringify(withMissingRepos)}</h1>;
  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Excluding AssetJobs with missing Repos:</AlertTitle>
      {withMissingRepos.map((aj) => (
        <AlertDescription key={aj.id}>{aj.repo_fs_path}</AlertDescription>
      ))}
    </Alert>
  );
}
