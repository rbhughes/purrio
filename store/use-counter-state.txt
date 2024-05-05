import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Counter {
  value: number;
  color: string;
  increment: () => void;
  setColor: (colorName: string) => void;
}

export const useCounterState = create(
  persist<Counter>(
    (set, get) => ({
      value: 0,
      color: "",
      increment: () => {
        set((state) => ({ value: state.value + 1 }));
      },
      setColor: (colorName: string) => set({ color: colorName }),
    }),
    {
      name: "counter",
    }
  )
);
