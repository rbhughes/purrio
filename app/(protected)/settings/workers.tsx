import { Database } from "@/lib/sb_types";

type Worker = Database["public"]["Tables"]["worker"]["Row"];

export const Workers = ({ workers }: { workers: Worker[] }) => {
  return (
    <code className="bg-red-100">
      <pre>{JSON.stringify(workers, null, 2)}</pre>
    </code>
  );
};
