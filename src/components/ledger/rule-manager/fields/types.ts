import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export interface CalendarFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
}

export interface FormFieldProps<T extends FieldValues> {
  control?: Control<T>;
  name: Path<T> | string;
  errors: FieldErrors<T>;
  placeholder: string;
  items?: { id: string; name: string }[];
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  register?: UseFormRegister<T>;
  validation?:
    | { required: string }
    | { pattern: { value: RegExp; message: string } };
}

export interface ConditionSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T> | string;
  errors: FieldErrors<T>;
  placeholder: string;
  items: { value: string; label: string }[];
  rules?:
    | Omit<
        RegisterOptions<T, Path<T>>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
      >
    | undefined;
}

export interface PaymentModeSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T> | string;
  errors: FieldErrors<T>;
  placeholder: string;
  items: string[];
}
