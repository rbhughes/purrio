"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ExpandedState } from "@tanstack/react-table";

/**
2024-05-04 | So...using zustand to store repo columnVisibility does not work
quite so simply as this site would suggest:
https://medium.com/@koalamango/fix-next-js-hydration-error-with-zustand-state-management-0ce51a0176ad

To clarify, it works fine until we have to use this in data-table:
  const [columnVisibility, setColumnVisibility] = React.useState(something)
as seen here:

https://tanstack.com/table/latest/docs/framework/react/examples/column-visibility

...at which point useState always gets the default, non-serialized data
from localStorage, probably because SSR renders first(?).
Failures include:
  * the onRehydrateStorage below
  * useRepoTableStore.persist.rehydrate() in the (protected)/layout.tsx
  * carefully setting both zustand state + setColumnVisibility in data-table

Controlling each column with its own useState hook seemed to work, but the
extra code would be awful.

All of this should be client-side, so this thread is (probably) not relevant:
https://github.com/pmndrs/zustand/discussions/2200
However, I think SSR causing a double render is the ultimate cause.

ANYWAY this works:
  * force the fetchPersisted() in useEffect() to correctly set initial state:
  * keep track of correct columnVisibility state via zustand in useEffect(),
    but only after hydrated=true so that we are for-sure in "use-client" mode.
*/

const STORE_NAME = "PURR_DATA_TABLE";

export type RepoColumnVisibility = {
  bytes: boolean;
  conn: boolean;
  conn_aux: boolean;
  directories: boolean;
  display_epsg: boolean;
  display_name: boolean;
  files: boolean;
  fs_path: boolean;
  suite: boolean;
  id: boolean;
  name: boolean;
  repo_mod: boolean;
  created_at: boolean;
  touched_at: boolean;
  updated_at: boolean;
  storage_epsg: boolean;
  storage_name: boolean;
  well_count: boolean;
  wells_with_completion: boolean;
  wells_with_core: boolean;
  wells_with_dst: boolean;
  wells_with_formation: boolean;
  wells_with_ip: boolean;
  wells_with_perforation: boolean;
  wells_with_production: boolean;
  wells_with_raster_log: boolean;
  wells_with_survey: boolean;
  wells_with_vector_log: boolean;
  wells_with_zone: boolean;
};

export type AssetJobColumnVisibility = {
  asset: boolean;
  tag: boolean;
  chunk: boolean;
  cron: boolean;
  where_clause: boolean;
  //filter: boolean;
  id: boolean;
  last_invoked: boolean;
  repo_fs_path: boolean;
  repo_suite: boolean;
  repo_id: boolean;
  repo_name: boolean;
  created_at: boolean;
  touched_at: boolean;
  updated_at: boolean;
};

const defaultRepoColumnVisibility = {
  bytes: true,
  conn: true,
  conn_aux: false,
  directories: false,
  display_epsg: false,
  display_name: false,
  files: false,
  fs_path: false,
  suite: true,
  id: false,
  name: true,
  repo_mod: true,
  created_at: true,
  touched_at: true,
  updated_at: false,
  storage_epsg: false,
  storage_name: false,
  well_count: true,
  wells_with_completion: false,
  wells_with_core: false,
  wells_with_dst: false,
  wells_with_formation: false,
  wells_with_ip: false,
  wells_with_perforation: false,
  wells_with_production: false,
  wells_with_raster_log: false,
  wells_with_survey: false,
  wells_with_vector_log: false,
  wells_with_zone: false,
};

const defaultRepoRowsExpanded = true as ExpandedState;

const defaultAssetJobColumnVisibility = {
  asset: true,
  tag: false,
  chunk: true,
  cron: false,
  where_clause: true,
  //filter: true,
  id: false,
  last_invoked: true,
  repo_fs_path: false,
  repo_suite: true,
  repo_id: false,
  repo_name: true,
  created_at: false,
  touched_at: false,
  updated_at: false,
};

interface PurrDataTableJSON {
  state: {
    repoColumnVisibility: RepoColumnVisibility;
    repoRowsExpanded: ExpandedState;
    assetJobColumnVisibility: AssetJobColumnVisibility;
  };
  version: 0;
}

export const fetchPersistedState = (): PurrDataTableJSON => {
  const data = localStorage.getItem(STORE_NAME);
  if (data) {
    return JSON.parse(data);
  } else {
    return {
      state: {
        repoColumnVisibility: defaultRepoColumnVisibility,
        repoRowsExpanded: defaultRepoRowsExpanded,
        assetJobColumnVisibility: defaultAssetJobColumnVisibility,
      },
      version: 0,
    };
  }
};

interface PurrDataTableState {
  assetJobColumnVisibility: AssetJobColumnVisibility;
  setAssetJobColumnVisibility: (cols: AssetJobColumnVisibility) => void;

  repoColumnVisibility: RepoColumnVisibility;
  setRepoColumnVisibility: (cols: RepoColumnVisibility) => void;

  repoRowsExpanded: ExpandedState;
  setRepoRowsExpanded: (exp: ExpandedState) => void;
}

// to merge individual column states...if you're into that sort of thing...
// setColumnVis: (newCols: RepoColumnVisibility) =>
//   set((state: any) => ({ columnVis: { ...state.columnVis, ...newCols } })),

const dataTableStore = (set: any, get: any) => ({
  assetJobColumnVisibility: defaultAssetJobColumnVisibility,
  setAssetJobColumnVisibility: (newCols: AssetJobColumnVisibility) =>
    set({ assetJobColumnVisibility: newCols }),

  repoColumnVisibility: defaultRepoColumnVisibility,
  setRepoColumnVisibility: (newCols: RepoColumnVisibility) =>
    set({ repoColumnVisibility: newCols }),

  repoRowsExpanded: defaultRepoRowsExpanded,
  setRepoRowsExpanded: (exp: ExpandedState) => set({ repoRowsExpanded: exp }),
});

export const useDataTableStore = create<PurrDataTableState>()(
  persist(dataTableStore, {
    name: STORE_NAME,
    // onRehydrateStorage: (state) => {
    //   console.log("hydration starts");

    //   // optional
    //   return (state, error) => {
    //     if (error) {
    //       console.log("an error happened during hydration", error);
    //     } else {
    //       let persisted = fetchPersisted();
    //       if (state) {
    //         console.log("force setter conn=", JSON.stringify(persisted.conn));
    //         state.columnVis = persisted;
    //       }

    //       //state?.setColumnVis(persisted);
    //       //console.log(persisted);
    //       //console.log(JSON.stringify(state, null, 2));
    //       console.log("hydration finished");
    //     }
    //   };
    // },
  })
);
