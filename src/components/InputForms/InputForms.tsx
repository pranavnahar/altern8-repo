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
    (acceptedFiles: File[], fieldName: string) => {
      setFormData(prevFormData => ({
        ...prevFormData,
        [fieldName]: [...((prevFormData[fieldName] as File[]) || []), ...acceptedFiles],
      }));
    },
    [setFormData],
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>, type: keyof FormData) => {
    e.preventDefault();
    setFormData(prevFormData => ({
      ...prevFormData,
      [type]: e.target.value,
    }));
  };

  const radioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [item.name]: value,
    }));
  };

  const dateOnChange = (e: Date | undefined, type: keyof FormData) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [type]: e,
    }));
  };

  const renderFileUploadOptions = () => {
    const selectedOption = formData[item.name as keyof FormData];
    const fileOptions = [
      'Title deed',
      'FMB',
      'TSLR Records',
      'Patta/Chitta',
      'Guideline value',
      'Mortage report',
      'Property tax receipt',
    ];

    if (
      selectedOption === 'I will provide all the documents' ||
      selectedOption === 'I have partial documents which ill provide'
    ) {
      return (
        <>
          <p className="text-sm text-yellow-500">
            {selectedOption === 'I will provide all the documents'
              ? 'Please upload all the required files:'
              : 'Upload any documents you have (Optional):'}
          </p>
          {fileOptions.map(label => (
            <FileUpload key={label} onDrop={files => onDrop(files, label)} label={label} />
          ))}
        </>
      );
    }
    return null;
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
          date={(formData[item.name as keyof FormData] as any) || new Date()}
          handleDateChange={e => dateOnChange(e, item.name as keyof FormData)}
        />
      ) : item?.type === 'file' ? (
        <FileUpload onDrop={files => onDrop(files, item.name)} />
      ) : item?.type === 'checkbox' ? (
        Array.isArray(item.values) &&
        item.values.map(value => (
          <div key={value} className="flex items-center mb-2 text-white text-xs">
            <input
              type="radio"
              name={item.name}
              value={value}
              onChange={radioChange}
              checked={formData[item.name as keyof FormData] === value}
              id={value}
            />
            <label htmlFor={value} className="ml-2">
              {value}
            </label>
          </div>
        ))
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
      {renderFileUploadOptions()}
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
    console.log("the rabelt api is: ", URL);
  }
  if (type === 'tranches') {
    URL = `${apiUrl}/rablet-api/projects/${id}/tranches/2/documents/`; //should be dynamic tranche id
    console.log("the rabelt api is running and url is: ", URL);
  } else{
    console.log("none matched the route");
    URL = `${apiUrl}/rablet-api/projects/`;
    console.log("the url formed is: ", URL);
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
  
    // Validate form data
    if (!formData.sale_deed) {
      return toast('Error', { description: 'Sales Deed is required' });
    }
    if (!formData.encumberance_certificate) {
      return toast('Error', { description: 'Encumberance certificate is required' });
    }
  
    console.log('this part of the code is running');
  
    try {
      console.log("admin access before block running");
  
      // Log altern8_adminaccess token
      console.log("Token used for authorization: ", altern8_adminaccess);
  
      if (!altern8_adminaccess) {
        console.log("admin access value is: ", altern8_adminaccess);
        await ReplaceTokenOrRedirect();
        console.log('admin access');
      } else {
        console.log("else block of altern admin access");
      }
  
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (Object.hasOwnProperty.call(formData, key)) {
          const value = formData[key];
          if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach(file => {
              formDataToSend.append(key, file);
            });
          } else {
            formDataToSend.append(key, value as string);
          }
        }
      }
  
      console.log('form data that will be sent is: ', formDataToSend);
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
      }
  
      // Make API call
      let response = await fetch(URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${altern8_adminaccess}`,
        },
        body: formDataToSend,
      });
  
      console.log('raw response is: ', response);
  
      if (response.ok) {
        console.log('response ok function');
        await response.json();
        setFormData({});
        toast('Document saved!', {
          description: 'Success',
        });
      } else {
        const errorResponse = await response.json(); // Extract the error message
        console.error('Upload error:', errorResponse.message || response.status);
        console.error('Failed to upload:', response.status);
        toast('Failure', {
          description: 'Something went wrong',
        });
      }
    } catch (error) {
      console.log('this part of the code is raising the error in catch block');
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
              <Button variant={'outline'} className="bg-transparent text-white w-32">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
