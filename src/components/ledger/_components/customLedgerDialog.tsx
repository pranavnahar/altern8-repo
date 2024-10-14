import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const CustomLedgerDialog = ({ isOpen, onClose, children }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isAnimating && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
                } ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
         [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]
         border-none overflow-auto h-[35rem] w-[82rem] max-w-[90vw] max-h-[90vh] rounded-lg
         transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <button onClick={onClose} className="float-right p-1 text-xl text-white rounded-md card-cover">
                        <X className='my-auto size-4' />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomLedgerDialog
