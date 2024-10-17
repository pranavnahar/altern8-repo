import AnimatedLogo from "../../../components/Header/AnimatedLogo";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { motion } from "framer-motion";

const ForgotPass = () => {
  return (
    <motion.div className="flex flex-col justify-center items-center min-h-screen">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        // animate={mainControls}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ scale: 1.03, opacity: 1 }}
        className="h-[85vh] w-full rounded-3xl py-10 px-8 flex flex-col justify-around max-w-sm [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] shadow-md"
      >
        <AnimatedLogo />
        <label className="block text-lg font-medium text-center text-white mb-1">
          Reset Password
        </label>
        <div className="h-[65%] flex flex-col justify-between">
          <div className="mb-2">
            <label className="block text-sm font-medium  text-white mb-1">
              Phone Number
            </label>
            <Input
              type="number"
              placeholder="Phone Number"
              name="phonenumber"
              className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            //onChange={(e) => handleChange(e, "phoneNumber")}
            />
          </div>

          <div className="mt-1 text-right text-white text-sm">
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            size="lg"
          //onClick={handleLogin}
          >
            Reset
          </Button>

          <div className="mt-4 text-center text-white text-sm">
            <span>Not registered yet? </span>
            <a href="/register" className="text-blue-600 hover:underline">
              Register Here
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPass;
