import { MessageSquareText } from "lucide-react";
import * as React from "react";
import { Card } from "../ui/card";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export interface IAppProps {}

export default function Message() {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: "0%", opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-3 border-none  m-1 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
        <div className="flex items-start gap-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <MessageSquareText size={18} color="white" />
          </motion.div>
          <div className="w-full">
            <div className="flex align-top justify-between mb-2">
              <motion.strong
                className="text-sm text-gray-400"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Subha Lakshmi
              </motion.strong>
            </div>
            <motion.p
              className="text-sm text-white"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="font-semibold text-blue-500">
              @Antony Singh
              </span>{" "}
              Delivery Task will complete in 1 Days.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className=" text-sm mt-3 "
            >
              <Button variant={"outline"} className="bg-transparent hover:bg-transparent text-white">Mark as Complete</Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
