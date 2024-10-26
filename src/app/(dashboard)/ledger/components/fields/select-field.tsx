import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

type Props = {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
}

const SelectField: React.FC<Props> = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
}) => {
  const safeOptions = Array.isArray(options) ? options : [];
  const selectedOption = safeOptions.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? "";

  return (
    <div className="flex-1 w-full">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      <div className="flex py-1 my-2">
        <Select
          value={value || undefined}
          onValueChange={onChange}
          required={required}
        >
          <SelectTrigger className="w-full text-white border-2 bg-primary">
            <SelectValue placeholder={`Select ${label}`}>
              {selectedLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-lg max-h-80">
            {safeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-md cursor-pointer hover:bg-white/90"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectField;
