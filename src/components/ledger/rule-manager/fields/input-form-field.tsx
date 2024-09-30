import React, { ReactNode } from "react";
import { FormFieldProps } from "./types";
import { Path } from "react-hook-form";

export const InputFormField = <T extends Record<string, any>>({
  register,
  name,
  placeholder,
  validation,
  errors,
}: FormFieldProps<T>) => (
  <div>
    <input
      {...register!(name as Path<T>, validation)}
      placeholder={placeholder}
      className="w-full py-1 text-gray-200 transition-colors bg-transparent border-b-2 outline-none appearance-none focus:outline-none focus:border-purple-600"
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]?.message as ReactNode}
      </p>
    )}
  </div>
);
