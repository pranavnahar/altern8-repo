"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTrancheTask, updateTrancheTask } from '../_actions/tranche-tasks.actions';
import { useToast } from '@/utils/show-toasts';
import { IconChevronRight } from '@tabler/icons-react';

interface TrancheTaskData {
  id?: number;
  tranche: number;
  project: number;
  owner: string;
  status: string;
  original_start_date: string;
  original_completion_date: string;
}

interface Props {
  projectId: number;
  trancheId: number;
  mode?: 'create' | 'edit';
  initialData?: TrancheTaskData;
  onSuccess?: () => void;
}

const TrancheTaskSheet = ({ projectId, trancheId, mode = 'create', initialData, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    owner: '',
    status: '',
    originalStartDate: '',
    originalCompletionDate: '',
  });
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        owner: initialData.owner || '',
        status: initialData.status || '',
        originalStartDate: initialData.original_start_date || '',
        originalCompletionDate: initialData.original_completion_date || '',
      });
    }
  }, [mode, initialData]);

  const handleSubmit = async () => {
    setIsLoading(true);

    const payload: TrancheTaskData = {
      tranche: trancheId,
      project: projectId,
      owner: formData.owner,
      status: formData.status,
      original_start_date: formData.originalStartDate,
      original_completion_date: formData.originalCompletionDate,
    };

    if (mode === 'edit' && initialData?.id) {
      payload.id = initialData.id;
    }

    try {
      const result = mode === 'create' ? await createTrancheTask(payload) : await updateTrancheTask(payload);
      showToast({
        message: `Task ${mode === 'create' ? 'created' : 'updated'}`,
        type: "success"
      })
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      showToast({
        message: `Failed to ${mode} tranche task`,
        type: "error"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="xs" className="text-xs">
          {mode === 'create' ? 'Add Task' : 'Edit Task'}
        </Button>
      </SheetTrigger>
      <SheetContent className="background border-none">
        <SheetHeader>
          <SheetTitle className="text-2xl text-neutral-200">
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </SheetTitle>
          <SheetDescription>
            {mode === 'create'
              ? 'Add a new task to the tranche'
              : 'Modify existing task details'}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right">
              Owner
            </Label>
            <Input
              id="owner"
              className="col-span-3"
              value={formData.owner}
              onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
              placeholder="Enter task owner"
              disabled={isLoading}
            />
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input
              id="status"
              className="col-span-3"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              placeholder="Enter task status"
              disabled={isLoading}
            />
          </div>

          <div className="grid items-center gap-4">
            <Label className="text-left">
              Original Start Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="expandIcon"
                    iconPlacement='right'
                    Icon={IconChevronRight}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !formData.originalStartDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {formData.originalStartDate ? (
                      format(new Date(formData.originalStartDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.originalStartDate ? new Date(formData.originalStartDate) : undefined}
                    onSelect={(date) =>
                      setFormData(prev => ({
                        ...prev,
                        originalStartDate: date ? format(date, "yyyy-MM-dd") : ""
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid items-center gap-4">
            <Label className="text-left">
              Original Completion Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="expandIcon"
                    iconPlacement='right'
                    Icon={IconChevronRight}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !formData.originalCompletionDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {formData.originalCompletionDate ? (
                      format(new Date(formData.originalCompletionDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.originalCompletionDate ? new Date(formData.originalCompletionDate) : undefined}
                    onSelect={(date) =>
                      setFormData(prev => ({
                        ...prev,
                        originalCompletionDate: date ? format(date, "yyyy-MM-dd") : ""
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={handleSubmit}
            className="w-full flex justify-center"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              mode === 'create' ? 'Create Task' : 'Save Changes'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TrancheTaskSheet;
