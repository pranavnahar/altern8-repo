'use client';

import React from 'react';
import List from '../List/List';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
import Message from '../Message/Message';

type Props = {
  listData: any[];
  className?: string;
};

const TodoList = ({ listData, className }: Props) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      transition={{ duration: 1 }}
      className={`p-2 ${className}`}
    >
      <div className="flex items-center justify-between gap-1 w-full border-b mb-2 border-b-gray-400">
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          TO-DOS
        </motion.p>
      </div>

      <Message />

      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        1460 Comal Project
      </motion.p>
      <Card className="m-1 p-3 border-none text-white [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-1">
            <MessageSquareText size={20} />
            <strong className="text-sm text-gray-400 ">SUMMARY</strong>
          </div>
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <Ellipsis color="#bbb" />
          </motion.div> */}
        </motion.div>

        <List data={listData} keyToMap={['label', 'value']} />
      </Card>
    </motion.div>
  );
};

export default TodoList;
