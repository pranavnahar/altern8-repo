/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FormInput } from '../LedgerTypeTable/Filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import DatePicker from '../DatePicker/DatePicker';
import FileUpload from '../FileUpload/FileUpload';
import { apiUrl, getAccessToken } from '../../Utils/auth';
import { parseCookies } from 'nookies';
import { useParams, useRouter } from 'next/navigation';

interface InputFormsTypes {
  open: boolean;
  onOpenChange: () => void;
  data: FormInput[];
  title: string;
  submitAction?: () => void;
  type?: string;
}

type FormData = {
  [key: string]: string | number | Date | undefined | File[];
};

type RenderInputsProps = {
  item: FormInput;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

export const RenderInputs = ({ item, formData, setFormData }: RenderInputsProps) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFormData(prevFormData => ({
        ...prevFormData,
        [item.name]: acceptedFiles,
      }));
    },
    [item, setFormData],
  );

  //onchange function for inputs
  const onChange = (e: ChangeEvent<HTMLInputElement>, type: keyof FormData) => {
    e.preventDefault();
    setFormData(prevFormData => ({
      ...prevFormData,
      [type]: e.target.value,
    }));
  };

  const dateOnChange = (e: Date | undefined, type: keyof FormData) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [type]: e,
    }));
  };

  return (
    <>
      <Label htmlFor={item?.name} className="text-white my-2">
        {item?.label} {item?.required && <span className="text-red-500">*</span>}
      </Label>
      {item?.type === 'dropdown' ? (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={item?.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(item.values) &&
              item.values.length > 0 &&
              item.values.map((dpItem, key) => (
                <SelectItem value={dpItem} key={key}>
                  {dpItem}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ) : item?.type === 'datepicker' ? (
        <DatePicker
          date={
            (formData[item.name as keyof FormData] as any) || new Date()
            // Used ANY here because getting error and cant find solution for now.
          }
          handleDateChange={e => dateOnChange(e, item.name as keyof FormData)}
        />
      ) : item?.type === 'file' ? (
        <FileUpload onDrop={onDrop} />
      ) : (
        <Input
          type={item.type}
          placeholder={item.placeholder}
          name={item.name}
          onChange={e => onChange(e, item.name as keyof FormData)}
          value={formData?.[item.name as keyof FormData] as string}
          required={item?.required}
          min={item.min}
          max={item.max}
        />
      )}
    </>
  );
};

export const InputForms = ({
  open,
  onOpenChange,
  data,
  title,
  type,
  submitAction = () => console.log('Function not passed'),
}: InputFormsTypes) => {
  const ReplaceTokenOrRedirect = async (): Promise<void> => {
    const token = await getAccessToken();
    if (!token) {
      window.location.replace('/login');
    } else {
      altern8_adminaccess = token;
    }
  };
  // Form Input Sections as object
  const [formData, setFormData] = useState<FormData>({});
  let altern8_adminaccess = parseCookies().altern8_adminaccess;
  const [id, setId] = useState<string | null>(null);
  const params = useParams();
  let URL = '';
  if (type === 'documents') {
    URL = `${apiUrl}/rablet-api/projects/${id}/documents/`;
  }
  if (type === 'tranches') {
    URL = `${apiUrl}/rablet-api/projects/${id}/tranches/2/documents/`; //should be dynamic tranche id
  }
  useEffect(() => {
    const fetchTemplateId = async () => {
      const templateId = params?.id;

      if (templateId) {
        setId(Array.isArray(templateId) ? templateId.join('') : templateId.trim());
      }
    };

    fetchTemplateId();
  }, [params?.id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOpenChange();
    console.log(formData);

    try {
      if (!altern8_adminaccess) {
        await ReplaceTokenOrRedirect();
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (Object.hasOwnProperty.call(formData, key)) {
          const value = formData[key];
          if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach(file => {
              formDataToSend.append('file', file);
            });
          } else {
            formDataToSend.append(key, value as string);
          }
        }
      }

      let response = await fetch(URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${altern8_adminaccess}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        await response.json();
        setFormData({});
        toast('Document saved!', {
          description: 'Success',
        });
      } else {
        console.error('Failed to upload:', response.status);
        toast('Failure', {
          description: 'Something went wrong',
        });
      }
    } catch (error) {
      console.log('Error during upload:', error);
      toast('Error', {
        description: 'Something went wrong',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-auto w-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-0">
        <SheetHeader>
          <SheetTitle className="text-white">{title}</SheetTitle>
        </SheetHeader>
        <div className="text-white my-2">
          <form className="text-black flex flex-col gap-2" onSubmit={handleSubmit}>
            {/* formInputs  */}
            {data?.map((item: FormInput, index: number) => (
              <RenderInputs item={item} key={index} formData={formData} setFormData={setFormData} />
            ))}
            <div className="flex items-center justify-end gap-3 my-3">
              <Button
                variant={'outline'}
                className="bg-transparent text-white w-32"
                onClick={submitAction}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
