import { useContext, useState, useCallback, useEffect } from 'react';
import { StepperContext } from '../../contexts/StepperContext';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../../utils/show-toasts';

interface UserData {
  companyName: string;
  companyRegNumber: string;
  repName: string;
  position: string;
  email: string;
  resolutionConfirmed: boolean;
  powerOfAttorneyConfirmed: boolean;
  authorizedPersons: string;
  authorizedPositions: string;
  additionalDocsConfirmed: boolean;
}

type Props = {
  demo: boolean;
};

const AuthorizationCompliance = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const { showToast } = useToast();

  const [userData, setUserData] = useState<UserData>({
    companyName: '',
    companyRegNumber: '',
    repName: '',
    position: '',
    email: '',
    resolutionConfirmed: true,
    powerOfAttorneyConfirmed: true,
    authorizedPersons: '',
    authorizedPositions: '',
    additionalDocsConfirmed: true,
  });
  const [files, setFiles] = useState<File[]>([]);
  let accessToken = parseCookies().altern8_useraccessForRegister;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/user-api/authorization-compliance/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          const data = responseData.data;
          setUserData(prevUserData => {
            const updatedUserData: Partial<UserData> = { ...prevUserData };
            for (const key in prevUserData) {
              if (data.hasOwnProperty(key)) {
                updatedUserData[key as keyof UserData] = data[key];
              }
            }
            return updatedUserData as UserData;
          });
        } else if (response.status === 401) {
          router.push('/login');
        } else {
          showToast({
            message: `Failed to fetch data`,
            type: 'info'
          });
        }
      } catch (error) {
        showToast({
          message: 'Failed to fetch data, system error!',
          type: 'info'
        });
      }
    };

    if (!demo) {
      fetchData();
    } else {
      setUserData({
        companyName: 'Oeuvars LLC',
        companyRegNumber: 'U72200MH2023PTC123456',
        repName: 'Anurag Das',
        position: 'Chief Executive Officer',
        email: 'oeuvars@gmail.com',
        resolutionConfirmed: true,
        powerOfAttorneyConfirmed: true,
        authorizedPersons: 'Anurag Das',
        authorizedPositions: 'Chief Executive Officer',
        additionalDocsConfirmed: true,
      });
    }
  }, []);

  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setCurrentStep(newStep);
    } else {
      if (demo) {
        router.push('/register?demo=true&step=14');
        return;
      }
      const {
        companyName,
        companyRegNumber,
        repName,
        position,
        email,
        resolutionConfirmed,
        powerOfAttorneyConfirmed,
        authorizedPersons,
        authorizedPositions,
        additionalDocsConfirmed,
      } = userData;

      if (
        !companyName ||
        !companyRegNumber ||
        !repName ||
        !position ||
        !email ||
        !resolutionConfirmed ||
        !powerOfAttorneyConfirmed ||
        !authorizedPersons ||
        !authorizedPositions ||
        !additionalDocsConfirmed
      ) {
        showToast({
          message: 'Please fill all fields and confirm all checkboxes before submission.',
          type: 'info'
        });
        return;
      }

      try {
        setLoading(true);
        const formData = new FormData();

        formData.append('company_name', companyName);
        formData.append('company_reg_number', companyRegNumber);
        formData.append('rep_name', repName);
        formData.append('position', position);
        formData.append('email', email);
        formData.append('authorized_persons', authorizedPersons);
        formData.append('authorized_positions', authorizedPositions);

        if (files && files.length > 0) {
          files.forEach(file => {
            formData.append('documents', file);
          });
        }

        const response = await fetch(`${apiUrl}/user-api/authorization-compliance/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (response.status === 401) {
          router.push('/login');
        }

        if (response.ok) {
          showToast({
            message: `Submission successful`,
            type: 'info'
          });
          getRegistrationState();
        } else {
          showToast({
            message: `Submission failed`,
            type: 'info'
          });
        }
      } catch (error) {
        showToast({
          message: `Submission failed, system error`,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          General Information
        </div>
        <div className="space-y-2 px-5">
          <input
            onChange={handleChange}
            value={userData.companyName}
            name="companyName"
            placeholder="Company Name"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.companyRegNumber}
            name="companyRegNumber"
            placeholder="Company Registration Number"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.repName}
            name="repName"
            placeholder="Authorized Representative Name"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.position}
            name="position"
            placeholder="Position"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.email}
            name="email"
            placeholder="Email"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="email"
          />
        </div>
      </div>

      <div className="w-full">
        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          Authorization Confirmation
        </div>
        <div className="space-y-2 px-5">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="resolutionConfirmed"
              checked={userData.resolutionConfirmed}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-gray-200">
              I confirm that the Board of Directors of the company has passed a resolution
              authorizing the creation of this account and the transaction of business by availing
              the services on this platform.
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="powerOfAttorneyConfirmed"
              checked={userData.powerOfAttorneyConfirmed}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-gray-200">
              I confirm that a Power of Attorney has been granted to the following managers,
              officers, or employees to transact as representatives on behalf of the company:
            </span>
          </label>
          <input
            onChange={handleChange}
            value={userData.authorizedPersons}
            name="authorizedPersons"
            placeholder="Name(s) of Authorized Persons"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <input
            onChange={handleChange}
            value={userData.authorizedPositions}
            name="authorizedPositions"
            placeholder="Position(s)"
            className="py-1 px-2 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            type="text"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="additionalDocsConfirmed"
              checked={userData.additionalDocsConfirmed}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-gray-200">
              I confirm that the additional documents have been uploaded to support this
              confirmation.
            </span>
          </label>
        </div>
      </div>
      <div className="font-semibold h-6 mt-6 mb-3 text-gray-300 text-sm leading-8 uppercase">
        Additional Documents
      </div>
      <div>
        <div className="px-5 py-2">
          <span className="text-gray-200">
            Furthermore, being an authorized beneficial owner/manager/ officer of the Company I
            confirm to have with me and to submit the following documents:
          </span>
          <ul className="text-gray-200 space-y-1 mt-2">
            <li>1. The Aadhaar number and proof of possession of Aadhaar number</li>
            <li>
              2. The Permanent Account Number or the equivalent e-document thereof or Form No. 60 as
              defined in Income-tax Rules, 1962
            </li>
          </ul>
          <label className="flex items-center space-x-2 my-2">
            <input
              type="checkbox"
              name="additionalDocsConfirmed"
              checked={userData.additionalDocsConfirmed}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <span className="text-gray-200">
              I confirm that the above mentioned documents related to individual holding an attorney
              to transact on behalf of the company have been submitted.
            </span>
          </label>
        </div>
      </div>

      <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
        Acknowledgment and Agreement
      </div>

      <div className="px-5 py-2">
        <span className="text-gray-200">By signing below, I acknowledge and confirm that:</span>
        <ol className="text-gray-200 space-y-1 mt-2">
          <li>1. All information provided is accurate and truthful to my best knowledge.</li>
          <li>2. The documents uploaded are authentic and valid.</li>
          <li>
            3. I understand that the platform reserves the right to verify the information and
            documents provided.
          </li>
          <li>
            4. That any falsification of information and submission of misleading documents is
            liable to penal or other actions under law and equity.{' '}
          </li>
        </ol>
      </div>

      <div className="w-full">
        <div className="font-semibold h-6 my-3 text-gray-300 text-sm leading-8 uppercase">
          Upload Supporting Documents
        </div>
        <div
          {...getRootProps()}
          className={`p-4 border-2 border-dashed ${
            isDragActive ? 'border-green-500' : 'border-gray-400'
          } rounded-md cursor-pointer text-center`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p className=" text-white">
              Drag 'n' drop some files here, or click to select files. (PDF, DOCX, etc.)
            </p>
          )}
        </div>
        {files.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-medium text-gray-200">Selected Files</h3>
            <ul className="list-disc text-gray-200">
              {files.map(file => (
                <li key={file.name} className="flex justify-start items-center gap-2">
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          onClick={() => handleClick('next')}
        >
          Submit
        </button>
      </div>

      <HelpAndLogin />
    </div>
  );
};

export default AuthorizationCompliance;
