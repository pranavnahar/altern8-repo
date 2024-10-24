'use client';
import React, { useState } from 'react';
import Input from '../../components/Input/input';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { formTemplate } from '../../utils/static';
import { getAccessToken } from '../../utils/auth';
import { useToast } from '../../utils/show-toasts';

interface formDataType {
  basicInfo: object;
  promoterDetails: object;
  financialTargets: object;
  plans: object;
  caCertificateDetails: object;
  architect: object;
  engineer: object;
  allotment: object;
  lawyerReport: object;
  contactDetails: object;
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof formDataType) => {
    if (showFileUpload) {
      setFile(e.target.files?.[0]);
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

  // Handle token
  let accessToken = parseCookies().altern8_useraccess; //access token from cookies

  // if not accessToken then ask for refresh token
  const ReplaceTokenOrRedirect = async () => {
    // get new access token with help of Refresh token
    const token = await getAccessToken();
    // if not able to get the token then redirect to login
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const saveReraTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        await ReplaceTokenOrRedirect();
      }

      const formDataToSend = new FormData();

      if (file) {
        formDataToSend.append('file', file);
      }
      const formDataHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
      const defaultHeaders = {
        Authorization: `Bearer ${accessToken}`,
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
        showToast('File Uploaded Successfully!', 'success');
      }
    } catch (err) {
      showToast('Error! Something went wrong.', 'warning');
    }
  };

  return (
    <div className=" min-h-screen p-10 w-full shadow-lg outline-none focus:outline-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
      <div className="">
        <h3 className="text-3xl ml-10 text-gray-200 font-semibold">Add Template</h3>
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
                className="p-3 cursor-pointer w-fit bg-[#1565c0] text-white rounded-3xl flex item-center justify-center"
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
          <div className="text-white text-center">(or)</div>
          <div className=" p-6 grid grid-cols-3">
            {formTemplate.map(item => (
              <Input
                key={item.name}
                type={item.type}
                label={item.label}
                placeholder={item.placeholder}
                name={item.name}
                onChange={e => onChange(e, item.formData as keyof formDataType)}
                //value={formData?.[item.formData]?.[item.name] || ''}
                required={item?.required}
                id=""
              />
            ))}
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
