"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { read, utils, WorkBook, Sheet } from "xlsx";
import Spreadsheet from "react-spreadsheet";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface DocumentPreviewProps {
  document: string;
  type?: "internal" | "external";
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  type = 'external',
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [workbook, setWorkbook] = useState<WorkBook | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [data, setData] = useState<Array<Array<{ value: any }>>>([]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [documentType, setDocumentType] = useState<string>("");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) =>
      Math.min(prevPageNumber + 1, numPages || 1)
    );
  };

  const getDocumentType = (path: string) => {
    const extension = path.split(".").pop()?.toLowerCase();

    if (extension === "pdf") {
      setDocumentType("PDF");
    } else if (extension === "xlsx" || extension === "xls") {
      setDocumentType("Excel");
    } else {
      setDocumentType(extension || "");
    }
  };

  useEffect(() => {
    getDocumentType(document);
  }, [document]);

  useEffect(() => {
    const fetchAndReadFile = async () => {
      try {
        const url =
          type === "internal" ? `${document}` : `${apiUrl}/${document}`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: "array" });
        setWorkbook(workbook);
        setSelectedSheet(workbook.SheetNames[0]);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    if (documentType === "Excel") {
      fetchAndReadFile();
    }
  }, [documentType, document]);

  useEffect(() => {
    if (workbook && selectedSheet) {
      console.log(workbook);
      const worksheet: Sheet = workbook.Sheets[selectedSheet];

      type CellValue = string | number | boolean | Date | null;
      type RowData = CellValue[];

      const jsonData: RowData[] = utils.sheet_to_json(worksheet, { header: 1 });

      setData(
        jsonData.map((row: RowData) =>
          row.map((cell: CellValue) => ({ value: cell }))
        )
      );
    }
  }, [workbook, selectedSheet]);

  console.log(data);

  return (
    <div className="w-full h-full">
      {documentType === "Excel" ? (
        <>
          <label className="block mb-2 text-xl text-white font-medium">
            Select Sheet:
          </label>
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="text-black block w-[320px] p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          >
            {workbook?.SheetNames && workbook.SheetNames.length > 0 ? (
              workbook.SheetNames.map((sheetName) => (
                <option key={sheetName} value={sheetName}>
                  {sheetName}
                </option>
              ))
            ) : (
              <option value="no-sheets-available" disabled>
                No Sheets Available
              </option>
            )}
          </select>

          {data.length > 0 ? (
            <div className="w-full overflow-x-scroll">
              <Spreadsheet data={data} />
            </div>
          ) : (
            <p className="text-red-600">
              No data available in the selected sheet.
            </p>
          )}
        </>
      ) : documentType === "PDF" ? (
        <div>
          <Document
            // file={{ url: `${apiUrl}/${document}` }}
            file={{ url: "https://pdfobject.com/pdf/sample.pdf" }}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          {numPages && numPages > 1 && (
            <>
              <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                Previous
              </button>
              <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                Next
              </button>
            </>
          )}
        </div>
      ) : (
        <h4 className="text-red-600">{`${documentType} is not supported to preview!`}</h4>
      )}
    </div>
  );
};

export default DocumentPreview;
