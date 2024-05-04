"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const defaultColumnViz = {
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

const fetchPersisted = () => {
  //if (typeof window !== "undefined") {
  const data = localStorage.getItem("ZOOMIES");
  if (data) {
    const persistedColumnViz = JSON.parse(data).state.columnVis;
    return persistedColumnViz;
  } else {
    return defaultColumnViz;
  }
  //} else {
  //  return defaultColumnViz;
  //}
};

interface RepoColumnVizState {
  columnVis: RepoColumnVisibility;
  setColumnVis: (cols: RepoColumnVisibility) => void;
  conn: boolean;
  setConn: (tf: boolean) => void;
  fetchPersisted: () => RepoColumnVisibility;
}

const repoTableStore = (set: any, get: any) => ({
  columnVis: defaultColumnViz,

  setColumnVis: (newCols: RepoColumnVisibility) => set({ columnVis: newCols }),

  // setColumnVisB: (newCols: RepoColumnVisibility) =>
  //   set((state: any) => ({ columnVis: { ...state.columnVis, ...newCols } })),

  conn: true,
  setConn: (value: boolean) => set({ conn: value }),
  fetchPersisted: fetchPersisted,
});

export const useRepoTableStore = create<RepoColumnVizState>()(
  persist(repoTableStore, {
    name: "ZOOMIES",
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

/*
const hydrateStore = (storeName: string, store: any) => {
  //if (typeof window !== "undefined") {
  const persistedState = localStorage.getItem(storeName);
  //alert(JSON.stringify(persistedState));

  if (persistedState) {
    const state = JSON.parse(persistedState).state;
    Object.keys(state).forEach((key) => {
      store.setState({ [key]: state[key] });
    });
  }
  //}
};
//if (typeof window !== "undefined") {
//hydrateStore("ZOOMIES", useRepoTableStore);
//}

const HydrateStore = () => {
  React.useEffect(() => {
    hydrateStore("ZOOMIES", useRepoTableStore);
    //useRepoTableStore.persist.rehydrate();
    //let x: any = localStorage.getItem("ZOOMIES");
    //alert(x);
  }, []);

  return null;
  //return React.createElement("div", null, `HellLLLLLL, ${name}!`);
};

export default HydrateStore;
*/
