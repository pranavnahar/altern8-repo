'use client';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Progress } from '../ui/progress';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/Utils/formatter';

interface DashboardGridsProps {
  data: any;
  user: 'customer' | 'borrower';
}

// {
//   "id": 3,
//   "user": "MSABFQ3092",
//   "project_name": "Downtown Skyline",
//   "project_type": "Residential",
//   "location": "City, State",
//   "pin_code": "123456",
//   "rera_regd_no": "ABC123",
//   "start_date": "2023-01-01",
//   "current_tranche_name": "First Phase",
//   "current_tranche_status": "In Progress",
//   "current_project_status": "In Progress",
//   "line_of_credit_used": "0.00",
//   "line_of_credit_available": "0.00",
//   "line_of_credit": "5000000.00",
//   "equity_commitment": "1000000.00",
//   "debt_commitment": "2000000.00",
//   "other_commitment": "500000.00",
//   "project_total": "8500000.00",
//   "percentage_complete_net": null,
//   "application_date": "2024-10-03T12:53:36.502085+05:30",
//   "project_completion_date": null,
//   "last_tranche_date": null,
//   "approved_by_admin": true
// }

const DashboardGrids: React.FC<DashboardGridsProps> = ({ data, user }) => {
  console.log('lol', data);
  const calc = data['%Complete (Net)'] ? String(data['%Complete (Net)']).replace('%', '') : '';
  const router = useRouter();
  const handleRoute = () => {
    const route =
      user === 'customer'
        ? `/project/${data?.id}?current_tab=Overview`
        : `/borrower/project/${data?.id}`;
    router.push(route);
  };
  return (
    <motion.div
      whileHover={{ scale: [null, 0.9, 0.9] }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={handleRoute}
      className="cursor-pointer h-full"
    >
      <Card className="w-full h-full text-white [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-none">
        <CardContent className="p-0 flex gap-3 items-center">
          <div className="relative w-1/2 h-[190px]">
            <Image
              src={
                'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              layout="fill"
              alt="card-img"
              className=" rounded-s-md"
            />
          </div>
          <div className="p-2 w-[50%]">
            {user === 'borrower' && <p className="text-xs">{'BO-0001'}</p>}
            <h3 className="text-base2 font-semibold capitalize">{data?.project_name}</h3>
            <p className="text-xs uppercase">{data?.location}</p>

            <div className=" my-3">
              <a href="#" target="_blank" className="text-blue-600 underline text-[13px]">
                {data?.currentDraw} {data?.active && `on ${data?.date}`}
              </a>
            </div>

            <p className="text-xs">Equity Commitment: {formatINR(data.equity_commitment)}</p>
            <p className="text-xs">Debit Commitment: {formatINR(data.debt_commitment)}</p>
            <p className="text-xs">
              ₹ {formatINR(data?.line_of_credit_used)} / {formatINR(data?.line_of_credit_available)}{' '}
              Total
            </p>

            <Progress value={Number(calc)} className="h-[8px] my-3 bg-black" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardGrids;
