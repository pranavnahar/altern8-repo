import React from "react";
import { useForm } from "react-hook-form";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useToast } from "../../../../utils/show-toasts";
import { addProjectSummary } from "../../../../app/(dashboard)/project/actions/add-project-summary.actions";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../../../components/ui/sheet";
import { Button } from "../../../../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";

const AddSummarySheet = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { showToast } = useToast();
  const params = useParams();
  const projectId = Number(params.id);

  const form = useForm({
    defaultValues: {
      project: projectId,
      interest_reserves: 0,
      development_fees: 0,
      tranche_inspector_fees: 0,
      legal: 0,
      architecture: 0,
      engineering: 0,
      title_insurance: 0,
      environmental: 0,
      soft_cost_contingency: 0,
      site_acquisition: 0,
      general_requirements: 0,
      concrete: 0,
      masonry: 0,
      metal: 0,
      wood_plastics: 0,
      thermal_moistures: 0,
      openings: 0,
      finishes: 0,
      facilities: 0,
    },
  });

  const onSubmit = async (data: Record<string, any>) => {
    const emptyFields = Object.entries(data).filter(([key, value]) =>
      key !== 'project' && (value === "" || value === null || value === 0)
    );

    if (emptyFields.length > 0) {
      showToast({
        message: "Please fill all the fields",
        type: "info"
      });
      return;
    }

    try {
      const response = await addProjectSummary(projectId, data);

      if (response.success) {
        showToast({
          message: response.message,
          type: "success"
        });
        setIsOpen(false);
      } else {
        let toastType: "error" | "warning" = "error";
        if (response.status >= 400 && response.status < 500) {
          toastType = "warning";
        }
        showToast({
          message: response.message,
          type: toastType
        });
      }
    } catch (error) {
      console.error("Error updating project costs:", error);
      showToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="expandIcon" size="xs" Icon={ChevronRight} iconPlacement="right" className="text-sm">Add Summary</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto background border-none">
        <SheetHeader>
          <SheetTitle className="text-zinc-200">Update Project Costs</SheetTitle>
          <SheetDescription>Fill in the details to update project costs.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {Object.keys(form.getValues()).filter(key => key !== 'project').map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddSummarySheet;
