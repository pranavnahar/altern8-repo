// choose the primary bank account

import { useContext, useState, useEffect } from "react";
import { StepperContext } from "../../contexts/StepperContext";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import { useToast } from "@/utils/show-toasts";

const SelectPrimaryBankAccount = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [bankAccountsList, setBankAccountsList] = useState<{ accountNumber: string; bankName: string }[]>();
  const { showToast } = useToast()
  const [currentBankAccount, setCurrentBankAccount] = useState("");
  const {
    currentStep,
    setCurrentStep,
    steps,
    setLoading,
    getRegistrationState,
  } = useContext(StepperContext);
  const router = useRouter();
  // Handle token
  let accessToken =
    parseCookies().altern8_useraccessForRegister || localStorage.getItem("token");

  // handle input change
  // const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const { value } = e.target;
  //   setCurrentBankAccount(value);
  // };

  const GetBankAccountList = async () => {
    setLoading(true);
    try {
      let response = await fetch(`${apiUrl}/user-api/select-primary-bank/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // if unauthorized then push to login page
      if (response.status === 401) {
        router.push("/login");
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.accounts) {
          setBankAccountsList(responseData.accounts);
        } else {
          console.log("No accounts data available");
        }
      } else {
        console.log("Unable to fetch bank accounts list");
      }
    } catch (error) {
      console.log(
        `Unable to fetch bank accounts list, (${currentStep}) :`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetBankAccountList();
  }, []);

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    // change the step after click for back button
    let newStep = currentStep;

    if (direction !== "next") {
      newStep--;
      setCurrentStep(newStep);
    }
    // if button is next the submit data to backend api
    else if (direction === "next") {
      if (currentBankAccount == "") {
        console.log("Please select a valid bank account");
        showToast(`Please select a valid bank account`, "info");

        return;
      }

      let newRecord: { accountNumber: string } = {
        accountNumber: "",
      };
      newRecord.accountNumber = currentBankAccount;

      console.log(newRecord);
      try {
        if (newRecord) {
          const body = newRecord;
          setLoading(true);
          const response = await fetch(
            `${apiUrl}/user-api/select-primary-bank/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(body),
            }
          );

          // if unauthorized then push to login page
          if (response.status === 401) {
            router.push("/login");
          }

          if (response.ok) {
            let server_message = await response.json();
            console.log(
              `Primary bank account data submitted successfully!`,
              server_message
            );

            showToast(`Submission Successful`, "info");

            // change the step after click and submitting the data
            getRegistrationState();
          } else {
            let server_error = await response.json();
            console.error(
              `Failed to submit primary bank account data.`,
              server_error
            );

            showToast(`Submission failed! ${server_error.message}`, "info");
          }
        }
      } catch (error) {
        console.error(
          `Error submitting data, Error in fetching api (${currentStep}) :`,
          error
        );
        showToast(`Submission failed, system error!`, "info");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
          Select a primary bank account
        </div>
        <div className="my-2 py-1 flex">
          <select
            onChange={(e) => setCurrentBankAccount(e.target.value)}
            value={currentBankAccount || ""}
            name="currentBankAccount"
            className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:outline-none focus:border-purple-600 transition-colors"
            required
          >
            <option
              className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
              value=""
              disabled
            >
              Select bank account
            </option>
            {bankAccountsList?.map((bankAccount, index) => (
              <option
                className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                key={index}
                value={bankAccount.accountNumber}
              >
                {bankAccount.bankName} - {bankAccount.accountNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation controls  */}
      {currentStep !== steps.length && (
        <div className="container flex flex-col ">
          <div className="flex justify-around mt-4 mb-8">
            {/* back button  */}
            <button
              onClick={() => handleClick()}
              className="bg-white text-slate-600 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
                            "
            >
              Back
            </button>
            {/* next button  */}
            <button
              onClick={() => handleClick("next")}
              className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
          {/* <HelpAndLogin /> */}
        </div>
      )}
    </div>
  );
};

export default SelectPrimaryBankAccount;
