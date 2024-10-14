import { Label } from '../../../../components/ui/label';
import { Progress } from '../../../../components/ui/progress';

export const BudgetTabHeader = () => {
  return (
    <div className="flex items-center gap-5 text-white px-5 my-4">
      <div>
        <Label>DEBT</Label>
        <p>Great Bank, Bank of Rabblet...</p>
      </div>
      <div>
        <Label>EQUITY</Label>
        <p>Mitchell Devlopment</p>
      </div>
      <div className="w-[17vw]">
        <Progress value={33} className="h-3 bg-black mb-3" />
        <div className="flex items-center text-xs justify-between">
          <p>Equity Funded</p>
          <p>₹ 79,80,653 / ₹ 1,000,000</p>
        </div>
      </div>
      <div className="w-[17vw]">
        <Progress value={33} className="h-3 bg-black mb-3" />
        <div className="flex items-center text-xs justify-between">
          <p>Debt Distributed</p>
          <p>₹ 79,80,653 / ₹ 1,000,000</p>
        </div>
      </div>
      <div className="w-[17vw]">
        <Progress value={33} className="h-3 bg-black mb-3" />
        <div className="flex items-center text-xs justify-between">
          <p>Project Progress</p>
          <p>₹ 79,80,653 / ₹ 1,000,000</p>
        </div>
      </div>
    </div>
  );
};
