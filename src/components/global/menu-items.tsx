import { ReactNode } from "react";
import {
  BadgeCent,
  BadgeHelp,
  Calendar,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  ScreenShare,
  WalletMinimal,
} from "lucide-react";

export const menuItemsLogos: ReactNode[] = [
  <LayoutDashboard key="dashboard" className="w-[1.35rem] h-[1.35rem] my-auto" />,
  <Landmark key="user" className="w-[1.35rem] h-[1.35rem] my-auto" />,
  <Calendar key="calendar" className="w-[1.35rem] h-[1.35rem] my-auto" />,
  <ReceiptText key="receipt" className="w-[1.35rem] h-[1.35rem] my-auto"/>,
  <WalletMinimal key="wallet" className="w-[1.35rem] h-[1.35rem] my-auto" />,
  <BadgeCent key="badge" className="w-[1.35rem] h-[1.35rem] my-auto" />,
  <ScreenShare key="screen-share" className="w-[1.35rem] h-[1.35rem] my-auto" />,
  <BadgeHelp key="user2" className="w-[1.35rem] h-[1.35rem] my-auto" />
];
