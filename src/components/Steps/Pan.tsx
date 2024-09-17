// either the user select the pan number from the  list or he enter the pan number

import { useContext, useState, useEffect } from "react";
import { StepperContext } from "../../Contexts/StepperContext";
//import HelpAndLogin from "./stepsComponents/HelpAndLogin";
//import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { showToast } from "../../Utils/showToast";

const PAN = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [panNumberList, setPanNumberList] = useState([]);
  const [userData, setUserData] = useState<{
    panNumber?: string;
    [key: string]: string | undefined;
  }>({
    panNumber: "",
  });
  const {
    currentStep,
    setCurrentStep,
    steps,
    setLoading,
    //getRegistrationState,
  } = useContext(StepperContext);

  // Handle token
  let accessToken = parseCookies().accessTokenForRegister;

  // handle input change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUserData({ ...userData, panNumber: value });
  };

  // handle input change
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

      // if unauthorized then push to login page
      if (response.status === 401) {
        window.location.replace("/login");
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        const panNumbers = responseData.data;
        setPanNumberList(panNumbers);
      } else {
        console.log("Unable to fetch pan numbers list");
      }
    } catch (error) {
      console.log(
        `Unable to fetch pan numbers list, (${currentStep}) :`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetPanList();
  }, []);

  // to handle click on next and back button
  const handleClick = async (direction?: string) => {
    let newStep = currentStep;

    if (direction !== "next") {
      newStep--;
      setCurrentStep(newStep);
    } else if (direction === "next") {
      let newRecord: { panNumber: string } = {
        panNumber: "",
      };
      newRecord.panNumber = userData.panNumber!;

      if (!/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/.test(newRecord.panNumber)) {
        showToast(
          "PAN Number must be exactly 10 characters long, with the format: 5 letters, 4 digits, 1 letter.",
          "info"
        );
        return;
      }

      console.log(newRecord);

      try {
        if (newRecord) {
          const body = newRecord;
          setLoading(true);
          const response = await fetch(`${apiUrl}/seller-api/select-pan/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          });

          // if unauthorized then push to login page
          if (response.status === 401) {
            window.location.replace("/login");
          }

          if (response.ok) {
            let server_message = await response.json();
            console.log(
              `PAN page data submitted successfully.`,
              server_message
            );

            showToast(`Submission Successful`, "info");

            // change the step after click and submitting the data
            //getRegistrationState();
          } else {
            let server_error = await response.json();
            console.error(`PAN page data submission failed`, server_error);
            showToast(`Submission failed! ${server_error.message}`, "info");
          }
        }
      } catch (error) {
        console.error(
          `PAN page data submission failed, Error in fetching api, (${currentStep}) :`,
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
      {/* Pan number select field */}
      {panNumberList.length > 0 && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
            Select a PAN Number
          </div>
          <div className=" my-2 py-1 flex">
            <select
              onChange={handleSelectChange}
              value={userData.panNumber || ""}
              name="panNumber"
              className="py-1 w-full text-gray-100 border-b-2 bg-transparent  outline-none  focus:outline-none focus:border-purple-600 transition-colors"
              required
            >
              <option
                className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]"
                value=""
                disabled
              >
                Select Pan Number
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

      {panNumberList.length == 0 && (
        <div className="w-full mx-2 flex-1">
          <div className="font-semibold h-6 mt-3 text-gray-300 text-sm leading-8 uppercase">
            Entity PAN Number
          </div>
          <div className=" my-2 py-1 flex">
            <input
              onChange={handleChange}
              value={userData.panNumber || ""}
              name="pan_number"
              placeholder="Entity PAN number"
              className="py-1    w-full text-gray-100 border-b-2 bg-transparent  outline-none appearance-none focus:outline-none focus:border-purple-600 transition-colors"
              type="text"
              autoComplete="new-password"
              required
            />
          </div>
        </div>
      )}

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

export default PAN;
