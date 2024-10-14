'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  File,
  Filter,
  Save,
  SlidersHorizontal,
  View,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { InputForms } from '../InputForms/InputForms';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Checkbox } from '../ui/checkbox';
import AddBudgetSheet from './AddBudgetSheet';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export type FormInput = {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  errMsg?: string;
  min?: number;
  max?: number;
  values?: string | null | number | string[];
  allowedTypes?: string;
};

export type budgetFilterProps = {
  selectedTab: 'current budget' | 'adjustment over time' | 'requested over time' | 'draw budget';
  submitAction?: () => void;
  setSelectedTableView?: (view: 'current_budget' | 'adjustment_over') => void;
  selectedTableView?: 'current_budget' | 'adjustment_over';
};

type HeaderConfig = {
  text: string;
  colspan?: number;
  className?: string;
  wrap?: number;
  key?: string;
};

type headerProps = {
  topHeaders: HeaderConfig[];
  subHeaders: HeaderConfig[];
  colums: HeaderConfig[];
};

interface AccordionComponentProps {
  headersConfig: headerProps;
}

interface Item {
  name: string;
  originalBudget: number;
  adjustments: number;
  currentBudget: number;
  draw3: number;
  draw3originalBudget: number;
  draw3currentBudget: number;
  draw2: number;
  draw2originalBudget: number;
  draw2currentBudget: number;
  draw1: number;
  draw1originalBudget: number;
  draw1currentBudget: number;
  type?: string;
}

interface Category {
  category: string;
  items: Item[];
}

interface FilterModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// interface TableProps {
//   tableData: Category[];
//   headersConfig: {
//     topHeaders: HeaderConfig[];
//     subHeaders: HeaderConfig[];
//   };
// }

