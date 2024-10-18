/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Progress } from '../../../components/ui/progress';
import List from '../../../components/List/List';
import TodoList from '../../../components/TodoList/TodoList';
import { datasList } from '../../../app/(dashboard)/projects/page';
import ProgressCircle from '../../../components/ProgressCircle/ProgressCircle';
import { useParams, useRouter } from 'next/navigation';
import { FilterSheet } from '../../../components/TimeLine/FilterSheet';
import StakeHolderModal from './StakeHolderModal';
import DrawTable from '../../../components/CustomizedTable/CustomizedTable';
import { BaseHeaderProps, BaseTableData } from '../../../lib/componentProps';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';
import { formatINR, formatDate } from '../../../utils/formatter';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import InventorySheet from './InventorySheet';
import { fetchTranchData } from '../../../app/(dashboard)/project/actions/fetch-tranch.actions';

interface ProjectOverViewProps {
  user: 'customer' | 'borrower';
  openDrawForm?: () => void;
}

interface ProjectData {
  date: string;
  label: string;
  percentage: number;
}

interface DataRow {
  category: string;
  count: number | string;
  amount: string;
}

//
const InventoryTable: React.FC = () => {
  const initialData: DataRow[] = [
    { category: 'Lots', count: 101, amount: 'N/A' },
    // { category: "Specs", count: 50, amount: "N/A" },
    { category: 'Foundation Starts', count: 12, amount: 'N/A' },
    { category: 'Models', count: 10, amount: 'N/A' },
    { category: 'Started/Completed', count: 20, amount: 'N/A' },
    { category: 'Units', count: 100, amount: 'N/A' },
    { category: 'Contingent Sales', count: 0, amount: 'N/A' },
  ];

  const [data, setData] = useState<DataRow[]>(initialData);

  const handleInputChange = (index: number, field: keyof DataRow, value: string) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  return (
    <Card className="border-0 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] p-2 text-white rounded-lg ">
      <div className="flex items-center justify-between text-sm">
        <h2 className="text-nowrap py-2">Inventory</h2>
        <Sheet>
          <SheetTrigger>
            <Button
              variant={'outline'}
              className=" bg-themeBlue border-0 text-white hover:bg-themeBlue hover:bg-transparent bg-[#1565c0]"
            >
              Add Inventory
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-auto w-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-0">
            <InventorySheet />
          </SheetContent>
        </Sheet>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Count</TableHead>
            <TableHead className="text-center">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.count}
                  className="text-black bg-gray-200"
                  onChange={e => handleInputChange(index, 'count', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={item.amount}
                  className="text-black bg-gray-200"
                  onChange={e => handleInputChange(index, 'amount', e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const OverView = ({ user, openDrawForm }: ProjectOverViewProps) => {
  const [tranches, setTranches] = useState<string[]>([]);

  const [stakeHolderModal, setStakeHolderModal] = useState<boolean>(false);
  const radius = 30;
  const stroke = 10;
  //Datas for budget table
  const projectDatas: BaseTableData[] = [
    {
      category: 'Fees & Interest',
      used: '₹ 254,932.5',
      budget: '₹ 904,133.0',
    },
    {
      category: 'Soft Costs',
      used: '₹ 167,350.0',
      budget: '₹ 392,827.0',
    },
    // {
    //   category: "Land Costs",
    //   used: "₹ 1,205,836.0",
    //   budget: "₹ 3,158,302.0",
    // },
    {
      category: 'Hard Costs',
      used: '₹ 610,615.8',
      budget: '₹ 681,543.8',
    },
    {
      category: 'Total',
      used: '₹ 2,238,734.3',
      budget: '₹ 11,324,431.0',
    },
  ];
  //headers for the budget table
  const tableHeaders: BaseHeaderProps[] = [
    {
      key: 'category',
      title: '',
    },
    {
      key: 'used',
      title: 'Used',
    },
    {
      key: '',
      compareKeys: ['used', 'budget'] as (keyof BaseTableData)[],
      title: '',
    },
    {
      key: 'budget',
      title: 'Budget',
    },
  ];
  const listData: datasList[] = [
    {
      label: 'Interest Reserves',
      value: '₹ 10,00,438.00',
    },
    {
      label: 'Development Fee',
      value: '₹ 50,04,219.00',
    },
    {
      label: 'Tranche/Inspector Fees',
      value: '₹ 1,66,805.00',
    },
    {
      label: 'Legal',
      value: '₹ 10,83,445.00',
    },
    {
      label: 'Architect',
      value: '₹ 19,99,861.00',
    },
    {
      label: 'Engineering',
      value: '₹ 5,83,017.00',
    },
    {
      label: 'Title Insurance',
      value: '₹ 3,16,927.00',
    },
    {
      label: 'Environmental',
      value: '₹ 3,99,534.00',
    },
    {
      label: 'Soft Cost Contingency',
      value: '₹ 37,35,000.00',
    },
    {
      label: 'Site Acquisition',
      value: '₹ 1,00,08,388.00',
    },
    {
      label: 'GENERAL REQUIREMENTS',
      value: '₹ 44,03,413.00',
    },
    {
      label: 'CONCRETE',
      value: '₹ 1,34,69,621.00',
    },
    {
      label: 'MASONRY',
      value: '₹ 52,12,000.00',
    },
    {
      label: 'METAL',
      value: '₹ 30,06,000.00',
    },
    {
      label: 'WOOD & PLASTICS',
      value: '₹ 1,70,65,031.00',
    },
    {
      label: 'THERMAL & MOISTURE',
      value: '₹ 78,39,433.00',
    },
    {
      label: 'OPENINGS',
      value: '₹ 40,16,949.00',
    },
    {
      label: 'FINISHES',
      value: '₹ 40,16,949.00',
    },
    {
      label: 'SPECIALTIES',
      value: '₹ 46,231.00',
    },
  ];

  // for the Task List data
  const taskListData = [
    {
      label: 'Land Acqusion  1',
      value: 'Complete',
      date: '01/02/2024',
    },
    {
      label: 'Land Acqusion  2',
      value: 'Complete',
      date: '01/02/2024',
    },
    {
      label: 'Land Acqusion  3',
      value: 'Complete',
      date: '01/02/2024',
    },
  ];
  const projectCompletion: ProjectData[] = [
    {
      date: '06/27/2024',
      label: 'Project Completion',
      percentage: 50,
    },
    {
      date: '06/27/2024',
      label: 'Tranche Completion',
      percentage: 50,
    },
  ];
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);
  const [open, setOpen] = useState<boolean>(false);
  // Budget Table
  const BudgetTable = () => {
    return (
      <Card className="rounded-lg border-0 my-2 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] p-2 text-white ">
        <DrawTable tableData={projectDatas} headers={tableHeaders} />
      </Card>
    );
  };
  // Funding source progress
  const FundingSource = () => {
    const data = [
      {
        type: 'EQUITY',
        contributed: '₹ 1,590,709.00',
        total: '₹ 1,590,709.00',
      },
      {
        type: 'DEBT',
        contributed: '₹ 1,590,709.00',
        total: '₹ 9,733,722.00',
      },
      {
        type: 'SECONDARY DEBT',
        contributed: '₹  8,090,709.00',
        total: '₹ 11,324,431.00',
      },
      {
        type: 'TOTAL',
        contributed: '₹  1,590,709.00',
        total: '₹ 11,324,431.00',
      },
    ];

    const parseValue = (value: string) => {
      // Remove currency symbol and commas, then parse as float
      return parseFloat(value.replace(/[^0-9.-]+/g, ''));
    };

    return (
      <Card className="p-2 text-sm [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white h-fit">
        <div className="flex items-center justify-between text-sm">
          <p className="text-nowrap">Funding Sources Overview</p>
          <Button
            variant={'link'}
            className="text-themeBlue text-sm"
            onClick={() => router.push('/draw/3?current_tab=Funding%20Sources')}
          >
            Funding Source Details
          </Button>
        </div>
        <div>
          {data.map((item, index) => {
            const contributedValue = parseValue(item.contributed);
            const totalValue = parseValue(item.total);
            const progressValue = (contributedValue / totalValue) * 100;

            return (
              <div key={index}>
                <div>{item.type}</div>
                <div className="flex items-center justify-between">
                  <p>
                    {item.contributed} <strong>Contributed</strong>
                  </p>
                  <p>{item.total}</p>
                </div>
                <Progress value={progressValue} className="h-[8px] my-3 bg-black" />
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  useEffect(() => {
    const handleFetchTranch = async (projectId: number) => {
      //@ts-expect-error data types
      const data: { results: string[] } = await fetchTranchData(projectId);
      setTranches(data.results);
    };

    handleFetchTranch(projectId);
  }, []);

  const DrawContainer = ({
    tranch,
  }: {
    tranch: {
      id: string;
      tranche_name: string;
      tranche_end_date: string;
      tranche_total: string;
    };
  }) => {
    const handleClick = () => {
      const route =
        user === 'customer' ? `/draw/${projectId}` : `/borrower/project/draw/${projectId}`;
      router.push(route);
    };
    return (
      <Card
        onClick={handleClick}
        className="p-2 px-4 text-sm z-50 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-l-8 cursor-pointer bg-slate-100 hover:border-themeBlue"
      >
        <h1 className="capitalize">
          {tranch.id}: {tranch.tranche_name}
        </h1>
        <div className="my-2">
          <p className=" capitalize text-base">Active</p>
          <p className="text-xs">{formatDate(tranch.tranche_end_date)}</p>
        </div>
        <div className="my-2 flex gap-3">
          <p>Tranche Total:</p>
          <p>{formatINR(tranch.tranche_total)}</p>
        </div>
      </Card>
    );
  };

  return (
    <>
      <div className=" flex p-2">
        <div className={user === 'customer' ? 'w-[73%]' : 'w-[100%]'}>
          <div className="flex ">
            <div className="p-2">
              <div className="my-2">
                <p className="text-white">PROJECT</p>
                {/* info card */}
                <Card className="flex items-center [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white gap-3 ">
                  <div className="flex items-center gap-3">
                    <div className="relative h-[230px] w-[250px]">
                      <Image
                        src={
                          'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        }
                        layout="fill"
                        alt="project_image"
                        className=" rounded-l-xl"
                      />
                    </div>
                    <div>
                      {user === 'borrower' && <p className="text-xs mb-1">{'BO-0001'}</p>}
                      <p className="text-base">1460 Comal Project</p>
                      <p className="text-xs uppercase ">Delhi, India</p>

                      <div className="my-1">
                        <div
                          className="text-blue-600 text-[13px] cursor-pointer"
                          onClick={() => router.push('/draw/3')}
                        >
                          Tranche 3 - started on 9/14/2023
                        </div>
                      </div>

                      <div className="my-1">
                        <p className="text-sm uppercase">BORROWER</p>
                        <p className="text-sm">Joseph Contracting</p>
                      </div>

                      <div className="my-2">
                        <p className="text-sm uppercase">General Contractor</p>
                        <p className="text-sm">Joseph Contracting</p>
                      </div>

                      <div
                        className="text-blue-600 text-[13px] cursor-pointer"
                        onClick={() => setStakeHolderModal(true)}
                      >
                        View all stakeholders
                      </div>
                    </div>
                  </div>
                  <div className="mx-3 w-[33%] flex items-center flex-col gap-4 justify-center">
                    <div className="flex items-center gap-4 justify-between">
                      {projectCompletion.map((data, index) => (
                        <div
                          key={index}
                          className="text-sm flex justify-center items-center flex-col"
                        >
                          <p className="text-center text-sm">{data?.label}</p>
                          <div className="my-2">
                            <ProgressCircle
                              radius={radius}
                              stroke={stroke}
                              progress={data?.percentage}
                            />
                          </div>
                          <strong className=" my-2">{data?.date}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
              {/*  Tranche section*/}
              <div className="my-2">
                <p className="text-white">TRANCHE'S</p>
                <Card className="p-2 px-5 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
                  <Button
                    className="bg-transparent text-white hover:bg-transparent hover:text-white"
                    variant="outline"
                    onClick={openDrawForm}
                  >
                    Create New Tranche
                  </Button>
                  <div className="flex flex-wrap my-3 items-center gap-3">
                    {tranches &&
                      tranches.map((tranch: any, index: number) => (
                        <DrawContainer tranch={tranch} key={index} />
                      ))}
                  </div>
                </Card>
              </div>
            </div>
            {/* Comment section */}
            {user === 'customer' ? (
              // <div className="py-4 px-2 w-[35%]">
              //   <p className="text-white">PROJECT CHAT</p>
              //   <Textarea
              //     placeholder="Type a comment here."
              //     className="h-48 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white"
              //   />
              //   <div className="my-2 h-[310px] overflow-y-scroll">
              //     <Comments />
              //     <Comments />
              //     <Comments />
              //     <Comments />
              //     <Comments />
              //   </div>
              // </div>
              <></>
            ) : (
              // budget table and funcing table
              <div className="mt-10 flex flex-col gap-5 ml-5 w-1/2">
                <BudgetTable />
                <FundingSource />
              </div>
            )}
          </div>
          {/*budget table */}
          {user === 'customer' && (
            <div className="my-1 flex gap-4">
              <div className="w-1/2">
                <InventoryTable />
              </div>
              {/* Funding source overview */}
              <div className="w-1/2 ">
                <FundingSource />
                <BudgetTable />
              </div>
            </div>
          )}
        </div>

        {/* todo list */}
        {user === 'customer' && (
          <div className="w-[27%] p-2 text-white">
            <TodoList listData={listData} />
            <Card className="my-2 m-1 p-1 border-none text-white [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
              <div className="flex items-center justify-between pl-2 border-b-gray-100 text-sm">
                <p className="text-nowrap">Tasks</p>
                <div className="flex items-center">
                  <Button
                    variant={'link'}
                    className="text-themeBlue text-sm"
                    onClick={() => setOpen(true)}
                  >
                    Add Tasks
                  </Button>
                  <Button
                    variant={'link'}
                    className="text-themeBlue text-sm"
                    onClick={() => router.push('?current_tab=Timeline')}
                  >
                    Edit Tasks
                  </Button>
                </div>
              </div>
              <div className="mb-1">
                <List
                  data={taskListData}
                  keyToMap={['label', 'date', 'value']}
                  className={'text-sm'}
                />
              </div>
            </Card>
            <FilterSheet open={open} onOpenChange={() => setOpen(false)} />
          </div>
        )}
        <StakeHolderModal open={stakeHolderModal} onHide={() => setStakeHolderModal(false)} />
      </div>
    </>
  );
};

export default OverView;
