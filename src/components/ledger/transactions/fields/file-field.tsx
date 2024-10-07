import React from "react";
import { Input } from "../../../../components/ui/input";

const FileField: React.FC<{
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, onChange }) => {
  return (
    <div className="flex-1 w-full mt-4">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
      </div>
      <div className="flex py-1 my-2">
        <Input
          onChange={onChange}
          className="w-full transition-colors bg-transparent border border-purple-600 border-dashed rounded-md outline-none appearance-none cursor-pointer focus:outline-none text-neutral-200 border-neutral-300/70 placeholder:text-neutral-100 hover:bg-neutral-950/20 animation"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif"
        />
      </div>
    </div>
  );
};

export default FileField;
