"use client";

import { Button } from "@/components/ui/button";
import { enqueueSearchExportTask } from "@/lib/actions";

export interface SearchStorageOption {
  asset: string;
  sql: string;
  total_hits: number;
  user_id: string;
}

export const SearchResultStorage = ({
  props,
}: {
  props: SearchStorageOption[];
}) => {
  return (
    <div>
      <h1>Query returns</h1>
      {props.map((o) => (
        <div key={o.asset}>
          <div>
            {o.total_hits} hits for asset: {o.asset}
          </div>
          <Button onClick={() => enqueueSearchExportTask(o)} />
        </div>
      ))}
    </div>
  );

  //props.map((o) => <li key={o.asset}>{o.asset}</li>);
};
