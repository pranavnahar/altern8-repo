export interface ItemProps {
  name: string;
  originalBudget: number;
  adjustments: number;
  currentBudget: number;
  draw3: number;
  draw3originalBudget: number;
  draw3currentBudget: number;
  draw2: number;
  draw2originalBudget: number;
  draw2currentBudget: number;
  draw1: number;
  draw1originalBudget: number;
  draw1currentBudget: number;
  type?: string; // Optional for subtotals
}

export interface CategoryProps {
  category: string;
  items: ItemProps[];
}
