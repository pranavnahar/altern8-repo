import { useContext } from 'react';
import { StepperContext } from '../../Contexts/StepperContext';

const HelpAndLogin = () => {
  // Destructuring the necessary values and functions from StepperContext
  const { handleClickHelp } = useContext(StepperContext);

  return (
    <div className="pb-1 flex flex-row justify-between text-base text-gray-300 items-end">
      <div>
        <a href={'/help'} onClick={handleClickHelp} className="text-indigo-500 font-medium mx-2">
          Need Help?
        </a>
      </div>
      <div>
        Already registered?
        <a href="/login" className="text-indigo-600 font-medium mx-2">
          Login Here
        </a>
      </div>
    </div>
  );
};

export default HelpAndLogin;
