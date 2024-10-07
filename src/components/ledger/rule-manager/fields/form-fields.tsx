import React from "react";
import { InputFormField } from "./input-form-field";
import {
  AccountSelect,
  ConditionSelect,
  PaymentModeSelect,
} from "./select-form-field";
import useAccounts from "@/hooks/ledger/accounts/use-accounts";
import { CalendarFormField } from "./calender-form-field";
import { FormFieldProps } from "./types";
import { Control, Path } from "react-hook-form";
export const CONDITION_TYPES = [
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
];

const FormFields = <T extends Record<string, string>>({
  register,
  control,
  errors,
}: FormFieldProps<T>) => {
  const { accounts } = useAccounts();

  return (
    <>
      <InputFormField
        register={register}
        name="name"
        placeholder="Rule Name"
        validation={{ required: "Rule Name is required" }}
        errors={errors}
      />
      <AccountSelect
        control={control}
        name="from_account"
        placeholder="Select From Account"
        items={accounts}
        rules={{ required: "From Account is required" }}
        errors={errors}
      />
      <AccountSelect
        control={control}
        name="to_account"
        placeholder="Select To Account (Optional)"
        items={accounts}
        errors={errors}
      />
      <ConditionSelect
        control={control as Control<T>}
        name="condition_type"
        placeholder="Select Condition"
        items={CONDITION_TYPES}
        rules={{ required: "Condition type is required" }}
        errors={errors}
      />
      <InputFormField
        register={register}
        name="rule_amount"
        placeholder="Rule Amount"
        validation={{
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Please enter a valid number with up to 2 decimal places",
          },
        }}
        errors={errors}
      />
      <InputFormField
        register={register}
        name="pay_amount"
        placeholder="Pay Amount (Optional)"
        validation={{
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Please enter a valid number with up to 2 decimal places",
          },
        }}
        errors={errors}
      />
      <CalendarFormField
        control={control as Control<T>}
        name={"payout_date" as Path<T>}
        errors={errors}
      />
      <PaymentModeSelect
        control={control as Control<T>}
        name="mode_of_payment"
        placeholder="Select payment mode (Optional)"
        items={["RTGS", "NEFT"]}
        errors={errors}
      />
    </>
  );
};

export default FormFields;
