import React, { FormEvent, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { toast } from 'react-toastify';
import { apiUrl, getAccessToken } from '../../../utils/auth';
import { parseCookies } from 'nookies';
import { useParams } from 'next/navigation';

interface DrawFormTypes {
  open: boolean;
  onOpenChange: (item: boolean) => void;
}

export const DrawForm = ({ open, onOpenChange }: DrawFormTypes) => {
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
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

  let altern8_adminaccess = parseCookies().altern8_adminaccess;

  const ReplaceTokenOrRedirect = async (): Promise<void> => {
    const token = await getAccessToken();
    if (!token) {
      window.location.replace('/login');
    } else {
      altern8_adminaccess = token;
    }
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
      if (!altern8_adminaccess) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/rablet-api/projects/${idParam}/tranches/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${altern8_adminaccess}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/rablet-api/projects/${idParam}/tranches/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${altern8_adminaccess}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        toast('Document saved !');
      } else {
        console.error('Failed to add profile data:', response.status);
        toast('Failure');
      }
    } catch (error) {
      console.log('Error during adding profile data:', error);
      toast('UI Is Initialized');
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
