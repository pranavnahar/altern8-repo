'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Checkout from '../../../components/Razorpay/Checkout';
import AnimatedLogo from '@/components/Header/AnimatedLogo';

const defaultPriceBreakdown = {
  subtotal: 1000,
  tax: 100,
  shipping: 50,
};

const defaultVouchers = [
  { code: 'DISCOUNT10', description: '10% off', discount: 0.1 },
  { code: 'DISCOUNT20', description: '20% off', discount: 0.2 },
  { code: 'DISCOUNT50', description: '50 off', discount: 50 },
];

const Page = ( data:any ) => {
  const [priceBreakdown, setPriceBreakdown] = useState(defaultPriceBreakdown);
  const [vouchers, setVouchers] = useState(defaultVouchers);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    const newPriceBreakdown = { ...priceBreakdown };

    // Update price breakdown based on the fetched data
    if (data.bankDetails) {
      newPriceBreakdown.subtotal += data.bankDetails.subtotal || 0;
    }
    if (data.voucherDetails) {
      setVouchers(data.voucherDetails);
    }
    if (data.creditDetails) {
      newPriceBreakdown.tax += data.creditDetails.tax || 0;
    }
    if (data.calendarDetails) {
      newPriceBreakdown.shipping += data.calendarDetails.shipping || 0;
    }
    if (data.borrowerFlowCharges) {
      newPriceBreakdown.subtotal += data.borrowerFlowCharges.subtotal || 0;
    }

    setPriceBreakdown(newPriceBreakdown);
  }, [data]);

  const totalBeforeDiscount = priceBreakdown.subtotal + priceBreakdown.tax + priceBreakdown.shipping;
  const totalAfterDiscount = totalBeforeDiscount - (discount > 1 ? discount : totalBeforeDiscount * discount);

  const handleVoucherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voucherCode = event.target.value;
    const voucher = vouchers.find((v) => v.code === voucherCode);
    if (voucher) {
      setSelectedVoucher(voucherCode);
      setDiscount(voucher.discount);
    } else {
      setSelectedVoucher(null);
      setDiscount(0);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] text-white">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, delay: 0.3 }}
        className="m-5 w-11/12 lg:w-[50%] mx-auto shadow-xl rounded-2xl pb-2 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] py-6"
      >
        <h1 className='text-center'><AnimatedLogo /></h1>
        <h1 className='text-center text-3xl mt-5'>Payment Checkout</h1>
        <div className="p-5 flex-col justify-center items-center my-5">
          <h2 className="text-xl font-semibold">Price Breakdown :-</h2>
          <table className="w-full mt-4">
            <tbody>
              <tr>
                <th className="text-left">Subtotal:</th>
                <td className="text-right">₹{priceBreakdown.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th className="text-left">Tax:</th>
                <td className="text-right">₹{priceBreakdown.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <th className="text-left">Total Before Discount:</th>
                <td className="text-right">₹{totalBeforeDiscount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <label htmlFor="voucher" className="block text-sm font-medium">Select Voucher:</label>
            <select
              id="voucher"
              className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600"
              value={selectedVoucher ?? ''}
              onChange={handleVoucherChange}
            >
              <option value="" className="bg-[#2c173c] text-gray-100 w-full rounded-md outline-none hover:bg-[#602b4c]">-- Select a Voucher --</option>
              {vouchers.map((voucher) => (
                <option key={voucher.code} value={voucher.code}>
                  {voucher.description}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-2">Discount: {discount > 1 ? `₹ ${discount.toFixed(2)}` : `${(discount * 100).toFixed(0)}%`}</p>
          <p className="font-semibold text-center text-2xl my-5">Total : ₹{totalAfterDiscount.toFixed(2)}</p>
        </div>

        <Checkout amount={totalAfterDiscount.toFixed(2)} />
      </motion.div>
    </div>
  );
};

export default Page;
