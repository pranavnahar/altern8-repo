import React from "react";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import useLedgerRules from "../../../hooks/ledger/rule-manager/use-ledger-rules";
import { showToast } from "../../../Utils/showToast";
import FormFields from "./fields/form-fields";

const RuleForm: React.FC<{
  mode: string;
  rule?: {
    name: string;
    from_account: string;
    to_account: string;
    condition_type: string;
    rule_amount: string;
    pay_amount: string;
    payout_date: string;
    mode_of_payment: string;
  };
  ruleID: string;
  handleFetchRules: () => void;
  onClose: () => void;
}> = ({ mode, rule, ruleID, handleFetchRules, onClose }) => {
  const isEditMode = mode === "edit";
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: rule?.name || "",
      from_account: rule?.from_account || "",
      to_account: rule?.to_account || "",
      condition_type: rule?.condition_type || "greater_than",
      rule_amount: rule?.rule_amount || "",
      pay_amount: rule?.pay_amount || "",
      payout_date: rule?.payout_date ? new Date(rule.payout_date) : new Date(),
      mode_of_payment: rule?.mode_of_payment || "",
    },
  });

  const { handleAddRules, handleUpdateRules } = useLedgerRules();

  const onFormSubmit = async (data: {
    [key: string]: string | Date | number | null;
  }) => {
    try {
      if (data.payout_date) {
        data.payout_date = (data.payout_date as Date)
          .toISOString()
          .slice(0, 10);
      }
      data.from_account = Number(data.from_account);
      data.to_account = data.to_account ? Number(data.to_account) : null;
      data.rule_amount = Number(data.rule_amount);
      data.pay_amount = data.pay_amount ? Number(data.pay_amount) : null;

      let success = false;
      if (isEditMode) {
        success = await handleUpdateRules(data, ruleID);
      } else {
        success = await handleAddRules(data);
      }

      if (success) {
        onClose();
        await handleFetchRules();
      } else {
        showToast("Some error occurred", "false");
      }
    } catch (error) {
      console.error("Error in onFormSubmit:", error);
    } finally {
      reset();
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-xl font-medium text-white">
          {isEditMode ? "Edit Rule" : "Create New Rule"}
        </SheetTitle>
        <SheetDescription>
          {isEditMode
            ? "Modify the rule details."
            : "Fill in the details to create a new rule."}
        </SheetDescription>
      </SheetHeader>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="w-full mt-4 space-y-4"
      >
        <FormFields
          register={
            register as unknown as
              | UseFormRegister<Record<string, string>>
              | undefined
          }
          control={
            control as unknown as Control<Record<string, string>> | undefined
          }
          errors={errors as unknown as FieldErrors<Record<string, string>>}
          name=""
          placeholder=""
        />
        <div className="flex justify-end gap-3">
          {isEditMode && (
            <SheetClose>
              <Button
                type="button"
                className="w-full mt-5 bg-transparent border-2 hover:bg-transparent border-primary"
              >
                Cancel
              </Button>
            </SheetClose>
          )}
          <Button
            type="submit"
            className="w-full mt-5 bg-primary hover:bg-primary/90"
          >
            {isEditMode ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RuleForm;
