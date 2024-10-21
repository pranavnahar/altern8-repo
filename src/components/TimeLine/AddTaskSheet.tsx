import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { fetchBorrowersUids } from "../../app/(dashboard)/projects/actions";
import { useToast } from "../../Utils/show-toasts";
import { ChevronRight } from "lucide-react";
import { addProjectTask } from "../../app/(dashboard)/project/actions/add-project-task.actions";
import { useParams } from "next/navigation";
import { format } from 'date-fns';

type Borrower = {
  uid: string;
  company_name: string;
};

type BorrowersList = Borrower[];

type ProjectStatus = {
  owner: string;
  status: string;
  original_start_date: Date;
  original_completion_date: Date;
  completion_date_variance: number;
};

const projectStatuses = ["Not Started", "In Progress", "Completed", "On Hold"];

const AddTaskSheet = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { showToast } = useToast();
  const [users, setUsers] = useState<BorrowersList>([]);
  const form = useForm<ProjectStatus>({
    defaultValues: {
      owner: "",
      status: "",
      original_start_date: new Date(),
      original_completion_date: new Date(),
      completion_date_variance: 0,
    },
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data: BorrowersList = await fetchBorrowersUids();
        setUsers(data);
      } catch (error) {
        showToast({
          message: "Failed to fetch users. Please try again.",
          type: "error",
        });
      }
    };

    loadUsers();
  }, []);

  const params = useParams();
  const projectId = Number(params.id);

  const onSubmit = async (data: ProjectStatus) => {
    if (!projectId) {
      showToast({
        message: "Invalid project ID",
        type: "error"
      });
      return;
    }
    try {
      const result = await addProjectTask(projectId, data);
      if (result.success) {
        showToast({
          message: "Project status updated successfully",
          type: "success"
        });
        setIsOpen(false);
        form.reset();
      } else {
        showToast({
          message: result.error || "Failed to update project status",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      showToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="expandIcon" size="sm" Icon={ChevronRight} iconPlacement="right" className="text-sm h-10 max-w-max ml-auto">
          Add task
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto background border-none">
        <SheetHeader>
          <SheetTitle>Update Project Status</SheetTitle>
          <SheetDescription>Update the status and details of the project.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.uid} value={user.uid}>
                          {user.uid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="original_start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Original Start Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="original_completion_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Original Completion Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                    disabled={(date) =>
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completion_date_variance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Date Variance (in days)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Update Project Status</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddTaskSheet;
