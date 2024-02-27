import { create } from "zustand";

interface DialogProps {
  alertVisible: boolean;
  alertProceed: boolean;
  setAlertVisible: (state: boolean) => void;
  setAlertProceed: (state: boolean) => void;
  //setClose: () => void;
  //data: any;
  //setData(data: any): void;
}

export const useDialog = create<DialogProps>((set) => ({
  alertVisible: false,
  alertProceed: false,
  setAlertVisible: (state) => set({ alertVisible: state }),
  setAlertProceed: (state) => set({ alertProceed: state }),
  //setClose: () => set({ open: false }),
  //data: {},
  //setData: (data) => set({ data: { data } }),
}));
