"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { BaseTableData } from "../../lib/componentProps";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const TruncatedContent = ({
  content,
  maxLength,
}: {
  content: BaseTableData["name"];
  maxLength: number;
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const stringContent = String(content);
  const truncatedText = showFullContent
    ? stringContent
    : `${stringContent.slice(0, maxLength)}...`;

  return (
    <div>
      <p>{truncatedText}</p>
      <button
        className={`text-blue-500 hover:text-blue-700 focus:outline-none text-xs ${
          showFullContent ? "block" : "hidden"
        }`}
        onClick={toggleContent}
      >
        Show less
      </button>
      {!showFullContent && (
        <button
          className="text-blue-500 hover:text-blue-700 focus:outline-none text-xs"
          onClick={toggleContent}
        >
          Show more
        </button>
      )}
    </div>
  );
};

export type rowDataprops = {
  name: string;
  status: string;
  updated_by: string;
  updated_last: string;
};

type drawRuleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowData: rowDataprops | BaseTableData;
};

// Example usage in your component
const DrawRuleModal = ({ open, onOpenChange, rowData }: drawRuleModalProps) => {
  const maxLength = 50;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{rowData?.name}</AlertDialogTitle>
        </AlertDialogHeader>
        <TruncatedContent content={rowData?.name} maxLength={maxLength} />
        {/* dropdown */}
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="pass manually">Pass Manually</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* comments */}
        <h3>History</h3>
        <p>
          {" "}
          <strong>09/14/23</strong> ipsum dolor sit amet consectetur adipisicing
          elit.
        </p>
        <textarea
          name="comment"
          id="comment"
          placeholder="Add a comment"
          className="w-full h-28 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-gray-500 resize-none"
        ></textarea>
        <span className="text-gray-500 text-xs">type @ to mention a user</span>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DrawRuleModal;
