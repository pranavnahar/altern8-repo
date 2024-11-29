
"use client"
import { useToast } from '@/utils/show-toasts';
import React, { useEffect, useState } from 'react';

const Checkout : React.FC<{amount:string}> = ({amount}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {showToast} = useToast()

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('Razorpay script loaded successfully');
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setError('Failed to load Razorpay script');
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount)*100, 
          currency: 'INR',
          receipt: 'receipt#1',
        }),
      });

      if (!response.ok) {
        showToast({
          message: `Error: ${response.status} ${response.statusText}`,
          type: 'error'
        });
      }

      const order = await response.json();
      if (!order.id) {
        showToast({
          message: `error from razorpay`,
          type: 'error'
        });
      }

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: order.amount,
        currency: order.currency,
        name: 'Altern8',
        description: 'Test Transaction',
        order_id: order.id,
        handler: (response: any) => {
          alert(`Payment ID: ${response.razorpay_payment_id}`);
          alert(`Order ID: ${response.razorpay_order_id}`);
          alert(`Signature: ${response.razorpay_signature}`);
          //  successful payment 
        },
        prefill: {
          name: 'John Doe',
          email: 'email@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
          //  payment failure 
        });

        rzp.open();
      } else {
        showToast({
          message: `sdk not loaded`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
    }

    setLoading(false);
  };

  return (
   <div className=' flex justify-center items-center mb-3'>
      <button
                onClick={() => handlePayment()}
                className="bg-[#1565c0] text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-[#2680e6] hover:text-white transition duration-200 ease-in-out"
              >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
              </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
  </div>
  );
};

export default Checkout;
