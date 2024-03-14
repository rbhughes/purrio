"use client";

import React from "react";

import { Database } from "@/lib/sb_types";
type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

export function ShowHits({ searchResults }: { searchResults: SearchResult[] }) {
  return (
    <>
      {searchResults.map((sr) => {
        return (
          <div key={sr.id}>
            {sr.task_id} | {sr.search_id} | {JSON.stringify(sr.result)}
          </div>
        );
      })}
    </>
  );
}
