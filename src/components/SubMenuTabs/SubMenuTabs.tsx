import { SubmenuProps } from '../../lib/componentProps';

type SubMenuTabsProps = {
  tabs: SubmenuProps[];
};

export default function SubMenuTabs({ tabs }: SubMenuTabsProps) {
  const menuColor: { [key: string]: string } = {
    complete: 'bg-[#fb6a0025] text-[#46fea5d4]',
    inProgress: 'bg-[#fb6a0025] text-[#fb6a00]',
  };
  return (
    <div className="flex gap-8 sticky items-center p-1 px-6 py-2">
      {tabs.map((tab, index) => (
        <p key={index} className="text-white">
          {tab.name}
          <span className={`${menuColor[tab.statusColor]} ml-2 text-xs`}>{tab.status}</span>
        </p>
      ))}
    </div>
  );
}
