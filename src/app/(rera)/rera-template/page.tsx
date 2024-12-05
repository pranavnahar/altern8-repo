'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/Input/input';
import { useRouter } from 'next/navigation';
import { formTemplate } from '@/utils/static';
import { useToast } from '@/utils/show-toasts';
import { getAuthToken } from '@/utils/auth-actions';

interface formDataType {
  basicInfo: { [key: string]: string };
  promoterDetails: { [key: string]: string };
  financialTargets: { [key: string]: string };
  plans: { [key: string]: string };
  caCertificateDetails: { [key: string]: string };
  architect: { [key: string]: string };
  engineer: { [key: string]: string };
  allotment: { [key: string]: string };
  lawyerReport: { [key: string]: string };
  contactDetails: { [key: string]: string };
}

export default function page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [formData, setFormData] = useState<formDataType>({
    basicInfo: {},
    promoterDetails: {},
    financialTargets: {},
    plans: {},
    caCertificateDetails: {},
    architect: {},
    engineer: {},
    allotment: {},
    lawyerReport: {},
    contactDetails: {},
  });

  const [showFileUpload, setShowFileUpload] = useState(false);
  const [file, setFile] = useState<File | null>();
  const { showToast } = useToast();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: keyof formDataType,
  ) => {
    if (showFileUpload) {
      const target = e.target as HTMLInputElement;
      setFile(target.files?.[0]);
    } else {
      setFormData({
        ...formData,
        [type]: { ...formData[type], [e.target.name]: e.target.value },
      });
    }
  };

  const handleDownload = () => {
    document.getElementById('download-link')!.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const saveReraTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitting the form');

    try {
      const token = await getAuthToken()
      const formDataToSend = new FormData();

      if (file) {
        formDataToSend.append('file', file);
        console.log('file was uploaded by the user', file);
      } else {
        const requiredFields = [
          { field: 'user_id', label: 'User ID' },
          { field: 'project_name', label: 'Project Name' },
          { field: 'project_type', label: 'Project Type' },
          { field: 'original_start_date', label: 'Original Start Date' },
          { field: 'declared_date_of_completion', label: 'Declared Date of Completion' },
          { field: 'project_location', label: 'Project Location' },
        ];

        for (const { field, label } of requiredFields) {
          const value = formData.basicInfo[field];
          if (!value || value.trim() === '') {
            console.log('some fields were missing, need to be entered');
            showToast({
              message: `Please enter ${label}`,
              type: 'warning',
            });
            return;
          }
        }
      }

      const formDataHeaders = {
        Authorization: `Bearer ${token}`,
      };
      const defaultHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${apiUrl}/rera-api/rera-templates/`, {
        method: 'POST',
        headers: file ? formDataHeaders : defaultHeaders,
        body: file ? formDataToSend : JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          basicInfo: {},
          promoterDetails: {},
          financialTargets: {},
          plans: {},
          caCertificateDetails: {},
          architect: {},
          engineer: {},
          allotment: {},
          lawyerReport: {},
          contactDetails: {},
        });
        setFile(null);
        showToast({
          message: 'File and all the data uploaded successfully!',
          type: 'success',
        });
      }
    } catch (err) {
      showToast({
        message: 'Error! Something went wrong.',
        type: 'warning',
      });
    }
  };

  const renderFormField = (item: any) => {
    // Add type checking for item
    if (!item || !item.formData || !item.name) {
      console.warn('Invalid form field configuration:', item);
      return null;
    }

    // Safely access the nested value
    const getValue = () => {
      try {
        return formData[item.formData as keyof formDataType]?.[item.name] || '';
      } catch (error) {
        console.warn(`Error accessing form data for ${item.formData}.${item.name}:`, error);
        return '';
      }
    };

    // label with asterisk
    const label = (
      <>
        {item.label}
        {item.required && <span className="text-red-500 ml-1">*</span>} {/* Styled asterisk */}
      </>
    );

    if (item.type === 'select') {
      return (
        <div className="mb-0 mt-9 mx-2 ml-8 uppercase" key={item.name}>
          <label className="block font-bold mt-0 text-gray-400 text-xs leading-5 uppercase mb-2">
            {label}
          </label>
          <select
            name={item.name}
            onChange={e => onChange(e, item.formData as keyof formDataType)}
            value={getValue()}
            className="shadow appearance-none border rounded w-[94%] py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
            required={false}
          >
            <option value="">{item.placeholder}</option>
            {item.options?.map((option: { value: string; label: string }) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <Input
        key={item.name} // Ensure unique keys if necessary
        type={item.type}
        //  @ts-ignore
        label={label} // Used ignore here because * needed to be shown to the user for visual cues
        placeholder={item.placeholder}
        name={item.name}
        onChange={e => onChange(e, item.formData as keyof formDataType)}
        value={getValue()}
        required={false}
        id=""
      />
    );
  };

  return (
    <div className="min-h-screen p-10 w-full shadow-lg outline-none focus:outline-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
      <div className="">
        <h3 className="text-3xl ml-10 text-gray-200 font-semibold">Add Template</h3>
        <p className="text-zinc-400 ml-10 mt-5">
          If you already have a template available, you can upload it here. If not, you can download
          a sample, fill it out, and then click on the submit button below. Alternatively, if you prefer to fill in all the details manually, you can complete the form below and then submit.
        </p>
      </div>
      <div className="flex justify-between items-center">
        <form onSubmit={saveReraTemplate}>
          <div className="p-6 flex justify-between items-center">
            <Input
              type="file"
              name="file"
              placeholder="Upload Template"
              label="Upload Template"
              onChange={handleFileChange}
              accept=".xls,.xlsx"
              required={false}
              id=""
            />
            <div>
              <div
                onClick={handleDownload}
                className="p-3 mr-5 cursor-pointer w-fit bg-[#1565c0] text-white rounded-3xl flex item-center justify-center"
              >
                Download Sample Template
              </div>
              <a
                id="download-link"
                href="/rera/sample_rera_template.xlsx"
                download
                className="hidden"
              >
                Download
              </a>
            </div>
          </div>
          <div className="flex items-center text-white text-center">
            <div className="flex-grow h-px bg-gradient-to-l from-gray-500 to-transparent"></div>
            <div className="px-4 text-zinc-400">OR</div>
            <div className="flex-grow h-px bg-gradient-to-r from-gray-500 to-transparent"></div>
          </div>
          <div className="p-6 grid grid-cols-3">
            {formTemplate.map(item => renderFormField(item))}
          </div>
          <button
            type="submit"
            className="p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
