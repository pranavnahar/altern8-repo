import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { renderHTML } from '../../utilities/render-html';
interface type {
  title: string;
  content: any;
  isOpenByDefault: boolean;
}

const AccordionItem: React.FC<type> = ({ title, content, isOpenByDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const contentList = content.split(', ');

  return (
    <div className="[background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] rounded-xl">
      <button
        className="flex items-center justify-between w-full px-6 py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium tracking-tight text-gray-200">{title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown
            className="text-gray-200 transition-transform duration-200 size-5 shrink-0"
            strokeWidth={2}
          />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5">
              <div className="text-sm capitalize">
                {contentList.map((item: any, index: number) => (
                  <span key={index} className="text-gray-300">
                    {renderHTML(item)}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion: React.FC<{ items: any }> = ({ items }) => {
  return (
    <div className="flex flex-col w-full gap-4 mx-auto rounded-lg">
      {items.map((item: any, index: number) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  );
};

export default Accordion;