//accordian for the column checkbox part
const AccordionComponent: React.FC<AccordionComponentProps> = ({ headersConfig }) => {
  let columnIndex = 0;

  return (
    <Accordion type="multiple">
      {headersConfig.topHeaders.map((topHeader, topIndex) => {
        const wrap = topHeader.wrap ?? 0;

        const relevantSubHeaders = headersConfig.subHeaders.slice(columnIndex, columnIndex + wrap);

        if (!topHeader.text) {
          return relevantSubHeaders.map((subHeader, subIndex) => {
            const subWrap = subHeader.wrap ?? 0;
            const columnsForSubHeader = headersConfig.colums.slice(
              columnIndex,
              columnIndex + subWrap,
            );
            columnIndex += subWrap;

            if (subHeader.text) {
              return (
                <Accordion key={`sub-${subIndex}`} type="single" collapsible>
                  <AccordionItem value={`sub-${subIndex}`}>
                    <AccordionTrigger>{subHeader.text}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {columnsForSubHeader.map((column, colIndex) => (
                          <div
                            key={`col-${subIndex}-${colIndex}`}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox id={column.key} />
                            <label htmlFor={column.key} className="text-sm font-medium">
                              {column.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            } else {
              return (
                <div key={`sub-${subIndex}`} className="space-y-2">
                  {columnsForSubHeader.map((column, colIndex) => (
                    <div
                      key={`col-${subIndex}-${colIndex}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={column.key} />
                      <label htmlFor={column.key} className="text-sm font-medium">
                        {column.text}
                      </label>
                    </div>
                  ))}
                </div>
              );
            }
          });
        }

        return (
          <AccordionItem key={`top-${topIndex}`} value={`top-${topIndex}`}>
            <AccordionTrigger>{topHeader.text}</AccordionTrigger>
            <AccordionContent>
              {relevantSubHeaders.map((subHeader, subIndex) => {
                const subWrap = subHeader.wrap ?? 0;
                const columnsForSubHeader = headersConfig.colums.slice(
                  columnIndex,
                  columnIndex + subWrap,
                );
                columnIndex += subWrap;
                if (subHeader.text) {
                  return (
                    <Accordion key={`sub-${subIndex}`} type="single" collapsible>
                      <AccordionItem value={`sub-${subIndex}`}>
                        <AccordionTrigger>{subHeader.text}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {columnsForSubHeader.map((column, colIndex) => (
                              <div
                                key={`col-${subIndex}-${colIndex}`}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox id={column.key} />
                                <label htmlFor={column.key} className="text-sm font-medium">
                                  {column.text}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                } else {
                  return (
                    <div key={`sub-${subIndex}`} className="space-y-2">
                      {columnsForSubHeader.map((column, colIndex) => (
                        <div
                          key={`col-${subIndex}-${colIndex}`}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={column.key} />
                          <label htmlFor={column.key} className="text-sm font-medium">
                            {column.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  );
                }
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

//customize column modal
const FilterModal = ({ open, setOpen }: FilterModalProps) => {
  const tableData: Category[] = [
    {
      category: 'Fees & Interest',
      items: [
        {
          name: 'Interest Reserves',
          originalBudget: 120583.0,
          adjustments: 0.0,
          currentBudget: 120583.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Development Fee',
          originalBudget: 602918.0,
          adjustments: 0.0,
          currentBudget: 602918.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Tranche/Inspector Fees',
          originalBudget: 20097.0,
          adjustments: 0.0,
          currentBudget: 20097.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Legal',
          originalBudget: 110535.0,
          adjustments: 50000.0,
          currentBudget: 160535.0,
          draw3: 30000.0,
          draw3originalBudget: 30000.0,
          draw3currentBudget: 30000.0,
          draw2: 20000.0,
          draw2originalBudget: 20000.0,
          draw2currentBudget: 20000.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Fees & Interest Subtotal',
          originalBudget: 854133.0,
          adjustments: 50000.0,
          currentBudget: 904133.0,
          draw3: 30000.0,
          draw3originalBudget: 30000.0,
          draw3currentBudget: 30000.0,
          draw2: 20000.0,
          draw2originalBudget: 20000.0,
          draw2currentBudget: 20000.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
          type: 'subtotal',
        },
      ],
    },
    {
      category: 'Soft Costs',
      items: [
        {
          name: 'Architect',
          originalBudget: 241167.0,
          adjustments: 0.0,
          currentBudget: 241167.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Engineering',
          originalBudget: 70243.0,
          adjustments: 0.0,
          currentBudget: 70243.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Title Insurance',
          originalBudget: 38184.0,
          adjustments: 0.0,
          currentBudget: 38184.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Environmental',
          originalBudget: 48233.0,
          adjustments: 0.0,
          currentBudget: 48233.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Soft Cost Contingency',
          originalBudget: 45000.0,
          adjustments: -50000.0,
          currentBudget: -5000.0,
          draw3: -50000.0,
          draw3originalBudget: -50000.0,
          draw3currentBudget: -50000.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'General Requirements',
          originalBudget: 4403413.0,
          adjustments: 0.0,
          currentBudget: 4403413.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Soft Costs Subtotal',
          originalBudget: 442827.0,
          adjustments: -50000.0,
          currentBudget: 392827.0,
          draw3: -50000.0,
          draw3originalBudget: -50000.0,
          draw3currentBudget: -50000.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
          type: 'subtotal',
        },
      ],
    },
    {
      category: 'Hard Costs',
      items: [
        {
          name: 'Site Acquisition',
          originalBudget: 10008388.0,
          adjustments: 0.0,
          currentBudget: 10008388.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Concrete',
          originalBudget: 13469621.0,
          adjustments: 0.0,
          currentBudget: 13469621.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Masonary',
          originalBudget: 5212000.0,
          adjustments: 0.0,
          currentBudget: 5212000.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Metal',
          originalBudget: 3006000.0,
          adjustments: 0.0,
          currentBudget: 3006000.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Wood & Plastics',
          originalBudget: 17065031.0,
          adjustments: 0.0,
          currentBudget: 17065031.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Thermal & Moisture',
          originalBudget: 7839433.0,
          adjustments: 0.0,
          currentBudget: 7839433.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Openings',
          originalBudget: 4016949.0,
          adjustments: 0.0,
          currentBudget: 4016949.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Finishes',
          originalBudget: 4016949.0,
          adjustments: 0.0,
          currentBudget: 4016949.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Specialities',
          originalBudget: 46231.0,
          adjustments: 0.0,
          currentBudget: 46231.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Hard Cost Contingency',
          originalBudget: 45000.0,
          adjustments: -50000.0,
          currentBudget: -5000.0,
          draw3: -50000.0,
          draw3originalBudget: -50000.0,
          draw3currentBudget: -50000.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
        },
        {
          name: 'Hard Costs Subtotal',
          originalBudget: 10008388.0,
          adjustments: 0.0,
          currentBudget: 10008388.0,
          draw3: 0.0,
          draw3originalBudget: 0.0,
          draw3currentBudget: 0.0,
          draw2: 0.0,
          draw2originalBudget: 0.0,
          draw2currentBudget: 0.0,
          draw1: 0.0,
          draw1originalBudget: 0.0,
          draw1currentBudget: 0.0,
          type: 'subtotal',
        },
      ],
    },
  ];
  const headersConfig: headerProps = {
    topHeaders: [
      { text: '', colspan: 1, wrap: 1 },
      { text: '', colspan: 1, wrap: 1 },
      { text: '', colspan: 1, wrap: 1 },
      { text: '', colspan: 1, wrap: 1 },
      { text: 'Tranche 3', colspan: 3, className: 'text-center', wrap: 1 },
      { text: 'Tranche 2', colspan: 3, className: 'text-center', wrap: 1 },
      { text: 'Tranche 1', colspan: 3, className: 'text-center', wrap: 1 },
    ],
    subHeaders: [
      { text: '', colspan: 1, wrap: 1 },
      { text: 'Budget it 9/14/2023', colspan: 1, wrap: 1 },
      { text: 'Budget it 9/14/2023', colspan: 1, wrap: 1 },
      { text: 'Budget it 9/14/2023', colspan: 1, wrap: 1 },
      { text: 'Active', colspan: 3, className: 'text-center', wrap: 3 },
      {
        text: 'Funded 9/14/2023',
        colspan: 3,
        className: 'text-center',
        wrap: 3,
      },
      {
        text: 'Funded 8/15/2023',
        colspan: 3,
        className: 'text-center',
        wrap: 3,
      },
    ],
    colums: [
      { text: 'Line Item', key: 'name' },
      { text: 'Original Budget', key: 'originalBudget' },
      { text: 'Adjustments', key: 'adjustments' },
      { text: 'Current Budget', key: 'currentBudget' },
      { text: 'Original Budget', key: 'draw3originalBudget' },
      { text: 'Adjustments', key: 'draw3' },
      { text: 'Current Budget', key: 'draw3currentBudget' },
      { text: 'Original Budget', key: 'draw2originalBudget' },
      { text: 'Adjustments', key: 'draw2' },
      { text: 'Current Budget', key: 'draw2currentBudget' },
      { text: 'Original Budget', key: 'draw1originalBudget' },
      { text: 'Adjustments', key: 'draw1' },
      { text: 'Current Budget', key: 'draw1currentBudget' },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inActiveHeaders, setInactiveHeaders] = useState<string[]>([]);

  const splitInActiveColumns = (data: Category[]): string[] => {
    if (data.length === 0) return [];

    const allKeys = Object.keys(data[0].items[0]);
    const headerKeys = headersConfig.colums.map(header => header.key);

    return allKeys.filter(key => !headerKeys.includes(key));
  };

  useEffect(() => {
    setInactiveHeaders(splitInActiveColumns(tableData));
  }, []);

  console.log(inActiveHeaders);

  // const handleToggleHeader = (key) => {
  //   setActiveHeaders((prev) => {
  //     const headerExists = prev.some((header) => header.key === key);
  //     if (headerExists) {
  //       return prev.filter((header) => header.key !== key);
  //     } else {
  //       return [
  //         ...prev,
  //         { key, title: key.replace(/([A-Z])/g, " $1").trim(), classname: "" },
  //       ];
  //     }
  //   });
  //   setInactiveHeaders((prev) =>
  //     prev.includes(key)
  //       ? prev.filter((header) => header !== key)
  //       : [...prev, key]
  //   );
  // };

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
      <AlertDialogContent className="w-[30vw]  [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] mx-auto text-white border-0">
        <AlertDialogHeader>Customize Columns</AlertDialogHeader>
        <AccordionComponent headersConfig={headersConfig} />

        <AlertDialogFooter>
          <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-500"
            onClick={() => {
              setOpen(false);
            }}
          >
            Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

//budget Filter Part
const BudgetFilter = ({
  selectedTab,
  submitAction,
  setSelectedTableView = () => {},
  selectedTableView,
}: budgetFilterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [custimizeColumn, setCustomizeColumn] = useState<boolean>(false);
  let classname = 'bg-transparent text-white hover:text-white hover:bg-themeBlue';
  const budgetForm: FormInput[] = [
    {
      type: 'file',
      label: 'Budget',
      name: 'file',
      placeholder: '',
      required: false,
    },
  ];
  const adjustmentBudget: FormInput[] = [
    {
      type: 'file',
      label: 'Budget',
      name: 'file',
      placeholder: '',
      required: false,
    },
  ];
  const requestedBudget: FormInput[] = [
    {
      type: 'file',
      label: 'Budget',
      name: 'file',
      placeholder: '',
      required: false,
    },
  ];
  const drawBudgetFormInputs: FormInput[] = [
    {
      type: 'file',
      label: 'Budget',
      name: 'file',
      placeholder: '',
      required: false,
    },
  ];

  const linkOfFiles = {
    'current budget': '/Current_budget.xlsx',
    'adjustment over time': '/adjustment_over_time.xlsx',
    'requested over time': '',
    'draw budget': '/Current_budget.xlsx',
  };
  const respectedFormValues = {
    'current budget': budgetForm,
    'adjustment over time': adjustmentBudget,
    'requested over time': requestedBudget,
    'draw budget': drawBudgetFormInputs,
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = linkOfFiles[selectedTab]; // Path to the file in the public folder
    link.download = selectedTab; // Filename for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const OpenChange = () => setOpen(false);

  return (
    <div className="px-2 mt-8 flex items-center justify-between">
      <div className="flex gap-3 items-center">
        {selectedTab === 'draw budget' && (
          <div className="flex items-center gap-3">
            <Button
              variant={'outline'}
              onClick={() => setSelectedTableView('current_budget')}
              className={`${classname} ${
                selectedTableView === 'current_budget' && 'bg-themeBlue border-0'
              }`}
            >
              Current Budget
            </Button>
            <Button
              variant={'outline'}
              onClick={() => setSelectedTableView('adjustment_over')}
              className={`${classname} ${
                selectedTableView === 'adjustment_over' && 'bg-themeBlue border-0'
              }`}
            >
              Adjustment Over Time
            </Button>
          </div>
        )}
        <div>
          <Input className="text-black" type="search" placeholder="Search" />
        </div>

        <Button variant="secondary">
          <Filter />
        </Button>
      </div>

      <div className="flex gap-3">
        <Sheet>
          <SheetTrigger>
            <Button
              variant={'outline'}
              className=" bg-[#1565c0] border-0 text-white hover:bg-themeBlue hover:text-white"
            >
              Add Budget
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-auto w-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-0">
            <AddBudgetSheet />
          </SheetContent>
        </Sheet>

        <div></div>
        <div>
          <Button
            variant={'outline'}
            className=" bg-[#1565c0] border-0 text-white hover:bg-themeBlue hover:text-white"
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>

        <div>
          {/* <Button
            variant={"outline"}
            className=" bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={() => setOpen(true)}
          >
            Add Budget
          </Button> */}

          <Button
            variant={'outline'}
            className=" bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={() => setOpen(true)}
          >
            Upload File
          </Button>
        </div>

        <div className="text-black">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Take Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCustomizeColumn(true)}>
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
      <InputForms
        title="Create Budget"
        open={open}
        onOpenChange={OpenChange}
        data={respectedFormValues[selectedTab]}
        submitAction={submitAction}
      />
      <FilterModal open={custimizeColumn} setOpen={setCustomizeColumn} />
    </div>
  );
};

export default BudgetFilter;
