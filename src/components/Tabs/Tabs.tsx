'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { tabsProps } from '../../app/(dashboard)/project/[id]/page';
import { Button } from '../ui/button';
import { ButtonProps, SubmenuProps } from '../../lib/componentProps';
import SubMenuTabs from '../SubMenuTabs/SubMenuTabs';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  tabsList: tabsProps[];
  buttons?: ButtonProps[];
  subMenuList?: SubmenuProps[];
  stickyClassName?: string;
};

const Tab = ({ tabsList, buttons, subMenuList }: Props) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabsList?.[0]?.name);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab: string | null = searchParams.get('current_tab');
  useEffect(() => {
    if (tab) setSelectedTab(tab);
  }, [tab]);

  return (
    <Tabs value={selectedTab}>
      <div
        className={`flex justify-between tabs-header-sticky py-5 w-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]`}
        // style={{ top: `${stickyAtTop}px` }}
      >
        <TabsList className="flex items-center px-5 justify-between bg-transparent text-white">
          {tabsList.map((tab, index) => (
            <TabsTrigger
              value={tab?.name}
              key={index}
              onClick={() => router.push(`?current_tab=${tab?.name}`)}
            >
              {tab?.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center gap-5">
          {buttons?.length &&
            buttons.map((button, index) => (
              <div key={index} className="flex px-5 items-center gap-3">
                <Button
                  className={button.className}
                  variant={button.variant || 'default'}
                  onClick={button?.onClick}
                >
                  {button.name}
                  {button?.icon}
                </Button>
              </div>
            ))}
        </div>
      </div>
      {subMenuList?.length && <SubMenuTabs tabs={subMenuList} />}
      {tabsList.map((tab, i) => (
        <TabsContent key={i} value={tab.name}>
          {tab?.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Tab;
