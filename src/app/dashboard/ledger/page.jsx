import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TransactionsTab from "./ledger/transactions/index";
import AccountsTab from "./ledger/accounts/index";
import RuleManagerTab from "./ledger/rules-manager/index";
import { NotificationSheet } from "../../components/dashboard/ledger/_components/notification-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabContent = ({ value, children }) => (
  <TabsContent value={value}>{children}</TabsContent>
);

const Index = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState("transactions");

  const handleTabChange = (value) => {
    setActiveTab(value);
    router.push({
      pathname: router.pathname,
      query: { tab: value },
    });
  };

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <div className="flex min-h-screen mt-10">
      <div className="w-full pt-5">
        <div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full bg-white/0">
              <div className="flex justify-between gap-1 p-1 mr-auto rounded-md max-w-max bg-white/10">
                <TabsTrigger
                  value="transactions"
                  className="rounded hover:bg-white/10 animation"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="accounts"
                  className="rounded hover:bg-white/10 animation"
                >
                  Accounts
                </TabsTrigger>
                <TabsTrigger
                  value="rule-manager"
                  className="rounded hover:bg-white/10 animation"
                >
                  Rules Manager
                </TabsTrigger>
              </div>
              <NotificationSheet />
            </TabsList>
            <TabsContent value="transactions">
              <TransactionsTab />
            </TabsContent>
            <TabContent value="accounts">
              <AccountsTab />
            </TabContent>
            <TabContent value="rule-manager">
              <RuleManagerTab />
            </TabContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
