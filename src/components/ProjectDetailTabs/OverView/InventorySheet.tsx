import React, { useState } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components//ui/input";
import { Button } from "../../../components//ui/button";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getAccessToken } from "../../../Utils/auth";
import { parseCookies } from "nookies";
import { apiUrl } from "@/Utils/auth";

const InventorySheet = () => {
  const params = useParams();
  const templateId = params?.id;
  const [formData, setFormData] = useState({
    project: Number(templateId),
    tranche: 2,
    lots: Number(0),
    foundation_starts: Number(0),
    models_count: Number(0),
    started_completed: Number(0),
    units: Number(0),
    contingent_sales: Number(0),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let altern8_adminaccess = parseCookies().altern8_adminaccess;

  const ReplaceTokenOrRedirect = async (): Promise<void> => {
    const token = await getAccessToken();
    if (!token) {
      window.location.replace("/login");
    } else {
      altern8_adminaccess = token;
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      if (!altern8_adminaccess) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(
        `${apiUrl}/rablet-api/projects/${templateId}/inventories/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${altern8_adminaccess}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(
          `${apiUrl}/rablet-api/projects/${templateId}/inventories/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${altern8_adminaccess}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      }
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        toast("Document saved !");
      } else {
        console.error("Failed to add profile data:", response.status);
        toast("Failure");
      }
    } catch (error) {
      console.log("Error during adding profile data:", error);
      toast("UI Is Initialized");
    }
  };

  return (
    <SheetHeader>
      <SheetTitle className=" text-white">Add new Inventory List</SheetTitle>
      <SheetDescription>
        <div className="text-white my-2">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="lots">Lots</Label>
              <Input
                type="number"
                name="lots"
                //value={formData.lots}
                className="text-black"
                placeholder="Lots"
                id="lots"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="foundation_starts">Foundation Starts</Label>
              <Input
                type="number"
                name="foundation_starts"
                //value={formData.foundation_starts}
                className="text-black"
                placeholder="Foundation Starts"
                id="foundation_starts"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="models_count">Models Count</Label>
              <Input
                type="number"
                name="models_count"
                //value={formData.models_count}
                className="text-black"
                placeholder="Models Count"
                id="models_count"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="started_completed">Started Completed</Label>
              <Input
                type="number"
                name="started_completed"
                //value={formData.started_completed}
                className="text-black"
                placeholder="Started Completed"
                id="started_completed"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="units">Units</Label>
              <Input
                type="number"
                name="units"
                //value={formData.units}
                className="text-black"
                placeholder="Units"
                id="units"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="contingent_sales">Contingent Sales</Label>
              <Input
                type="number"
                name="contingent_sales"
                //value={formData.contingent_sales}
                className="text-black"
                placeholder="Contingent Sales"
                id="contingent_sales"
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </SheetDescription>
    </SheetHeader>
  );
};

export default InventorySheet;
