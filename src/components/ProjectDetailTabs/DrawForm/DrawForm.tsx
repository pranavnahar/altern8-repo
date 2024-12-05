import React, { FormEvent, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { useParams } from 'next/navigation';
import { useToast } from '../../../utils/show-toasts';
import { getAuthToken } from '@/utils/auth-actions';

interface DrawFormTypes {
  open: boolean;
  onOpenChange: (item: boolean) => void;
}

export const DrawForm = ({ open, onOpenChange }: DrawFormTypes) => {
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const { showToast } = useToast()
  const [submissionDate, setSubmissionDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [trancheTotal, setTrancheTotal] = useState<string>('');

  const [markChecked, setMarkChecked] = useState<boolean>(false);

  const handleSubmissionDate = (day: Date | undefined) => {
    if (day) setSubmissionDate(day);
  };

  const handleEndDate = (day: Date | undefined) => {
    if (day) setEndDate(day);
  };

  const [idParam, setIdParam] = useState<string | null>(null);
  const params = useParams();
  useEffect(() => {
    const fetchTemplateId = async () => {
      const templateId = params?.id;

      if (templateId) {
        setIdParam(Array.isArray(templateId) ? templateId.join('') : templateId.trim());
      }
    };

    fetchTemplateId();
  }, [params?.id]);
  console.log(idParam);

  const handleSubmit = async () => {
    const formData = {
      project: idParam,
      tranche_name: name,
      tranche_number: Id,
      submission_date: submissionDate,
      tranche_total: trancheTotal,
      tranche_end_date: endDate,
    };
    console.log(formData);

    try {
      const token = await getAuthToken()
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rablet-api/projects/${idParam}/tranches/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        showToast({
          message: 'Document saved',
          type: "error"
        })

      } else {
        showToast({
          message: 'Failed to add profile data',
          type: "error"
        })
      }
    } catch (error) {
      showToast({
        message: 'Failed to add profile data',
        type: "error"
      })
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-auto w-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-0">
        <SheetHeader>
          <SheetTitle className="text-white">Create New Tranche</SheetTitle>
        </SheetHeader>
        <div className="text-white my-2">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="tranche_name">Tranche Name</Label>
              <Input
                value={name}
                className="text-black"
                placeholder="Name"
                id="tranche_name"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tranche_name">Tranche Id</Label>
              <Input
                value={Id}
                className="text-black"
                placeholder="Id"
                id="tranche_id"
                onChange={e => setId(e.target.value)}
              />
            </div>
            <div className="my-2">
              <Label>Submission Date</Label>
              <DatePicker date={submissionDate} handleDateChange={handleSubmissionDate} />
            </div>
            {/* <div>
              <div className="flex items-center justify-between">
                <Label>Submitter</Label>
                <Button variant={"link"} className=" text-blue-500">
                  Add Organization
                </Button>
              </div>
              <Input
                value={submitterName}
                className="text-black"
                placeholder="Name"
                id="tranche_name"
                onChange={(e) => setSubmitterName(e.target.value)}
              />
            </div> */}

            <div className="my-2">
              <Label htmlFor="tranche_total" className="mb-2">
                Tranche Total
              </Label>

              <Input
                value={trancheTotal}
                type="number"
                className="text-black"
                placeholder="Total"
                id="tranche_total"
                onChange={e => setTrancheTotal(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="Mark"
                className="border-white"
                checked={markChecked}
                onClick={() => setMarkChecked(!markChecked)}
              />
              <label
                htmlFor="Mark"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark Tranche 3 Funded on
              </label>
            </div>

            <div className="my-2">
              <DatePicker date={submissionDate} handleDateChange={handleSubmissionDate} />
            </div>

            <div className="my-2">
              <Label>Tranche End Date</Label>
              <DatePicker date={endDate} handleDateChange={handleEndDate} />
            </div>

            <div className="flex justify-end">
              <Button onClick={() => handleSubmit()}>Submit</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
