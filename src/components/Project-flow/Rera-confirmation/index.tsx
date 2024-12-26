'use client';
import React, { useState, useEffect, act } from 'react';
import Input from '../../Input/input';
import { useRouter } from 'next/navigation';
import { formTemplate } from '../../../utils/static';
import { useToast } from '../../../utils/show-toasts';
import Link from 'next/link';
import { getAuthToken } from '@/utils/auth-actions';
import { ApiCall } from './action';
import { BreadcrumbLink } from '@/components/ui/breadcrumb';
import { formDataType } from './types';

export function ReraConfirmation() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<formDataType>({
    basicInfo: {
      details_of_encumbrances: '',
      project_name: '',
      rera_reg_no: '',
      project_type: 'Commercial', // choice field
      project_registration_date: '',
      proposed_period: '',
      original_start_date: '',
      modified_start_date: '',
      declared_date_of_completion: '',
      project_location: '',
    },
    promoterDetails: {
      promoter_name: '',
      promoter_applicant_type: '',
      promoter_mobile: '',
      promoter_email: '',
      promoter_address: '',
      chairman_address: '',
      number_of_projects_of_the_promoter: '',
      total_complaints_against_the_promoter: '',
      total_no_of_complaints_in_respect_to_this_project: '',
    },
    financialTargets: {
      quarter_name: '',
      target_in_rupees: '',
      achievements: '',
    },
    plans: {
      waste_disposal_plan: '',
      water_supply_plan: '',
      electricity_supply_plan: '',
      development_work_plan: '',
    },
    caCertificateDetails: {
      ca_name: '',
      ca_contact_number: '',
      ca_email: '',
      ca_certificate_url: '',
      ca_total_cost_estimated: '',
      amount_incurred_till_now: '',
    },
    architect: {
      architect_name: '',
      architects_certificate: '',
      architects_contact_number: '',
      architects_email: '',
      architects_address: '',
      coa_registration_number: '',
      architect_task: '',
      common_areas_and_facilities_amenities: '',
      proposed: '',
      details: '',
      percentage_of_work_done: '',
    },
    engineer: {
      engineer_name: '',
      engineers_certificate: '',
      engineers_contact_number: '',
      engineers_email: '',
      engineers_address: '',
    },
    allotment: {
      villa_no: '',
      saleable_area: '',
      allotment_project: '',
      proforma_of_application_form: '',
      proforma_of_allotment_letter: '',
      proforma_of_conveyance_deed: '',
    },
    lawyerReport: {
      lawyer_name: '',
      lawyer_ref_no: '',
      lawyer_contact_number: '',
      lawyer_email: '',
      lawyer_address: '',
      lawyer_certificate: '',
      affidavit: '',
      authentic_copy_of_approval_of_project: '',
      legal_document_of_agreement_in_case_of_other_land: '',
    },
    contactDetails: {
      project_coordinator_number: '',
      state: '',
      district: '',
      tehsil: '',
    },
  });

  const [showFileUpload, setShowFileUpload] = useState(false);
  const [file, setFile] = useState<File | null>();
  const { showToast } = useToast();
  useEffect(() => {
    switch (activeSection) {
      case 0: {
        const reraResponse = async () => {
          const response = await ApiCall('rablet-api/projects/1/rera-template/', 'reraDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            basicInfo: {
              ...prev.basicInfo,
              ...response.data,
            },
          }));
        };
        reraResponse();
        break;
      }
      case 1: {
        const promoterResponse = async () => {
          const response = await ApiCall(
            '/rablet-api/projects/1/promoter-details/',
            'promoterDetails',
          );
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            promoterDetails: {
              ...prev.promoterDetails,
              ...response.data,
            },
          }));
        };
        promoterResponse();
        break;
      }
      case 2: {
        const financialResponse = async () => {
          const response = await ApiCall(
            '/rablet-api/projects/1/financial-targets/',
            'financialTargets',
          );
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            financialTargets: {
              ...prev.financialTargets,
              ...response.data,
            },
          }));
        };
        financialResponse();
        break;
      }
      case 3: {
        const plansResponse = async () => {
          const response = await ApiCall('/rablet-api/projects/1/plans/', 'planDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            plans: {
              ...prev.plans,
              ...response.data,
            },
          }));
        };
        plansResponse();
        break;
      }
      case 4: {
        const caResponse = async () => {
          const response = await ApiCall('/rablet-api/projects/1/ca-certificates/', 'caDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            caCertificateDetails: {
              ...prev.caCertificateDetails,
              ...response.data,
            },
          }));
        };
        caResponse();
        break;
      }
      case 5: {
        const architectResponse = async () => {
          const response = await ApiCall('/rablet-api/projects/1/architect/', 'architectDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            architect: {
              ...prev.architect,
              ...response.data,
            },
          }));
        };
        architectResponse();
        break;
      }
      case 6: {
        const engineerResponse = async () => {
          const response = await ApiCall('/rablet-api/projects/1/engineer/', 'engineerDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            engineer: {
              ...prev.engineer,
              ...response.data,
            },
          }));
        };
        engineerResponse();
        break;
      }
      case 7: {
        const allotmentResponse = async () => {
          const response = await ApiCall('/rablet-api/projects/1/allotment/', 'allotmentDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            allotment: {
              ...prev.allotment,
              ...response.data,
            },
          }));
        };
        allotmentResponse();
        break;
      }
      case 8: {
        const lawyerResponse = async () => {
          const response = await ApiCall('/rablet-api/projects/1/lawyer-report/', 'lawyerDetails');
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            lawyerReport: {
              ...prev.lawyerReport,
              ...response.data,
            },
          }));
        };
        lawyerResponse();
        break;
      }
      case 9: {
        const contactResponse = async () => {
          const response = await ApiCall(
            '/rablet-api/projects/1/contact-details/',
            'contactDetails',
          );
          if (response.error) {
            showToast({
              message: response.message,
              type: 'error',
            });
          }
          setFormData(prev => ({
            ...prev,
            contactDetails: {
              ...prev.contactDetails,
              ...response.data,
            },
          }));
        };
        contactResponse();
        break;
      }
    }
  }, [activeSection]);

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
    if (activeSection < formTemplate.length - 1) {
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
