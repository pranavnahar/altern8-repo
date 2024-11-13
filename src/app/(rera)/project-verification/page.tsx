'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { ReraConfirmation } from '@/components/Project-flow/Rera-confirmation';
import { LegalFlow } from '@/components/Project-flow/Legal-Flow';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rera-confirmation');
  const search = useSearchParams();

  useEffect(() => {
    const tab = search.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/project-verification/?tab=${value}`);
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
            <div className="flex border border-red-200 items-center justify-center ">
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
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="vendor-details">
                  Vendor Details
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="inventory">
                  Inventory
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="payment">
                  Payment
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="rera-confirmation">
              <ReraConfirmation />
            </TabsContent>
            <TabsContent value="legal-flow">
              <LegalFlow />
            </TabsContent>
            <TabsContent value="budget">"Content for Budget"</TabsContent>
            <TabsContent value="timeline">"Content for Timeline"</TabsContent>
            <TabsContent value="funding-source">"Content for Funding Source"</TabsContent>
            <TabsContent value="vendor-details">"Content for Vendor Details"</TabsContent>
            <TabsContent value="inventory">"Content for Inventory"</TabsContent>
            <TabsContent value="payment">"Content for Payment"</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
