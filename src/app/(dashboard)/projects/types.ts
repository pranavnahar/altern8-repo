export interface SummaryItem {
  id: number;
  interest_reserves: string;
  development_fees: string;
  tranche_inspector_fees: string;
  legal: string;
  architecture: string;
  engineering: string;
  title_insurance: string;
  environmental: string;
  soft_cost_contingency: string;
  site_acquisition: string;
  general_requirements: string;
  concrete: string;
  masonry: string;
  metal: string;
  wood_plastics: string;
  thermal_moistures: string;
  openings: string;
  finishes: string;
  facilities: string;
  project: number;
}
export type Product = {
  id?: string;
  name: string;
  purpose: string;
  interest_rate_fixed: string;
  interest_rate_variable: string;
  tenure_in_days: string;
  ltv_ratio: string;
  interest_deduction_type: string;
  principal_payout_type: string;
  penalty_grace_period: string;
  post_dated_cheques: boolean;
  enach: boolean;
  prepayment: string;
  minimum_days_prepayment: string;
  canopy_interest: string;
  royalty: string;
  application_processing_fees: string;
  platform_fees: string;
  administration_fees: string;
  verification_charges: string;
  documentation_charges: string;
  annual_maintenance_charges: string;
  insurance_charges: string;
  wallet_fees: string;
  legal_fees: string;
  prepayment_penalty: string;
  printed_statement_charges: string;
  cancellation_charges: string;
  payment_return_charges: string;
  late_penalty: string;
  tds_deducted: string;
  waterfall_structure: string;
  payment_frequency: string;
  compound_frequency: string;
  payment_type: string;
  interest_only_period_in_days: string;
  balloon_payment_after_in_days: string;
}


export interface SummaryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SummaryItem[];
}


export type Project = {
  id: number;
  user: string;
  project_name: string;
  project_type: string | null;
  location: string;
  pin_code: string | null;
  rera_regd_no: string | null;
  start_date: string;
  current_tranche_name: string | null;
  current_tranche_status: string | null;
  current_project_status: string | null;
  line_of_credit_used: string;
  line_of_credit_available: string;
  line_of_credit: string;
  project_total: string;
  percentage_complete_net: string | null;
  application_date: string;
  project_completion_date: string | null;
  last_tranche_date: string | null;
  approved_by_admin: boolean;
  is_maatrum_certified: boolean;
};

export type ProjectResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
};

export type Inventory = {
  id: number;
  project: number;
  tranche: number;
  lots_count: number;
  lots_amount: string;
  foundation_starts_count: number;
  foundation_starts_amount: string;
  models_count: number;
  models_amount: string;
  started_completed_count: number;
  started_completed_amount: string;
  units_count: number;
  units_amount: string;
  contingent_sales_count: number;
  contingent_sales_amount: string;
  approved_by_admin: boolean;
}

export type InventoryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Inventory[];
};
