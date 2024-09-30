import React from "react";

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: () => void;
  type: string;
  required: boolean;
  inputClassName: string;
}> = ({ label, value, onChange, type, required, inputClassName, ...rest }) => {
  return (
    <div className="flex-1 w-full">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
      </div>
      <div className="flex py-1 my-2">
        {type === "textarea" ? (
          <textarea
            onChange={onChange}
            value={value}
            placeholder={label}
            className={inputClassName}
            rows={Number(1)}
            {...rest}
          />
        ) : (
          <input
            onChange={onChange}
            value={value}
            placeholder={label}
            className={inputClassName}
            type={type}
            required={required}
            {...rest}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
