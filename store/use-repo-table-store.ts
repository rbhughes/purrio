import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface RepoTableState {
  catName: string;
  setCatName: (name: string) => void;
}

const repoTableStore = (set: any) => ({
  catName: "",

  setCatName: (name: string) => {
    set(() => ({
      catName: name,
    }));
  },
});

export const useRepoTableStore = create<RepoTableState>()(
  devtools(persist(repoTableStore, { name: "PURR_REPO_SETTINGS" }))
);
