export interface formDataType {
  basicInfo: { [key: string]: string };
  promoterDetails: { [key: string]: string };
  financialTargets: { [key: string]: string };
  plans: { [key: string]: string };
  caCertificateDetails: { [key: string]: string };
  architect: { [key: string]: string };
  engineer: { [key: string]: string };
  allotment: { [key: string]: string };
  lawyerReport: { [key: string]: string };
  contactDetails: { [key: string]: string };
}
export interface reraDetailsResponse {
  id: number;
  details_of_encumbrances: string;
  project_name: string;
  rera_reg_no: string;
  project_type: string;
  project_registration_date: string;
  proposed_period: string;
  original_start_date: string;
  modified_start_date: string;
  declared_date_of_completion: string;
  project_location: string;
  commencement_certificate: string;
  file: string;
  user: string;
}

export interface promoterDetailsResponse {
  id: number;
  promoter_name: string;
  promoter_applicant_type: string;
  promoter_mobile: string;
  promoter_email: string;
  promoter_address: string;
  chairman_address: string;
  number_of_projects_of_the_promoter: number;
  total_complaints_against_the_promoter: number;
  total_no_of_complaints_in_respect_to_this_project: number;
  rera: number;
}
export interface planDetailResponse {
  id: number;
  waste_disposal_plan: string;
  water_supply_plan: string;
  electricity_supply_plan: string;
  development_work_plan: string;
  rera: number;
}
export interface caDetailsResponse {
  id: number;
  ca_name: string;
  ca_contect_number: string;
  ca_email: string;
  ca_certificate_url: string;
  ca_total_cost_estimated: number;
  amount_incurred_till_now: number;
  rera: number;
}
export interface engineerDetailsResponse {
  id: number;
  engineer_name: string;
  engineers_certificate: string;
  engineers_contact_number: string;
  engineers_email: string;
  engineers_address: string;
  rera: number;
}
export interface allotmentDetailsResponse {
  id: number;
  villa_no: string;
  saleble_area: string;
  allotment_project: string;
  proforma_of_application_form: string;
  proforma_of_allotment_letter: string;
  proforma_of_conveyance_deed: string;
  rera: number;
}
export interface lawyerDetailsResponse {
  id: number;
  lawyer_name: string;
  lawyer_ref_no: string;
  lawyer_contect_number: string;
  lawyer_email: string;
  lawyer_address: string;
  lawyer_certificate: string;
  affidavit: string;
  authentic_copy_of_approval_of_project: string;
  legal_document_of_agreement_in_case_of_other_land: string;
  rera: number;
}
export interface contactDetailsResponse {
  id: number;
  project_coordinator_number: string;
  state: string;
  district: string;
  tehsil: string;
  rera: number;
}

export interface ErrorResponse {
  detail: string;
}
