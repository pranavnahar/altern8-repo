"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../LoadingSpinner';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../ui/button';
import { useToast } from '../../utils/show-toasts';

interface FormState {
  company_name: string;
  company_email: string;
  company_query: string;
  company_phone_number: string;
  [key: string]: string | boolean; // For dynamic checkbox fields
}

const ContactUsForm = () => {
  const initialFormState: FormState = {
    company_name: '',
    company_email: '',
    company_query: '',
    company_phone_number: '',
  };

  const choices = [
    'Rental assets',
    'Retirement communities',
    'Co living',
    'Hospitality projects',
    'Warehousing',
    'Residential',
    'Commercial',
    'Townships',
    'Vacation properties',
    'International properties',
    'Redevelopment',
    'Student accommodation',
    'Serviced apartments',
    'Mixed use property',
    'Affordable housing',
    'Plotted land',
    'Advance Loans',
    'Fractional Ownership',
    'Real Estate Investment Trusts',
    'Debentures',
    'Secured Debt',
    'Structured Notes',
    'Commercial Papers',
    'Distressed Situations Finance',
  ];

  const [formData, setFormData] = useState<FormState>({
    ...initialFormState,
    ...Object.fromEntries(choices.map(choice => [choice, false])),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  // Handle input change for text and email fields
  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (
      (name === 'company_name' && value.length > 200) ||
      (name === 'company_query' && value.length > 400)
    ) {
      showToast({
        message: `${name === 'company_name' ? 'Company name' : 'Comments'} should be less than ${
          name === 'company_name' ? 200 : 400
        } characters`,
        type: 'info',
      });
      return;
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (choice: string) => {
    setFormData(prev => ({ ...prev, [choice]: !prev[choice] }));
  };

  const validateForm = (): boolean => {
    // Check if the company name is valid
    if (formData.company_name.length < 3) {
      showToast({
        message: `Company name should be at least 3 characters`,
        type: 'info',
      });
      return false;
    }
  
    // Check if the company query is valid
    if (formData.company_query.length < 10) {
      showToast({
        message: `Comments and questions should be at least 10 characters`,
        type: 'info',
      });
      return false;
    }
  
    // Regular expression for common personal email domains
    const personalEmailRegex = /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;
  
    // Check if the email is valid and not personal
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(formData.company_email)) {
      showToast({
        message: `Invalid email format`,
        type: 'info',
      });
      return false;
    }
  
    // Check if the email is a personal email
    if (personalEmailRegex.test(formData.company_email)) {
      showToast({
        message: 'Please enter only work emails',
        type: 'info',
      });
      return false;
    }
  
    // Check if the phone number is valid
    if (formData.company_phone_number.length !== 10) {
      showToast({
        message: `Phone number must be exactly 10 digits`,
        type: 'info',
      });
      return false;
    }
  
    // Check if at least one choice is selected
    const isAnyChoiceSelected = choices.some(choice => formData[choice] === true);
    if (!isAnyChoiceSelected) {
      showToast({
        message: `Choose at least one area of interest`,
        type: 'info',
      });
      return false;
    }

    if (!formData.terms_agreement) {
      showToast({
        message: `You must agree to our terms of service before submitting.`,
        type: 'error',
      });
      return false;
    }
  
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("form submission trigegr start");

    if (!validateForm()) {
      // console.log("form data not validated");
      return;
    }

    setLoading(true);
    try {
      // console.log("test------------");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing-page/contact-us/`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response?.ok) {
        showToast({
          message: `Form submitted successfully!`,
          type: 'info',
        });
        setFormData({
          ...initialFormState,
          ...Object.fromEntries(choices.map(choice => [choice, false])),
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast({
        message: `Submission failed, please retry once again!`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-form" className="phone:w-full xl:w-[100%] mx-auto mt-32 mb-32">
      <div className="relative box-border h-[3px] border-t-[3px] border-solid border-white-font" />
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1, delay: 0.5 }}
        className="rounded-lg m-20 w-10/12 sm:w-2/3 lg:w-3/6 mx-auto [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] items-start justify-start relative opacity-[1]"
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <LoadingSpinner />
          </div>
        )}

        <form className="p-5" onSubmit={handleSubmit}>
          <h2 className="mb-5 text-5xl font-medium text-center font-roboto text-white-font">
            Contact us
          </h2>

          <div className="mb-4">
            <label className="block mb-2 text-xs text-gray-400 uppercase">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInput}
              placeholder="Enter your company name"
              className="w-full px-2 py-1 text-sm text-gray-100 bg-transparent border-b-2 outline-none focus:border-purple-600 placeholder:text-sm"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block mb-2 text-xs text-gray-400 uppercase">Company Email</label>
            <input
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleInput}
              placeholder="Enter your company email"
              className="w-full px-2 py-1 text-sm text-gray-100 bg-transparent border-b-2 outline-none focus:border-purple-600 placeholder:text-sm"
              required
            />
          </div>

          {/* Phone Number Input */}
          <div className="mb-4">
            <label className="block mb-2 text-xs text-gray-400 uppercase">
              Company Phone Number
            </label>
            <input
              type="tel"
              name="company_phone_number"
              value={formData.company_phone_number}
              onChange={handleInput}
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Enter 10 digit number"
              className="w-full px-2 py-1 text-sm text-gray-100 bg-transparent border-b-2 outline-none focus:border-purple-600 placeholder:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-xs text-gray-400 uppercase">Area of Interest</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {choices.map(choice => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={choice}
                    checked={formData[choice] as boolean}
                    onCheckedChange={() => handleCheckboxChange(choice)}
                    borderColor="border-[#A1A1BC]"
                  />
                  <label
                    htmlFor={choice}
                    className="text-sm font-medium leading-none text-gray-300 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-90"
                  >
                    {choice}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2 mb-4 rounded-md bg-slate-500/10 backdrop-blur-md border border-white/5">
            <label className="block mb-2 text-xs text-gray-400 uppercase">
              Comments and questions
            </label>
            <textarea
              name="company_query"
              value={formData.company_query}
              onChange={handleInput}
              className="w-full px-3 py-2 text-gray-100 bg-transparent border-b-2 outline-none rounded-t-md focus:border-purple-600 animation"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 ml-2">
              <Checkbox
                id="terms_agreement"
            
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, terms_agreement: checked }))
                }
              />
              <label htmlFor="terms_agreement" className="text-sm text-gray-400">
                By clicking Submit, you agree to our{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-purple-500 hover:text-purple-400"
                >
                  Privacy Policy
                </a>
                ,{' '}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-purple-500 hover:text-purple-400"
                >
                  Terms of Service
                </a>
                , and{' '}
                <a
                  href="/refund-and-cancellations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-purple-500 hover:text-purple-400"
                >
                  Refund Policy
                </a>
                .
              </label>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              type="submit"
              className="inline-flex items-center justify-center hover:bg-[#318bc0] bg-[#319ae0] px-6 py-3 text-white transition duration-300 ease-in-out"
            >
              Submit
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactUsForm;
