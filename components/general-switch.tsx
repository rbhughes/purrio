import { Switch } from "@/components/ui/switch";

import React, { Dispatch, SetStateAction } from "react";
import { ExpandedState } from "@tanstack/react-table";

interface SwitchProps {
  label: string;
  checked?: boolean;
  //onChange?: (checked: boolean) => void;
  onChange?: Dispatch<SetStateAction<ExpandedState>>;
}

export const GeneralSwitch: React.FC<SwitchProps> = ({
  label,
  checked: initialChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked as ExpandedState);
    }
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");
    // console.log(checked);
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={checked}
        onCheckedChange={() => handleChange(!checked)}
      />
      <label htmlFor="switch">{label}</label>
    </div>
  );
};
