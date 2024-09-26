import React, { ChangeEvent } from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  label?: string;
  id: string;
  parentClassName?: string;
  accept?: string;
  required: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  name,
  label,
  id,
  parentClassName,
  // required,
  // accept,
  ...props
}) => {
  return (
    <div className={`${parentClassName} p-5 m-3`}>
      <label
        className="font-bold h-6 mt-3 text-gray-400 text-xs leading-8 uppercase"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className={`py-1 w-full text-gray-100 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors ${
          type !== "file" && "border-b-2"
        }`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        {...props}
      />
    </div>
  );
};

export default Input;
