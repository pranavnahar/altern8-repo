import React from "react";
import { Switch } from "../../../../components/ui/switch";

const SwitchField: React.FC<{
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}> = ({ label, checked, onCheckedChange }) => {
  return (
    <div className="flex-1 w-full">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
      </div>
      <div className="flex items-center py-1 my-2">
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
        <span className="ml-2 text-gray-200">{checked ? "Yes" : "No"}</span>
      </div>
    </div>
  );
};

export default SwitchField;
