import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AnimatedLogo from "./AnimatedLogo";
import { logout } from "./ServerActions";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    const status = await logout();
    if (status) router.push("/login");
  };

  return (
    <motion.div
      className="mr-10 p-3 py-4 app-header flex items-center sticky z-[50] top-0 justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedLogo />
      <div className="flex text-white text-sm justify-between items-center">
        <div className="flex gap-5 mx-8">
          <Button>Increase Credit</Button>
          <Button>Chat with Admin</Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p className="cursor-pointer flex items-center justify-center">
              Lefin Singh <ChevronDown className="ml-1" size={15} />
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default Header;
