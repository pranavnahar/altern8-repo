import React from "react";
import {
  Select,
  SelectContent,
  //SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface selectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<selectFieldProps> = ({
  label,
  value,
  onChange,
  //options,
  ...rest
}) => {
  //const selectedOption = options.find((option) => option.value === value)!;
  // console.log(options);

  // const selectedOption = options.find((option) => option.value === value);
  // const selectedLabel = selectedOption ? selectedOption.label : "";

  return (
    <div className="flex-1 w-full">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
      </div>
      <div className="flex py-1 my-2">
        <Select value={value} onValueChange={onChange} {...rest}>
          <SelectTrigger className="w-full text-white border-2 bg-primary">
            <SelectValue placeholder={`Select ${label}`}>
              {/* {selectedLabel} */}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-lg max-h-80">
            {/* {options.map((option, index: number) => (
              <SelectItem
                key={index}
                value={option.value}
                className="rounded-md cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectField;
