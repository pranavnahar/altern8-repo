// @ts-nocheck
import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../Utils/show-toasts';
import LoadingSpinner from '../LoadingSpinner';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../ui/button';
import { fetchWithAuth } from '../../utils/fetch-with-auth';

// Define form state type
interface FormState {
  company_name: string;
  company_email: string;
  company_query: string;
  [key: string]: string | boolean; // For dynamic checkbox fields
}

const ContactUsForm = () => {
  const initialFormState: FormState = {
    company_name: '',
    company_email: '',
    company_query: '',
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
    'Retirement communities',
    'Student accommodation',
    'Serviced apartments',
    'Mixed use properly',
    'Affordable housing',
    'Plotted land',
  ];

  const [formData, setFormData] = useState<FormState>({
    ...initialFormState,
    ...Object.fromEntries(choices.map(choice => [choice, false])),
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change for text and email fields
  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (
      (name === 'company_name' && value.length > 200) ||
      (name === 'company_query' && value.length > 400)
    ) {
      useToast(
        `${name === 'company_name' ? 'Company name' : 'Comments'} should be less than ${name === 'company_name' ? 200 : 400
        } characters`,
        'info',
      );
      return;
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (choice: string) => {
    setFormData(prev => ({ ...prev, [choice]: !prev[choice] }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { company_name, company_email, company_query } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (company_name.length < 3 || company_email.length < 3 || company_query.length < 10) {
      useToast(`Input value should not be too small or empty`, 'info');
      return;
    }

    if (!emailRegex.test(company_email)) {
      useToast(`Invalid email format`, 'info');
      return;
    }

    const isAnyChoiceSelected = choices.some(choice => formData[choice] === true);
    if (!isAnyChoiceSelected) {
      useToast(`Choose at least one area of interest`, 'info');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth('/landing-page/contactus/', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        useToast(`Form submitted successfully!`, 'info');
        setFormData({
          ...initialFormState,
          ...Object.fromEntries(choices.map(choice => [choice, false])),
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      useToast(`Submission failed!`, 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone:w-full xl:w-[60%] mx-auto mt-32 mb-32">
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

        <form onSubmit={handleSubmit} className="p-5">
          <h2 className="mb-5 text-5xl font-medium text-center font-roboto text-white-font">
            Contact us
          </h2>

          {['company_name', 'company_email'].map(field => (
            <div key={field} className="mb-4">
              <label className="block mb-2 text-xs text-gray-400 uppercase">
                {field.replace('_', ' ')}
              </label>
              <input
                type={field === 'company_email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleInput}
                className="w-full px-2 py-1 text-sm text-gray-100 bg-transparent border-b-2 outline-none focus:border-purple-600 placeholder:text-sm"
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-2 text-xs text-gray-400 uppercase">Area of Interest</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {choices.map(choice => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={choice}
                    checked={formData[choice] as boolean}
                    onCheckedChange={() => handleCheckboxChange(choice)}
                  />
                  <label
                    htmlFor={choice}
                    className="text-sm font-medium leading-none text-gray-300 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {choice}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2 mb-4 rounded-md card-cover">
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

          <div className="mt-6 text-center">
            <Button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 text-white transition duration-300 ease-in-out"
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
