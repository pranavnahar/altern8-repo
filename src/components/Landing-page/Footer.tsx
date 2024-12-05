// footer for landing page

import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="container  max-w-[1320px] py-10 mx-auto text-gray-600">
        <div className=" mx-7 ">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-between  gap-2 text-center sm:text-left">
            {/* contact us section  */}
            <div className="mb-5 leading-[25px]">
              <div className="text-5xl  font-medium font-roboto text-gray-300 my-5">Contact Us</div>
              
              <div className="text-base2 text-gray-400 my-1 mx-10 sm:mx-0 lg:w-1/2">
              46 College Road, Nungambakkam, Chennai
              </div>
              <a
                className="text-base2 text-gray-400"
                href="mailto:blend@nahar.om?subject=Altern8 Enquiry"
              >
                Email: blend@nahar.om
              </a>
              <br />
              <a
                className="text-base2 text-gray-400"
                href="mailto:grievance@nahar.om?subject=Altern8"
              >
                Nodal Officer: grievance@nahar.om
              </a>

              
            </div>

            {/* terms and policy  */}
            <div className="mb-5 leading-[25px]">
              <div className="text-5xl font-medium font-roboto text-gray-300 my-5">
                Terms and Policy
              </div>
              <Link
                className="text-base2 text-gray-400 block mb-2 hover:underline"
                href="/terms-and-conditions"
              >
                Terms and Conditions
              </Link>
              <Link
                className="text-base2 text-gray-400 block mb-2 hover:underline"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-base2 text-gray-400 block mb-2 hover:underline"
                href="/refund-and-cancellations"
              >
                Refund and Cancellations
              </Link>
            </div>



             {/* terms and policy  */}
             <div className="mb-5 leading-[25px]">
              <div className="text-5xl font-medium font-roboto text-gray-300 my-5">
               About Us
              </div>
              <Link
                className="text-base2 text-gray-400 block mb-2 hover:underline"
                href="/about-us"
              >
               About Us
              </Link>
            </div>

           


          </div>
        </div>
        {/* Copyright section  */}
        <div className="w-full text-gray-500 px-10 mx-auto">
          <div className="text-center">
            <div>
              Copyright 2024
              <strong>
                <span> altern8. </span>
              </strong>
              All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
