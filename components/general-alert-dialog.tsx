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

import { useDialog } from "@/lib/useDialog";

// choose Cancel or Continue
export default function GeneralAlertDialog({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const { setAlertProceed, alertVisible, setAlertVisible } = useDialog();

  return (
    <>
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
    </>
  );
}
