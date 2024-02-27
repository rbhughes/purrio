"use client";

import GeneralAlertDialog from "@/components/general-alert-dialog";
import { useDialog } from "@/lib/useDialog";

import React from "react";

export default function ThingAlert() {
  //const [alertVisible, setAlertVisible] = React.useState(false);
  //const [alertProceed, setAlertProceed] = React.useState(false);
  //
  const { setAlertVisible, alertProceed } = useDialog();

  return (
    <>
      <button onClick={() => setAlertVisible(true)}>clickme</button>
      <GeneralAlertDialog title="test title" message="test message" />
      {/* <GeneralAlertDialog */}
      {/*   title="hay a title" */}
      {/*   message="hay a mesage" */}
      {/*   visible={alertVisible} */}
      {/*   setVisible={setAlertVisible} */}
      {/*   setProceed={setAlertProceed} */}
      {/* /> */}
      {alertProceed && <h1>OKAY TO PROCEED</h1>}
    </>
  );
}
