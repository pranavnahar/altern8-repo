'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '../layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BankDetailsPage from '../../../components/company-details/BankDetailsPage';
import GSTList from '../../../components/company-details/GSTList';
import PocForm from '../../../components/company-details/poc-form';
import Accounting from '../../../components/company-details/accounting/index';

const Index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('poc-details');
  const search = useSearchParams();
  useEffect(() => {
    const tab = search.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [search.get('tab')]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/company-details/?tab=${value}`);
  };

  const handleChangePassword = () => {
    router.push('/reset-password');
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="w-4/5 pb-10 rounded-lg mt-15">
        <div className="mx-auto mt-8 rounded-lg">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-center w-full">
              <TabsList className="flex gap-10 mx-auto max-w-max bg-white/10">
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="poc-details">
                  POC Details
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="bank-account">
                  Bank Account
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="gstin">
                  GSTIN
                </TabsTrigger>
                <TabsTrigger className="rounded hover:bg-white/10 animation" value="accounting">
                  Accounting
                </TabsTrigger>
                <TabsTrigger
                  className="rounded hover:bg-white/10 animation"
                  value="change-password"
                  onClick={handleChangePassword}
                >
                  Change Password
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="poc-details">
              <PocForm />
            </TabsContent>
            <TabsContent value="bank-account">
              <BankDetailsPage />
            </TabsContent>
            <TabsContent value="gstin">
              <GSTList />
            </TabsContent>
            <TabsContent value="accounting">
              <Accounting />
            </TabsContent>
            <TabsContent value="change-password"></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: string | number | bigint | boolean) {
  return <Layout>{page}</Layout>;
};
