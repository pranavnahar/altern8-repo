'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { documentsList } from '../../app/(dashboard)/draw/[id]/static';
import { InvoiceDocument } from '../../app/(dashboard)/draw/[id]/type';
import DrawDocForm from './DrawDocForm';
import dynamic from 'next/dynamic';

const DocumentPreview = dynamic(() => import('./DocumentPreview'), {
  ssr: false,
});

const DocumentListing: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDocument>(documentsList[0]);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  const handleFileChange = (usage: 'next' | 'prev') => {
    if (selectedIndex < documentsList.length && usage === 'next') {
      let index = selectedIndex + 1;
      setSelectedIndex(index);
      setSelectedInvoice(documentsList[index]);
    } else if (selectedIndex > 0 && usage === 'prev') {
      let index = selectedIndex - 1;
      setSelectedIndex(index);
      setSelectedInvoice(documentsList[index]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl">Welcome to document preview page!</h2>
        <div className="flex">
          <div className="mr-5">
            <p className="text-white">TRANCHE TOTAL</p>x``
            <h4 className="text-white">₹379,986.80</h4>
          </div>
          <Button
            variant={'outline'}
            className="bg-transparent text-white w-32 mx-2"
            onClick={() => handleFileChange('prev')}
          >
            Previous
          </Button>
          <Button
            variant={'outline'}
            className="bg-transparent text-white w-32 mx-2"
            onClick={() => handleFileChange('next')}
          >
            Next
          </Button>
          <Button
            variant={'outline'}
            className="bg-transparent text-white w-32 mx-2"
            onClick={() => setShowDocumentPreview(!showDocumentPreview)}
          >
            {showDocumentPreview ? 'Close' : 'Preview'}
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-between mt-10">
        <div className="bg-gray-100 rounded-lg shadow-md p-2 w-1/5 max-h-[700px] overflow-auto">
          <h1 className="text-gray-600 font-bold mb-4">5/5 Documents</h1>
          {documentsList.map((doc, index) => (
            <div
              key={index}
              onClick={() => setSelectedInvoice(doc)}
              className={`mb-4 p-2 rounded cursor-pointer ${
                selectedInvoice?.name === doc.name ? 'bg-blue-100' : ''
              }`}
            >
              <div className="text-gray-500 font-bold uppercase">{doc.type}</div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">{doc.name}</div>
                {doc.draw && <div className="text-gray-800 font-semibold">{doc.draw}</div>}
              </div>
              <div className="text-gray-600">{doc.price}</div>
            </div>
          ))}
        </div>
        <div className={`${showDocumentPreview ? 'w-2/5' : 'w-full'} overflow-x-auto`}>
          <DrawDocForm />
        </div>
        {showDocumentPreview && (
          <div className="w-2/5 overflow-x-auto">
            <DocumentPreview document={selectedInvoice.file} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentListing;
