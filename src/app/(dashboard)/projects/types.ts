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

// Define the type for the entire response
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


export type EsignStatus = {
  projectId: number;
  status: string;
}

export type EsignResponse = {
  success: boolean;
  data: EsignStatus[];
  error?: string;
}