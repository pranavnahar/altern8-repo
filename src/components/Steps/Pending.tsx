// this is the last step of registration where user submitted all the Details
// but his  profile is pending for approval
import HelpAndLogin from "../Step-Component/HelpAndLogin";
import { useEffect } from "react";
import { parseCookies, destroyCookie } from "nookies";

const Pending = () => {
  useEffect(() => {
    const removeTokenFromCookies = () => {
      const cookies = parseCookies();
      const accessTokenForRegister = cookies.accessTokenForRegister;

      // Check if there is a token in cookies
      if (accessTokenForRegister) {
        // Delete the token from cookies
        destroyCookie(null, "accessTokenForRegister");
        console.log("Token removed from cookies.");
      }
    };

    // Call the function
    removeTokenFromCookies();
  }, []);

  return (
    <div className="mb-5">
      <div className="flex flex-col items-center mb-10">
        <div className="text-green-400">
          <svg
            className="w-6 h-6 text-green-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
          {/* <img className="w-24 h-24" src="/green-tick.svg" alt="" /> */}
        </div>
        <div className="mt-3 text-xl font-semibold-uppercase text-green-500">
          Congratulations!
        </div>
        <div className="text-lg font-medium text-gray-400">
          Your Details has been submitted for approval.
          <br />
          You will get notified by email once approved.
        </div>
      </div>
      <HelpAndLogin />
    </div>
  );
};

export default Pending;
