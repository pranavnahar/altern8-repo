import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import RuleForm from "./rule-form";
import { Plus, Settings2 } from "lucide-react";

const RuleSheet: React.FC<{
  mode: string;
  rule: {
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
}> = ({ mode, rule, ruleID, handleFetchRules }) => {
  const isEditMode = mode === "edit";
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger>
        <Button
          size={isEditMode ? "lg" : "sm"}
          className={`flex gap-2 text-${
            isEditMode ? "xs" : "sm"
          } text-white rounded ${
            isEditMode
              ? "bg-primary hover:bg-primary/90"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isEditMode ? (
            <Settings2 className="my-auto size-4" />
          ) : (
            <Plus className="my-auto size-4" />
          )}
          {isEditMode ? "Edit" : "Create New Rule"}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col min-h-screen border-none [background:linear-gradient(269.75deg,_#011049,#19112f_25.75%,#251431_51.79%,#301941_64.24%,_#6e3050)] p-4">
        <ScrollArea>
          <div className="pl-2 pr-3">
            <RuleForm
              mode={mode}
              rule={rule}
              ruleID={ruleID}
              handleFetchRules={handleFetchRules}
              onClose={() => setIsSheetOpen(false)}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RuleSheet;
