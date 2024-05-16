import { Switch } from "@/components/ui/switch";

import React, { Dispatch, SetStateAction } from "react";

interface SwitchProps<T> {
  label: string;
  checked?: boolean;
  onChange?: Dispatch<SetStateAction<T>>;
}
export const GeneralSwitch = <T extends unknown>({
  label,
  checked: initialChecked = false,
  onChange,
}: SwitchProps<T>) => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked as T);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="switch">{label}</label>
      <Switch
        checked={checked}
        onCheckedChange={() => handleChange(!checked)}
      />
    </div>
  );
};
