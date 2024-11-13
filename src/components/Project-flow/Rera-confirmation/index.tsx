'use client';
import React, { useState, useEffect } from 'react';
import Input from '../../../components/Input/input';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { formTemplate } from '../../../utils/static';
import { getAccessToken } from '../../../utils/auth';
import { useToast } from '../../../utils/show-toasts';

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

export function ReraConfirmation() {
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

    let accessToken = parseCookies().altern8_useraccess;

    const ReplaceTokenOrRedirect = async () => {
        const token = await getAccessToken();
        if (!token) {
            router.push('/login');
        } else {
            accessToken = token;
        }
    };

    const saveReraTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitting the form');

        try {
            if (!accessToken) {
                await ReplaceTokenOrRedirect();
            }

            const formDataToSend = new FormData();
            console.log('the form data that is being sent is: ', formData);

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
                    <div className="p-6 w-full grid grid-cols-3 border">
                        {formTemplate.map(item => renderFormField(item))}
                    </div>
                    <button
                        type="submit"
                        className="p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}
