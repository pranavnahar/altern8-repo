'use client';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { ReraConfirmation } from '@/components/Project-flow/Rera-confirmation';
import { LegalFlow } from '@/components/Project-flow/Legal-Flow';
import { Budget } from '@/components/ProjectDetailTabs/Budget/Budget';
import { TimelineTab } from '@/components/TimeLine/TimeLine';
import FundingSources from '@/app/(dashboard)/projects/_components/funding-sources';
import { InventoryTable } from '@/app/(dashboard)/projects/_components/inventory';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rera-confirmation');
  const search = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const tab = search.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [search]);
  const originalBudget = {
    original_budget: 5000000,
    adjustments: 250000,
    current_budget: 5250000,
    amount_requested: 4000000,
    amount_used: 3000000,
    balance_to_fund: 2250000,
    percentage_remaining: 42.857142857142854
  }
  const inventoryData = [
    {
      id: 1,
      project: 1,
      tranche: 1,
      lots_count: 0,
      lots_amount: '0.00',
      foundation_starts_count: 0,
      foundation_starts_amount: '0.00',
      models_count: 5,
      models_amount: '0.00',
      started_completed_count: 0,
      started_completed_amount: '0.00',
      units_count: 0,
      units_amount: '0.00',
      contingent_sales_count: 0,
      contingent_sales_amount: '0.00',
      approved_by_admin: false
    },
    {
      id: 2,
      project: 1,
      tranche: 1,
      lots_count: 0,
      lots_amount: '0.00',
      foundation_starts_count: 0,
      foundation_starts_amount: '0.00',
      models_count: 5,
      models_amount: '0.00',
      started_completed_count: 0,
      started_completed_amount: '0.00',
      units_count: 0,
      units_amount: '0.00',
      contingent_sales_count: 0,
      contingent_sales_amount: '0.00',
      approved_by_admin: false
    },
    {
      id: 3,
      project: 1,
      tranche: 1,
      lots_count: 0,
      lots_amount: '0.00',
      foundation_starts_count: 0,
      foundation_starts_amount: '0.00',
      models_count: 5,
      models_amount: '0.00',
      started_completed_count: 0,
      started_completed_amount: '0.00',
      units_count: 0,
      units_amount: '0.00',
      contingent_sales_count: 0,
      contingent_sales_amount: '0.00',
      approved_by_admin: false
    },
    {
      id: 4,
      project: 1,
      tranche: 1,
      lots_count: 0,
      lots_amount: '0.00',
      foundation_starts_count: 0,
      foundation_starts_amount: '0.00',
      models_count: 5,
      models_amount: '0.00',
      started_completed_count: 0,
      started_completed_amount: '0.00',
      units_count: 0,
      units_amount: '0.00',
      contingent_sales_count: 0,
      contingent_sales_amount: '0.00',
      approved_by_admin: false
    }
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/project-verification/1?tab=${value}`);
  };

  return (
    <div className="min-h-screen p-10 w-full shadow-lg outline-none focus:outline-none ">
      <div className="p-1">
        <h3 className="text-3xl text-gray-200 font-semibold">Project Verification</h3>
        <p className="text-zinc-400 mt-3">Follow these steps to verify your project.</p>
      </div>
      <div className="flex mt-5 w-full">
        <div className="rounded-lg w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-center ">
              <TabsList className="flex gap-10  bg-white/10">
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="rera-confirmation">
                  Rera Confirmation
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="legal-flow">
                  Legal Flow
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="budget">
                  Budget
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="timeline">
                  Timeline
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="funding-source">
                  Funding Source
                </TabsTrigger>
                {/* <TabsTrigger className="rounded hover:bg-white/10 animation" value="vendor-details">
                  Vendor Details
                </TabsTrigger> */}
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="inventory">
                  Inventory
                </TabsTrigger>
                {/* <TabsTrigger className="rounded hover:bg-white/10 animation" value="payment">
                  Payment
                </TabsTrigger> */}
              </TabsList>
            </div>
            <TabsContent value="rera-confirmation">
              <ReraConfirmation />
            </TabsContent>
            <TabsContent value="legal-flow">
              <LegalFlow />
            </TabsContent>
            <TabsContent value="budget">
              {/* @ts-ignore */}
              <Budget originalBudget={originalBudget} />
            </TabsContent>
            <TabsContent value="timeline">
              <TimelineTab />
            </TabsContent>
            <TabsContent value="funding-source">
              <FundingSources projectId={1} type='TABLE' />
            </TabsContent>
            {/* <TabsContent value="vendor-details">"Content for Vendor Details"</TabsContent> */}
            <TabsContent value="inventory">
              <>
                <InventoryTable inventory={inventoryData} />

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="submit"
                      className="mt-5 p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
                    >
                      Finish
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] background border-none">
                    <DialogHeader>
                      <DialogTitle className="text-white text-xl">
                        Procced to Submission?
                      </DialogTitle>
                    </DialogHeader>
                    <p className='text-white'>Our team will review and connect with you soon.</p>
                    <Link href={"/projects"}>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          toast("Project approval submission successful!", {
                            description: "Please wait while we review your submission.",
                          });
                        }}
                        type="submit"
                        className="mt-5 p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
                      >
                        Submit
                      </button>
                    </Link>
                  </DialogContent>
                </Dialog>
              </>

            </TabsContent>
            {/* <TabsContent value="payment">"Content for Payment"</TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
