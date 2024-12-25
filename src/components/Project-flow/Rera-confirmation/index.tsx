'use client';
import React, { useState, useEffect, act } from 'react';
import Input from '../../Input/input';
import { useRouter } from 'next/navigation';
import { formTemplate } from '../../../utils/static';
import { useToast } from '../../../utils/show-toasts';
import Link from 'next/link';
import { getAuthToken } from '@/utils/auth-actions';

interface formDataType {
  basicInfo: { [key: string]: string };
  //   promoterDetails: { [key: string]: string };
  //   financialTargets: { [key: string]: string };
  //   plans: { [key: string]: string };
  //   caCertificateDetails: { [key: string]: string };
  //   architect: { [key: string]: string };
  //   engineer: { [key: string]: string };
  //   allotment: { [key: string]: string };
  //   lawyerReport: { [key: string]: string };
  //   contactDetails: { [key: string]: string };
}

export function ReraConfirmation() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<formDataType>({
    basicInfo: {
      details_of_encumbrances: 'test details',
      project_name: 'Rera Project Sample changes',
      rera_reg_no: 'UPRERAPRJ11647',
      project_type: 'Commercial', // choice field
      project_registration_date: '2024-10-02',
      proposed_period: '2024-10-17',
      original_start_date: '2024-10-17',
      modified_start_date: '2024-10-17',
      declared_date_of_completion: '2024-12-26',
      project_location: 'Delhi',
    },
    // promoterDetails: {
    //   promoter_name: 'Skyline Builders Ltd',
    //   promoter_applicant_type: 'Corporate',
    //   promoter_mobile: '+91-9876543210',
    //   promoter_email: 'contact@skylinebuilders.com',
    //   promoter_address: '123 Business Street, City Center, New Delhi, India',
    //   chairman_address: "456 Chairman's Road, Central Business District, New Delhi, India",
    //   number_of_projects_of_the_promoter: '25',
    //   total_complaints_against_the_promoter: '3',
    //   total_no_of_complaints_in_respect_to_this_project: '1',
    // },
    // financialTargets: {
    //   quarter_name: 'Q1 2024',
    //   target_in_rupees: '5000000',
    //   achievements: '4500000',
    // },
    // plans: {
    //   waste_disposal_plan:
    //     'Regular waste collection every Monday and Thursday, with recycling bins placed throughout the site.',
    //   water_supply_plan:
    //     'Onsite water storage tanks with a capacity of 50,000 liters, connected to the municipal water supply.',
    //   electricity_supply_plan:
    //     'Solar panels to provide 30% of the electricity needs, supplemented by grid power for peak hours.',
    //   development_work_plan:
    //     'Completion of foundation work by March 2024, followed by framing and roofing by June 2024.',
    // },
    // caCertificateDetails: {
    //   ca_name: 'John Doe & Associates',
    //   ca_contact_number: '+91-9123456789',
    //   ca_email: 'contact@johndoeassociates.com',
    //   ca_certificate_url: 'https://example.com/certificates/johndoe_ca_cert.pdf',
    //   ca_total_cost_estimated: '2000000',
    //   amount_incurred_till_now: '750000',
    // },
    // architect: {
    //   architect_name: 'Jane Smith Architecture',
    //   architects_certificate: 'https://example.com/certificates/jane_smith_architecture_cert.pdf',
    //   architects_contact_number: '+91-9876543210',
    //   architects_email: 'info@janesmitharchitecture.com',
    //   architects_address: '789 Design Ave, Creative City, New Delhi, India',
    //   coa_registration_number: 'COA-123456',
    //   architect_task: 'Design and oversee the construction of residential units in the project.',
    //   common_areas_and_facilities_amenities:
    //     "Swimming pool, gym, garden area, and children's play area.",
    //   proposed: 'Modern design with eco-friendly materials and energy-efficient systems.',
    //   details: 'The project aims to create sustainable living spaces with ample green areas.',
    //   percentage_of_work_done: '65',
    // },
    // engineer: {
    //   engineer_name: 'Michael Brown Engineering Solutions',
    //   engineers_certificate: 'https://example.com/certificates/michael_brown_engineering_cert.pdf',
    //   engineers_contact_number: '+91-9988776655',
    //   engineers_email: 'contact@michaelbrownengineering.com',
    //   engineers_address: '456 Engineering Way, Tech City, Mumbai, India',
    // },
    // allotment: {
    //   villa_no: 'Villa 101',
    //   saleable_area: '2500',
    //   allotment_project: 'Green Valley Residential Complex',
    //   proforma_of_application_form: 'https://example.com/forms/application_form_villa101.pdf',
    //   proforma_of_allotment_letter: 'https://example.com/letters/allotment_letter_villa101.pdf',
    //   proforma_of_conveyance_deed: 'https://example.com/deeds/conveyance_deed_villa101.pdf',
    // },
    // lawyerReport: {
    //   lawyer_name: 'Sarah Johnson',
    //   lawyer_ref_no: 'LAW123456',
    //   lawyer_contact_number: '+91-9876543210',
    //   lawyer_email: 'sarah.johnson@lawfirm.com',
    //   lawyer_address: '789 Legal Lane, Suite 201, New Delhi, India',
    //   lawyer_certificate: 'https://example.com/certificates/sarah_johnson_certificate.pdf',
    //   affidavit: 'https://example.com/documents/affidavit_villa101.pdf',
    //   authentic_copy_of_approval_of_project:
    //     'https://example.com/documents/project_approval_villa101.pdf',
    //   legal_document_of_agreement_in_case_of_other_land:
    //     'https://example.com/documents/legal_agreement_villa101.pdf',
    // },
    // contactDetails: {
    //   project_coordinator_number: '+91-9876543210',
    //   state: 'Maharashtra',
    //   district: 'Mumbai',
    //   tehsil: 'Bandra',
    // },
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

  const handleNext = () => {
    if (activeSection < 5) {
      setActiveSection(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeSection > 0) {
      setActiveSection(prev => prev - 1);
    }
  };

  const saveReraTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitting the form');

    try {
      const token = await getAuthToken();

      const formDataToSend = new FormData();

      if (file) {
        formDataToSend.append('file', file);
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
          //   promoterDetails: {},
          //   financialTargets: {},
          //   plans: {},
          //   caCertificateDetails: {},
          //   architect: {},
          //   engineer: {},
          //   allotment: {},
          //   lawyerReport: {},
          //   contactDetails: {},
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
    <div className="min-h-screen w-full ">
      <div className="flex justify-between items-center">
        <form onSubmit={saveReraTemplate}>
          <div className="p-6 w-full grid grid-cols-3 ">
            {formTemplate[activeSection].template.map(item => renderFormField(item))}
          </div>
          {formTemplate && (
            <div className="w-full px-6 py-4 flex justify-between ">
              <button
                type="button"
                className="p-2  w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] "
                onClick={handlePrev}
                disabled={activeSection == 0}
              >
                Previous
              </button>
              <button
                type="button"
                className="p-2  w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] "
                onClick={handleNext}
                disabled={activeSection == formTemplate.length}
              >
                Next
              </button>
            </div>
          )}
          {
            //whenever active seciton is at the last element than only submit will get enabled
            formTemplate.length == activeSection && (
              <Link href={`/project-verification/1?tab=legal-flow`}>
                <button
                  type="submit"
                  className="p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
                >
                  Submit
                </button>
              </Link>
            )
          }
        </form>
      </div>
    </div>
  );
}
