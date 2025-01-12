import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirectToInstagram: () => void;
}

const ShareMessageDialog: React.FC<ShareMessageDialogProps> = ({ isOpen, onClose, onRedirectToInstagram }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    const message = `Hey, check this out! Altern8 is a smart platform that connects real estate borrowers with patrons to raise funds for projects. They use AI and data science to simplify the process and deliver results quickly—just start with your mobile number. Have a look! ${window.location.href}`;
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose(); // Close the dialog after copy
        onRedirectToInstagram(); // Call the function to redirect to Instagram
      }, 2000); // Redirect after 2 seconds to give the user time to see the checkmark
    });
  };

  if (!isOpen) return null; // Only render if the dialog is open

  const dialogVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={dialogVariants}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="[background:linear-gradient(65.92deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050_99.08%),_#fff] p-6 rounded-lg w-96 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base text-gray-300 font-semibold text-center mb-4">Copy this message and you will be taken to Instagram automatically</h3>
        <textarea
          value={`Hey, check this out! Altern8 is a smart platform that connects real estate borrowers with patrons to raise funds for projects. They use AI and data science to simplify the process and deliver results quickly—just start with your mobile number. Have a look! ${window.location.href}`}
          readOnly
          className="w-full p-2 border rounded-md border-gray-700 text-sm mb-4 text-gray-400 bg-transparent"
          rows={6}
        />
        <button
          onClick={handleCopy}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
        >
          {copied ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-2">Copied! Redirecting...</span>
            </span>
          ) : (
            'Copy Message'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ShareMessageDialog;