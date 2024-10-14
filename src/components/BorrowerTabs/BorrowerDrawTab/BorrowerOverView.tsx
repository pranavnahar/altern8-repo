"use client";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { Alert, AlertTitle } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Info } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";

const BorrowerOverview = () => {
  const [file, setFile] = useState<object>({});

  const onDrop = useCallback(async (acceptedFiles: File[], key: string) => {
    setFile({
      ...file,
      [key]: acceptedFiles,
    });
  }, []);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-fit gap-3">
          <Card className="flex items-center w-fit [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white gap-3 ">
            <div className="flex gap-3">
              <div className="relative h-[100px] w-[100px]">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  layout="fill"
                  alt="project_image"
                  className=" rounded-l-xl"
                />
              </div>
              <div className="p-3">
                <p className="text-base">1460 Comal Project</p>
                <p className="text-xs uppercase ">Delhi, India</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 h-[100px] w-[120px] flex flex-col items-center justify-center gap-1 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
            <p className="text-xs">{"BO-IN-0003"}</p>
            <p className="text-base">Tranche 3</p>
            <p className="text-xs uppercase ">Active</p>
          </Card>
        </div>
        <Button className="bg-themeBlue w-[250px]">Submit Tranche</Button>
      </div>
      <Alert className="my-3 w-fit  [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white gap-3 ">
        <AlertTitle className="flex items-center justify-center  gap-3">
          <Info size={18} />
          Documents & Information Will not be visible to lender until Tranche is
          submitted.
        </AlertTitle>
      </Alert>

      <div className="flex items-start  min-h-[500px] justify-left gap-3">
        <div className="w-[50%] h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]  bg-white p-5 rounded-lg text-black">
          <h2>Documents</h2>
          <div className="my-5">
            <Label htmlFor="Tranche_summary" className="mb-4">
              Tranche Summary (.xls)
            </Label>
            <FileUpload
              onDrop={(acceptedFiles) => onDrop(acceptedFiles, "Tranche")}
            />
          </div>
          <div className="my-3">
            <Label htmlFor="pay_applications">Payment Application</Label>
            <FileUpload
              onDrop={(acceptedFiles) =>
                onDrop(acceptedFiles, "pay_applications")
              }
            />
          </div>
          <div className="my-2">
            <Label htmlFor="invoices">Invoices</Label>
            <FileUpload
              onDrop={(acceptedFiles) => onDrop(acceptedFiles, "invoices")}
            />
          </div>
          <div className="my-2">
            <Label htmlFor="other">Other</Label>
            <FileUpload
              onDrop={(acceptedFiles) => onDrop(acceptedFiles, "other")}
            />
          </div>
        </div>
        <div className="w-[50%] h-full [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white p-5 rounded-lg">
          <div>
            <Label htmlFor="Tranche_summary">Requested Amount</Label>
            <div className="flex flex-col gap-3">
              <div>
                <Input
                  type="text"
                  placeholder="Request Amount"
                  onChange={(e) => console.log(e)}
                  className="[background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white "
                />
              </div>
              <div>
                <Label htmlFor="Tranche_summary">Tranche Checklist</Label>
                <Label htmlFor="Tranche_summary">
                  Notes for Wheeler Bank (optional)
                </Label>

                <Textarea
                  placeholder="Type a comment here."
                  className="h-48 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] text-white "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerOverview;
