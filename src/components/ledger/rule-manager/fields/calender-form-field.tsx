import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { Calendar } from "../../../../components/ui/calendar";
import { CalendarFormFieldProps } from "./types";

export const CalendarFormField = <T extends FieldValues>({
  control,
  name,
  errors,
}: CalendarFormFieldProps<T>) => (
  <div>
    <Controller
      name={name} // Type assertion to string for Controller name
      control={control}
      render={({ field }) => (
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          className="border rounded-lg"
        />
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]?.message as React.ReactNode}
      </p>
    )}
  </div>
);
