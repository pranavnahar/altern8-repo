import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../contexts/StepperContext';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useToast } from '../../utils/show-toasts';

type Props = {
  demo: boolean;
};

const PAN = ({ demo }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [panNumberList, setPanNumberList] = useState<string[]>([]);
  const [userData, setUserData] = useState<{
    panNumber?: string;
    [key: string]: string | undefined;
  }>({
    panNumber: '',
  });
  const router = useRouter();
  const { currentStep, setCurrentStep, steps, setLoading, getRegistrationState } =
    useContext(StepperContext);
  const [showInput, setShowInput] = useState(false);

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister;
  const { showToast } = useToast();

  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUserData({ ...userData, panNumber: value });
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const GetPanList = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${apiUrl}/user-api/select-pan/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // If unauthorized then push to login page
      if (response.status === 401) {
        router.push('/login');
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        const panNumbers = responseData.data;
        setPanNumberList(panNumbers);
      } else {
        console.log('Unable to fetch PAN numbers list');
      }
    } catch (error) {
      console.log(`Unable to fetch PAN numbers list, (${currentStep}) :`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!demo) {
      GetPanList();
    } else {
      setPanNumberList([
        'ABCDE1234F',
        'PQRST5678G'
      ]);
    }
  }, []);

  // Handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== 'next') {
      newStep--;
      setCurrentStep(newStep);
    } else if (direction === 'next') {
      if (demo) {
        router.push('/register?demo=true&step=6');
        return;
      }
      let newRecord: { pan_number: string } = {
        pan_number: '',
      };
      newRecord.pan_number = userData.panNumber!;

      if (!/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/.test(newRecord.pan_number)) {
        showToast({
          message: 'PAN Number must be exactly 10 characters long, with the format: 5 letters, 4 digits, 1 letter.',
          type: 'info',
        });
        return;
      }

      console.log(newRecord);

      try {
        if (newRecord) {
          const body = newRecord;
          setLoading(true);
          const response = await fetch(`${apiUrl}/user-api/select-pan/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          });

          // If unauthorized then push to login page
          if (response.status === 401) {
            router.push('/login');
          }

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
        console.error(
          `PAN page data submission failed, Error in fetching api, (${currentStep}) :`,
          error,
        );
        showToast({
          message: `Submission failed, system error!`,
          type: 'info'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* PAN number select field */}
      {!showInput && panNumberList.length > 0 && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
            Select a PAN Number
          </div>
          <div className="my-2 py-1 flex">
            <select
              onChange={handleSelectChange}
              value={userData.panNumber || ''}
              name="panNumber"
              className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
              required
            >
              <option
                className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                value=""
                disabled
              >
                Select PAN Number
              </option>
              {panNumberList.map((panNumber, index) => (
                <option
                  className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                  key={index}
                  value={panNumber}
                >
                  {panNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PAN number input field */}
      {showInput && (
        <div className="w-full mx-2 flex-1">
          <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
            Enter PAN Number
          </div>
          <div className="my-2 py-1 flex">
            <input
              onChange={handleChange}
              value={userData.panNumber || ''}
              name="panNumber"
              placeholder="Enter PAN number"
              className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
              type="text"
              autoComplete="new-password"
              required
            />
          </div>
        </div>
      )}

      {/* Navigation controls */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col">
          <div className="flex justify-center items-center mt-4 mb-8 space-x-4">
            {/* Add button */}
            {!showInput && (
              <button
                onClick={() => setShowInput(true)}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                Add PAN Number
              </button>
            )}

            {/* Next button */}
            <button
              onClick={() => handleClick('next')}
              className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PAN;
