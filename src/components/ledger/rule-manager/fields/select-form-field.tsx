import React, { ReactNode } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  ConditionSelectProps,
  FormFieldProps,
  PaymentModeSelectProps,
} from "./types";

export const AccountSelect = <T extends FieldValues>({
  control,
  name,
  placeholder,
  items,
  rules,
  errors,
}: FormFieldProps<T>) => (
  <div>
    <Controller
      name={name as Path<T>}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Select
          onValueChange={(value: string) => field.onChange(Number(value))}
          value={field.value ? field.value.toString() : ""}
        >
          <SelectTrigger className="w-full border-2 bg-primary">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-md max-h-80">
            {items?.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id.toString()}
                className="truncate rounded-md"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-neutral-400">
        {errors[name]?.message as ReactNode}
      </p>
    )}
  </div>
);

export const ConditionSelect = <T extends FieldValues>({
  control,
  name,
  placeholder,
  items,
  rules,
  errors,
}: ConditionSelectProps<T>) => (
  <div>
    <Controller
      name={name as Path<T>}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-full border-2 bg-primary">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-md max-h-80">
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="truncate rounded-md"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {errors[name]?.message as ReactNode}
      </p>
    )}
  </div>
);

export const PaymentModeSelect = <T extends FieldValues>({
  control,
  name,
  placeholder,
  items,
  errors,
}: PaymentModeSelectProps<T>) => (
  <div className="flex flex-col gap-1">
    <h1 className="text-sm">Payment Mode</h1>
    <Controller
      name={name as Path<T>}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-full border-2 bg-primary">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="border-none bg-neutral-200/70 backdrop-blur-md max-h-52">
            {items.map((item) => (
              <SelectItem
                key={item}
                value={item}
                className="truncate rounded-md"
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {errors[name] && (
      <span className="text-xs text-red-500">This field is required</span>
    )}
  </div>
);
