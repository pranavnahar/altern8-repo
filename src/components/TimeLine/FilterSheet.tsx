import { Input } from "../../components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { Label } from "../ui/label";
import DatePicker from "../DatePicker/DatePicker";
import FileUpload from "../FileUpload/FileUpload";
import { Button } from "../ui/button";
import { FileDown } from "lucide-react";
import { BaseTableData } from "../../lib/componentProps";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  type?: 'create' | 'edit';
  data?: BaseTableData;
}

export function FilterSheet({
  open,
  onOpenChange,
  type,
  data = {},
}: FilterSheetProps) {
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("notstarted");
  const [originalStartDate, setOriginalStartDate] = useState<Date>(new Date());
  const [projectedStartDate, setProjectedStartDate] = useState<Date>(
    new Date()
  );
  const [originalDuration, setOriginalDuration] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [file, setFile] = useState<object>({});

  const handleDateChange = (day: Date | undefined) => {
    if (day) setOriginalStartDate(day);
  };

  const handleStartDate = (day: Date | undefined) => {
    if (day) setProjectedStartDate(day);
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Task_sample.xlsx"; // Path to the file in the public folder
    link.download = "Task_template"; // Filename for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFile(acceptedFiles);
  }, []);
  console.log(file); //for now implementing console.log for preventing eslint error and build need to remove it in future

  useEffect(() => {
    if (Object.keys(data).length && type === "edit") {
      const {
        Task,
        Status,
        OriginalStartDate,
        ProjectedActualStartDate,
        CompletionDateVariance,
        Owner,
      } = data;
      setName(String(Task));
      setStatus(String(Status).toLowerCase());
      setOriginalStartDate(new Date(String(OriginalStartDate)));
      setProjectedStartDate(new Date(String(ProjectedActualStartDate)));
      setOriginalDuration(String(CompletionDateVariance));
      setOwner(String(Owner));
    }
  }, [data]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-auto w-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white border-0">
        <SheetHeader>
          <SheetTitle className="text-white">
            {type === "create" ? "Create New Task" : "Edit Task"}
          </SheetTitle>
        </SheetHeader>
        <div className="text-white my-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="mt-2">
              <div className="flex mb-2 itms-center justify-between">
                <Label htmlFor="name">Upload Sheet</Label>
                <div title="Download the sample file">
                  <FileDown onClick={handleDownload} size={20} />
                </div>
              </div>

              <FileUpload
                onDrop={(acceptedFiles: File[]) => onDrop(acceptedFiles)}
              />
              <p className="text-center">OR</p>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                value={name}
                className="text-black"
                placeholder="Name"
                id="name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="w-full">
              <Label>Status</Label>
              <div className="text-black">
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      className="!text-black"
                      placeholder="Not Started"
                    />
                  </SelectTrigger>
                  <SelectContent className="!text-black">
                    <SelectItem value="not started">Not Started</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="onhold">on Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="my-5">
                <Label>Original Start Date</Label>

                <DatePicker
                  date={originalStartDate}
                  handleDateChange={handleDateChange}
                />
              </div>
              <div className="my-2">
                <Label>Projected Start Date</Label>
                <DatePicker
                  date={projectedStartDate}
                  handleDateChange={handleStartDate}
                />
              </div>
            </div>

            <div className="flex items-end w-full my-2">
              <div className="w-full">
                <Label htmlFor="originalDuration">Original Duration</Label>

                <Input
                  id="originalDuration"
                  value={originalDuration}
                  onChange={(e) => setOriginalDuration(e.target.value)}
                  className="text-black "
                  type="number"
                />
              </div>
              <p className="ml-3">Days</p>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="flex flex-col items-center">
                <Label className="leading-6">Original Completion Date</Label>
                <Input
                  value="Will update on save"
                  disabled
                  className="text-black"
                />
              </div>
              <div className="flex flex-col items-center">
                <Label className="leading-6">Project Completion Date</Label>
                <Input
                  value="Will update on save"
                  disabled
                  className="text-black"
                />
              </div>
            </div>
            <div>
              <Label>Owner</Label>
              <Select value={owner} onValueChange={(value) => setOwner(value)}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select a Owner for this task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Owners</SelectLabel>
                    <SelectItem value="N/A">N/A</SelectItem>
                    <SelectItem value="owner_1">Owner 1</SelectItem>
                    <SelectItem value="owner_2">Owner 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button>Submit</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
