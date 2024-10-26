import React, { useState } from 'react';
import { SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useParams } from 'next/navigation';
import { getAccessToken } from '../../utilities/auth';
import { parseCookies } from 'nookies';
import { apiUrl } from '../../utilities/auth';
import { useToast } from '../../utilities/show-toasts';

const AddBudgetSheet = () => {
  const params = useParams();
  const templateId = params?.id;
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    project: Number(templateId),
    tranche: 2,
    original_budget: Number(0),
    adjustments: Number(0),
    amount_requested: Number(0),
    amount_used: Number(0),
    current_budget: Number(0),
    balance_to_fund: Number(0),
    percentage_remaining: Number(0),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  let altern8_useraccess = parseCookies().altern8_useraccess;

  const ReplaceTokenOrRedirect = async (): Promise<void> => {
    const token = await getAccessToken();
    if (!token) {
      window.location.replace('/login');
    } else {
      altern8_useraccess = token;
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      if (!altern8_useraccess) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/rablet-api/budgets/tranches/${templateId}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${altern8_useraccess}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/rablet-api/budgets/tranches/${templateId}/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${altern8_useraccess}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      if (response.ok) {
        const responseData = await response.json();
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
        message: 'Error during addition of profile data',
        type: "error"
      })
    }
  };

  return (
    <SheetHeader>
      <SheetTitle className=" text-white">Add new Tranche Budget</SheetTitle>
      <SheetDescription>
        <div className="text-white my-2">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="original_budget">Original Budget</Label>
              <Input
                type="number"
                name="original_budget"
                //value={formData.original_budget}
                className="text-black"
                placeholder="Original Budget"
                id="original_budget"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="adjustments">Adjustments</Label>
              <Input
                type="number"
                name="adjustments"
                //value={formData.adjustments}
                className="text-black"
                placeholder="Adjustments"
                id="adjustments"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="amount_requested">Amount Requested</Label>
              <Input
                type="number"
                name="amount_requested"
                //value={formData.amount_requested}
                className="text-black"
                placeholder="Amount Requested"
                id="amount_requested"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="amount_used">Amount Used</Label>
              <Input
                type="number"
                name="amount_used"
                //value={formData.amount_used}
                className="text-black"
                placeholder="Amount Used"
                id="amount_used"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="current_budget">Current Budget</Label>
              <Input
                type="number"
                name="current_budget"
                //value={formData.current_budget}
                className="text-black"
                placeholder="Current Budget"
                id="current_budget"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="balance_to_fund">Balance to Fund</Label>
              <Input
                type="number"
                name="balance_to_fund"
                //value={formData.balance_to_fund}
                className="text-black"
                placeholder="Balance to Fund"
                id="balance_to_fund"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="percentage_remaining">Percentage Remaining</Label>
              <Input
                type="number"
                name="percentage_remaining"
                //value={formData.percentage_remaining}
                className="text-black"
                placeholder="Percentage Remaining"
                id="percentage_remaining"
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

export default AddBudgetSheet;
