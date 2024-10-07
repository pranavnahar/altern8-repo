"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TransactionsTab from "./transactions/index";
import AccountsTab from "./accounts/index";
import RuleManagerTab from "./rules-manager/index";
import { NotificationSheet } from "../../../components/ledger/_components/notification-sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

const TabContent: React.FC<{ value: string; children: ReactNode }> = ({
  value,
  children,
}) => <TabsContent value={value}>{children}</TabsContent>;

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("transactions");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", value);
    router.push(newUrl.toString(), { scroll: false });
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

export default page;
