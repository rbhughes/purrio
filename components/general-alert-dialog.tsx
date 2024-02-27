"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/useDialog";

// choose Cancel or Continue
export default function GeneralAlertDialog({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  //const [alertProceed, setAlertProceed] = React.useState(false);
  //const [alertVisible, setAlertVisible] = React.useState(false);
  //
  const { alertProceed, setAlertProceed, alertVisible, setAlertVisible } =
    useDialog();

  return (
    <>
      {/* <button onClick={() => setAlertVisible(true)}>clickme</button> */}
      <AlertDialog
        onOpenChange={setAlertVisible}
        open={alertVisible}
        defaultOpen={alertVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertProceed(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setAlertProceed(true)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {alertProceed && <h1>OKAY TO PROCEED</h1>}
    </>
  );
}
