import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../contexts/stepper-context';
import HelpAndLogin from '../Step-Component/HelpAndLogin';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../../utils/show-toasts';
import { getAuthToken } from '@/utils/auth-actions';

type Props = {
  demo: boolean;
};

interface DocumentFiles {
  [key: string]: File[];
}

const BureauReport = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentStep, setCurrentStep, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const [referenceId, setReferenceId] = useState('');
  const [otpForm, setOtpForm] = useState({
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(true);
  const [manualBureauReportNeeded, setManualBureauReportNeeded] = useState(false);
  const [entityType, setEntityType] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [documentFiles, setDocumentFiles] = useState<DocumentFiles>({});
  const { showToast } = useToast();
  const router = useRouter();
  const openInNewTab = (url: string) => {
    console.log(url, 'url');
    
    Object.assign(document.createElement('a'), {
      target: '_blank',
      rel: 'noopener noreferrer',
      href: url,
    }).click();
  };
  // handle form input for phone number and otp
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setOtpForm({ ...otpForm, [name]: value });
  };
  const getBureauAgreementUrl = async () => {
    try {
      if(demo){
       return alert('You are in demo mode')
      }
      let accessToken = parseCookies().altern8_useraccess;
      const response = await fetch(`${apiUrl}/user-api/get-signing-url/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 401) {
        router.push('/login');
      }
      if (response.ok) {
        const data = await response.json();
        openInNewTab(data?.agreement_url);
      }
    } catch (err) {
      showToast({message:'Cannot get Bureau Agreement Url, please try again later!', type:'error'});
      console.log(err);
    } finally {
      // setSpinner(false);
    }
  };
  const GetBureauResponseId = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken()
      let response = await fetch(`${apiUrl}/user-api/bureau-report/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.is_manual_bureau_report_needed) {
          setManualBureauReportNeeded(true);
          if (responseData.entity_type) {
            setEntityType(responseData.entity_type);
          }
        } else {
          if (responseData.referenceId) {
            setReferenceId(responseData.referenceId);
            setOtpSent(true);
          } else {
            setTimeout(() => {
              showToast({
                message: `Unable to get reference ID, please try again later.`,
                type: 'info'
            });
            }, 1000);
          }
        }
      } else {
        console.log('Unable to fetch reference id for Bureau report');
        //getRegistrationState();
      }
    } catch (error) {
      console.log(`Unable to fetch reference id for Bureau report, (${currentStep}) :`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demo) {
      GetBureauResponseId();
    }
  }, []);

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setCurrentStep(newStep);
    } else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=8');
        return;
      }
      if (!manualBureauReportNeeded) {
        const newRecord: { otp: string; referenceId: string } = {
          otp: '',
          referenceId: '',
        };
        newRecord.otp = otpForm.otp;
        newRecord.referenceId = referenceId;

        if (newRecord['otp'].length < 3) {
          showToast({
            message: `Please enter valid otp`,
            type: 'info'
          });
          return;
        }

        try {
          if (newRecord) {
            const body = newRecord;
            const token = await getAuthToken()
            setLoading(true);
            const response = await fetch(`${apiUrl}/scoreme-api/bda/external/validateotp/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(body),
            });

            if (response.ok) {
              let server_message = await response.json();
              showToast({
                message: `Submission Successful`,
                type: 'info'
              });
              getRegistrationState();
            } else {
              let server_error = await response.json();
              showToast({
                message: `Submission failed! ${server_error.message}`,
                type: 'info'
              });
            }
          }
        } catch (error) {
          showToast({
            message: `Submission failed, system error!`,
            type: 'info'
          });
        } finally {
          setLoading(false);
        }
      } else {
        const formData = new FormData();
        Object.entries(documentFiles).forEach(([documentType, files]) => {
          files.forEach((file: File) => {
            formData.append(documentType, file);
          });
        });

        if (Array.from(formData.values()).length === 0) {
          showToast({
            message: 'Please select files',
            type: 'info'
          });
          return;
        }

        try {
          setLoading(true);
          const token = await getAuthToken()
          const response = await fetch(`${apiUrl}/user-api/upload-bureau-docs/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.status === 401) {
            router.push('/login');
          }

          if (response.ok) {
            showToast({
              message: 'Files uploaded successfully',
              type: 'info'
            });
            getRegistrationState();
          } else {
            showToast({
              message: 'File upload failed',
              type: 'info'
            });
          }
        } catch (error) {
          showToast({
            message: 'Error uploading files',
            type: 'info'
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // to resend the otp
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const newRecord: { referenceId: string } = {
        referenceId: '',
      };
      newRecord.referenceId = referenceId;
      console.log(newRecord);
      const response = await fetch(`${apiUrl}/scoreme-api/bda/external/resendotp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        let responseData = await response.json();
        console.log('otp sent, get success', responseData);
        setOtpSent(true);
        otpForm.otp = '';
      } else {
        let server_error = await response.json();

        // empty previous otp in login form field
        otpForm.otp = '';
        showToast({
          message: `Failed to send otp,${server_error.message}`,
          type: 'info'
        });
      }
    } catch (error) {
      showToast({
        message: `Failed to send otp, system error`,
        type: 'info'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (otpSent) {
      setOtpTimer(60);

      intervalId = setInterval(() => {
        setOtpTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setOtpSent(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent]);

  const documentDictionary: { [key: string]: string } = {
    AddressProof:
      'Telephone or Electricity Bill, Bank Passbook or Account Statement, Registered Lease/Sale Agreement of office premises, Proof of Address issued by Scheduled Commercial Banks/Multinational Foreign Banks, Registration Certificate issued under Shops and Establishment Act',
    'Copy of Partnership Deed':
      'Copy of Partnership Deed which is mandatory to submit in case of Partnership',
    'List of Authorized Signatories':
      'A list of authorized signatories is mandatory to submit in case of Partnership',
    IDProof: 'PAN Card, Driving License, Passport, Voter ID card, Aadhaar Card',
    CompanyPan: 'Copy of Company PAN which is mandatory to submit in case of Partnership',
    'Copy of Board Resolution':
      'Copy of Board Resolution which is mandatory to submit in case of Partnership',
  };

  // Define all potential document types regardless of entityType
  const allDocumentTypes = [
    'Address Proof',
    'Copy of Partnership Deed',
    'List of Authorized Signatories',
    'ID Proof',
    'Company Pan',
    'Copy of Board Resolution',
  ];

  // Create hooks for all document types
  const dropzoneHooks = allDocumentTypes.reduce((acc, documentType) => {
    acc[documentType] = useDropzone({
      onDrop: (acceptedFiles: File[]) =>
        setDocumentFiles(prevFiles => ({
          ...prevFiles,
          [documentType]: acceptedFiles,
        })),
    });
    return acc;
  }, {} as { [key: string]: ReturnType<typeof useDropzone> });

  const renderDropzones = () => {
    // Only render dropzones for the current document types
    return allDocumentTypes.map((documentType, index) => {
      const { getRootProps, getInputProps } = dropzoneHooks[documentType];

      return (
        <div key={index}>
          <h3 className="font-bold my-2 text-white">{documentType}</h3>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p className="border-dashed border-2 border-gray-400 py-6 text-center cursor-pointer text-gray-300">
              Drag and drop files here, or click to select files
            </p>
            {documentFiles[documentType] && (
              <div className=" text-gray-200">
                <h4>Selected files:</h4>
                <ul>
                  {documentFiles[documentType].map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="my-4">
            <h4 className="text-sm text-gray-400">Allowed Document Types:</h4>
            <p className="text-xs text-gray-300">
              {documentDictionary[documentType.replace(/\s+/g, '')]}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="p-4">
      {manualBureauReportNeeded && (
        <div className="">
          <div className="flex flex-col">
            <div className="mb-3 mt-2 flex flex-col justify-center">
              <div className="text-center font-medium text-xl text-gray-300">
                Document Signature
              </div>
              <div className="text-center font-medium text-base text-gray-300">
                Please sign the below document for fetching Bureau report
              </div>
              <div className="text-center font-medium text-base text-gray-300 py-3">
                <button className="text-[#1565c0]" onClick={getBureauAgreementUrl}>
                  Click Here
                </button>
              </div>
            </div>

            {/* drag and drop  */}
            {entityType === 'Partnership' && renderDropzones()}
            {(entityType === 'Company' ||
              (entityType !== 'Sole Proprietorship' && entityType !== 'Partnership')) &&
              renderDropzones()}
          </div>
        </div>
      )}
        <div className="">
          <div className="grid grid-cols-1 gap-6">
            {manualBureauReportNeeded ? (
              <div>{renderDropzones()}</div>
            ) : (
              <div>
                <div className="w-full mx-2 flex-1">
                  <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase ">
                    OTP for Bureau Report
                  </div>
                  <div className=" my-2 py-1 flex ">
                    <input
                      onChange={handleInput}
                      value={otpForm.otp || ''}
                      name="otp"
                      placeholder="OTP"
                      className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
                      type="text"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <p className="text-sm text-white">Resend OTP in {otpTimer} seconds</p>
                  </div>
                )}
                {!otpSent && (
                  <button
                    onClick={handleSendOtp}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleClick('next')}
                className="px-4 py-2 bg-blue-600 text-white rounded-full"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <HelpAndLogin />
    </>
  );
};

export default BureauReport;
