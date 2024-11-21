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
import { Switch } from "@/components/ui/switch";
import { createTrancheRule, updateTrancheRule } from '../_actions/tranche-rules.actions';
import { useToast } from '@/utils/show-toasts';

interface TrancheRuleData {
  project: number;
  tranche: number;
  rule_type: string;
  description: string;
  is_active: boolean;
  input_value: {
    threshold: number;
  };
  id?: number;
}

interface Props {
  projectId: number;
  trancheId: number;
  mode?: 'create' | 'edit';
  initialData?: TrancheRuleData;
  onSuccess?: () => void;
}

const TrancheRuleSheet = ({ projectId, trancheId, mode = 'create', initialData, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    ruleType: '',
    description: '',
    threshold: '',
    isActive: false
  });
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        ruleType: initialData.rule_type || '',
        description: initialData.description || '',
        threshold: initialData.input_value.threshold.toString() || '',
        isActive: initialData.is_active
      });
    }
  }, [mode, initialData]);

  const handleSubmit = async () => {
    setIsLoading(true);

    const payload: TrancheRuleData = {
      project: projectId,
      tranche: trancheId,
      rule_type: formData.ruleType,
      description: formData.description,
      is_active: formData.isActive,
      input_value: {
        threshold: parseInt(formData.threshold, 10)
      }
    };

    if (mode === 'edit' && initialData?.id) {
      payload.id = initialData.id;
    }

    try {
      const result = mode === 'create' ? await createTrancheRule(payload) : await updateTrancheRule(payload);
      showToast({
        message: `Rule ${mode === 'create' ? 'created' : 'updated'}`,
        type: "success"
      })
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      showToast({
        message: `Failed to ${mode} tranche rule`,
        type: "error"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="xs" className='text-xs'>
          {mode === 'create' ? 'Add Rule' : 'Edit Rule'}
        </Button>
      </SheetTrigger>
      <SheetContent className='background border-none'>
        <SheetHeader>
          <SheetTitle className='text-2xl text-neutral-200'>
            {mode === 'create' ? 'Create New Rule' : 'Edit Rule'}
          </SheetTitle>
          <SheetDescription>
            {mode === 'create'
              ? 'Add a new rule to manage tranche behavior'
              : 'Modify existing rule parameters'}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rule-type" className="text-right">
              Rule Type
            </Label>
            <Input
              id="rule-type"
              className="col-span-3"
              value={formData.ruleType}
              onChange={(e) => setFormData(prev => ({ ...prev, ruleType: e.target.value }))}
              placeholder="Enter rule type"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              className="col-span-3"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter rule description"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="threshold" className="text-right">
              Threshold
            </Label>
            <Input
              id="threshold"
              type="number"
              className="col-span-3"
              value={formData.threshold}
              onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
              placeholder="Enter threshold value"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is-active" className="text-right">
              Active
            </Label>
            <div className="col-span-3">
              <Switch
                id="is-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={handleSubmit}
            className='w-full flex justify-center'
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              mode === 'create' ? 'Create Rule' : 'Save Changes'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TrancheRuleSheet;
