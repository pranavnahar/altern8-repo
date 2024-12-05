import React, { useState } from 'react';
import { SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components//ui/input';
import { Button } from '../../../components//ui/button';
import { useParams } from 'next/navigation';
import { useToast } from '../../../utils/show-toasts';
import { getAuthToken } from '@/utils/auth-actions';

const InventorySheet = () => {
  const params = useParams();
  const templateId = params?.id;
  const { showToast } = useToast()
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = await getAuthToken()
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rablet-api/projects/${templateId}/inventories/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast({
          message: 'Document saved',
          type: "success"
        })
      } else {
        showToast({
          message: 'Failed to add profile data',
          type: "error"
        })
      }
    } catch (error) {
      showToast({
        message: 'Error during adding profile data',
        type: "error"
      })
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
