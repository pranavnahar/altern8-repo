/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  File,
  Filter,
  LayoutGrid,
  LayoutList,
  Save,
  SlidersHorizontal,
  View,
} from 'lucide-react';
import DashboardGrids from '../DashboardGrids/DashboardGrids';
import { AnimatePresence } from 'framer-motion';
import { BaseHeaderProps, BaseTableData } from '../../lib/componentProps';
import { useRouter } from 'next/navigation';
import { InputForms } from '../InputForms/InputForms';
import { FormInput } from '../LedgerTypeTable/Filter';
import FilterDrawer from '../FilterDrawer/FilterDrawer';
import TodoList from '../TodoList/TodoList';
import BasicTable from '../global/basic-table';
import { fetchProjectData } from '@/app/(dashboard)/projects/actions';
import columns from '@/app/(dashboard)/projects/columns';

interface datasList {
  label: string;
  value: string;
}

const DashboardTableFilter: React.FC = () => {
  const router = useRouter();
  const tableHeaders: BaseHeaderProps[] = [
    {
      title: 'Project',
      classname: 'w-[100px]',
      key: 'project',
      onClick: row => router.push(`/project/${row?.project}?current_tab=Overview`),
    },
    {
      title: 'Location',
      classname: '',
      key: 'location',
    },
    {
      title: 'Line of Credit',
      classname: '',
      key: 'lineOfCredit',
    },
    {
      title: 'Equity Commitment',
      classname: '',
      key: 'equityCommitment',
    },
    {
      title: 'Debt Commitment',
      classname: '',
      key: 'debtCommitment',
    },
    {
      title: 'Other Commitment',
      classname: '',
      key: 'otherCommitment',
    },
    {
      title: 'Project Total',
      classname: '',
      key: 'projectTotal',
    },
    {
      title: 'Amount Remaining',
      classname: '',
      key: 'accountRemaining',
    },
    {
      title: '% Complete (Net)',
      classname: '',
      key: '%Complete (Net)',
    },
    {
      title: 'Current Tranche',
      classname: '',
      key: 'currentDraw',
    },
    {
      title: 'Time',
      classname: '',
      key: 'time',
    },
    {
      title: 'Date',
      classname: '',
      key: 'date',
    },
  ];
  const [gridType, setGridType] = useState<boolean>(false);
  const [customizeModal, setCustomizeModal] = useState<boolean>(false);
  const [headers, setHeaders] = useState<BaseHeaderProps[]>(tableHeaders);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<any>([]);

  useEffect(() => {
    const handleFetchProjects = async () => {
      const data = await fetchProjectData();
      setProjects(data);
    };
    handleFetchProjects();
  }, []);

  let formInputs: FormInput[] = [
    {
      type: 'text',
      label: 'Project Name',
      name: 'projectName',
      placeholder: 'Project Name',
      required: true,
      errMsg: 'Please fill this out!',
    },
    {
      type: 'text',
      label: 'Location',
      name: 'location',
      placeholder: 'Your Location',
      required: false,
    },
    {
      type: 'text',
      label: 'Line of Credit',
      name: 'lineOfCredit',
      placeholder: 'Line of Credit',
      required: false,
    },
    {
      type: 'text',
      label: 'Equity Commitment',
      name: 'equityCommitment',
      placeholder: 'Equity Commitment',
      required: false,
    },
    {
      type: 'text',
      label: 'Debt Commitment',
      name: 'debtCommitment',
      placeholder: 'Debt Commitment',
      required: false,
    },
    {
      type: 'text',
      label: 'Other Commitment',
      name: 'otherCommitment',
      placeholder: 'Other Commitment',
      required: false,
    },

    {
      type: 'text',
      label: 'Project Total',
      name: 'projectTotal',
      placeholder: 'Project Total',
      required: false,
    },
    {
      type: 'number',
      label: 'Account Remaining',
      name: 'accountRemaining',
      placeholder: 'Account Remaining',
      required: false,
    },
    {
      type: 'number',
      label: '% Complete (Net)',
      name: 'percentCompleteNet',
      placeholder: 'Enter the percentage',
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: 'date',
      label: 'Application Date',
      name: 'percentCompleteNet',
      placeholder: 'Enter the percentage',
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: 'date',
      label: 'LOC Date',
      name: 'percentCompleteNet',
      placeholder: 'Enter the percentage',
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: 'number',
      label: '% Complete (Net)',
      name: 'percentCompleteNet',
      placeholder: 'Enter the percentage',
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: 'date',
      label: ' Project Completion date',
      name: 'percentCompleteNet',
      placeholder: 'Enter the percentage',
      required: false,
      min: 0,
      max: 100,
    },
    {
      type: 'date',
      label: 'Last Tranche date',
      name: 'percentCompleteNet',
      placeholder: 'Enter the percentage',
      required: false,
      min: 0,
      max: 100,
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
      label: 'General Requirements',
      value: '₹ 44,03,413.00',
    },
    {
      label: 'Concrete',
      value: '₹ 1,34,69,621.00',
    },
    {
      label: 'Masonry',
      value: '₹ 52,12,000.00',
    },
    {
      label: 'Metal',
      value: '₹ 30,06,000.00',
    },
    {
      label: 'Wood & Plastics',
      value: '₹ 1,70,65,031.00',
    },
    {
      label: 'Thermal & Moisture',
      value: '₹ 78,39,433.00',
    },
    {
      label: 'Openings',
      value: '₹ 40,16,949.00',
    },
    {
      label: 'Finishes',
      value: '₹ 40,16,949.00',
    },
    {
      label: 'Specialties',
      value: '₹ 46,231.00',
    },
  ];

  const filterSection = tableHeaders.map(header => header?.title);

  console.log(projects.results);

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Main content: adjusting its margin based on the sidebar's width */}
        <div className="w-[75%]">
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full p-4 rounded-lg text-white"
          >
            {/* header */}
            <div className="flex gap-2">
              <Button variant="secondary" className="bg-themeBlue text-white">
                Charts
              </Button>
              <div className="flex items-center gap-1 w-full p-1 border-b border-b-gray-400">
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  Project List
                </motion.p>
                <motion.div
                  className="flex items-center gap-1 relative bg-black rounded-lg ml-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 w-1/2 bg-themeBlue rounded-lg"
                    animate={{ x: gridType ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <div
                    className={`p-1 rounded-lg cursor-pointer z-20`}
                    onClick={() => setGridType(false)}
                  >
                    <LayoutList size={15} color={!gridType ? 'white' : '#555'} />
                  </div>
                  <div
                    className={`p-1 rounded-lg cursor-pointer z-20`}
                    onClick={() => setGridType(true)}
                  >
                    <LayoutGrid size={15} color={gridType ? 'white' : '#555'} />
                  </div>
                </motion.div>
              </div>
              <Button
                className="bg-themeBlue hover:bg-blue-700 bg-[#1565c0]"
                onClick={() => setOpenFormModal(true)}
              >
                <CirclePlus className="mr-1 " /> Add Project
              </Button>
            </div>

            <AnimatePresence>
              {/* filter and table */}
              {!gridType ? (
                <>
                  {/* Filter Section */}
                  <motion.div
                    className="flex items-end justify-between my-3 m-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-end gap-3">
                      <div className="text-black">
                        <strong className="text-xs text-white">Search By:</strong>
                        <Select>
                          <SelectTrigger className="w-[180px] bg-gray-200">
                            <SelectValue
                              className="text-black bg-gray-300"
                              placeholder="Select by column"
                            />
                          </SelectTrigger>
                          <SelectContent className="text-black bg-gray-200">
                            <SelectGroup>
                              {filterSection?.map((filter, index) => (
                                <SelectItem key={index} value={filter}>
                                  {filter}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Input
                          className="text-black bg-gray-200"
                          type="search"
                          placeholder="Search"
                        />
                      </div>
                      <div>
                        <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
                          <Filter />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-black">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-[#1565c0] text-white">
                              Take Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setCustomizeModal(true)}>
                              <SlidersHorizontal size={18} className="mr-2" />
                              Customize Columns...
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Boxes size={18} className="mr-2" />
                              Group By...
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Save size={18} className="mr-2" />
                              Save Current View...
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <View size={18} className="mr-2" />
                              Manage Views...
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <File size={18} className="mr-2" />
                              Export to csv
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <File size={18} className="mr-2" />
                              Export to Excel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Button variant="secondary" className="">
                        <ChevronLeft />
                      </Button>
                      <Button variant="secondary">
                        <ChevronRight />
                      </Button>
                    </div>
                  </motion.div>

                  {/* Table with Horizontal Scroll */}
                  <BasicTable
                    data={projects.results || []}
                    columns={columns}
                    filters={[]}
                    needFilters={false}
                  />
                </>
              ) : (
                // gridview for projects
                <div className="flex gap-2 items-center justify-center flex-wrap p-2">
                  {projects &&
                    projects.results.map((project: any, index: number) => (
                      <div className="w-[48%] p-2" key={index}>
                        <DashboardGrids data={project} user="customer" />
                      </div>
                    ))}
                </div>
              )}
            </AnimatePresence>

            {/* for customizition columns modal */}
            {/* <CustomizeColumnModal
              tableHeaders={tableHeaders}
              customizeModal={customizeModal}
              setCustomizeModal={setCustomizeModal}
              tableData={projects}
              setHeaders={setHeaders}
              headers={headers}
            /> */}
            {/* Create Project Modal */}
            <InputForms
              title="Create New Project"
              data={formInputs}
              open={openFormModal}
              onOpenChange={() => setOpenFormModal(false)}
            />
            <FilterDrawer
              open={filtersOpen}
              onOpenChange={() => setFiltersOpen(false)}
              title="Project Filter"
            />
          </motion.div>
        </div>
        <div className="w-[20%] h-full p-4 overflow-auto fixed right-0 top-20">
          <TodoList listData={listData} />
        </div>
      </div>
    </>
  );
};

export default DashboardTableFilter;
