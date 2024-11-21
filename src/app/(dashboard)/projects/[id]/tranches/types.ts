export interface Tranche {
  id: number;
  tranche_name: string;
  tranche_number: number;
  submission_date: string;
  tranche_total: string;
  funded_on: string | null;
  tranche_end_date: string;
  voucher_discount: string | null;
  tranche_state: string;
  scheduled_for_date: string | null;
  approved_by_admin: boolean;
  status: string | null;
  project: number;
  product: number | null;
}

export interface TrancheResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tranche[];
}

export interface Rule {
  id: number;
  rule_type: string;
  description: string;
  is_active: boolean;
  input_value: {
    threshold: number;
  };
  created_at: string;
  updated_at: string;
  project: number;
  tranche: number;
}

export interface RulesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rule[];
}

export interface Budget {
  id?: number;
  original_budget?: string;
  adjustments?: string;
  current_budget?: string;
  amount_requested?: string;
  amount_used?: string;
  balance_to_fund?: string;
  percentage_remaining?: string;
  category?: string;
  project: number;
  tranche: number;
  line_items?: any[];
}

export interface BudgetResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Budget[];
}

export interface Tasks {
  id: number;
  tranche: number;
  project: number;
  owner: string;
  owner_name: string | null;
  status: string;
  original_start_date: string;
  original_completion_date: string;
  tranche_actual_start_date: string;
  tranche_actual_completion_date: string;
  completion_date_variance: string;
}

export interface TaksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tasks[];
}
