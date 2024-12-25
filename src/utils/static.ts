const PROJECT_TYPE_CHOICES = [
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Raw Land', label: 'Raw Land' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Plotted Land', label: 'Plotted Land' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Affordable Housing', label: 'Affordable Housing' },
  { value: 'Student Housing', label: 'Student Housing' },
  { value: 'Others', label: 'Others' },
];
export const formTemplate = [
  {
    title: 'Rera Details',
    template: [
      {
        type: 'text',
        label: 'Details of Encumbrances',
        name: 'details_of_encumbrances',
        placeholder: 'Details of Encumbrances',
        required: false,
        formData: 'basicInfo',
      },
      {
        type: 'text',
        label: 'Project Name',
        name: 'project_name',
        placeholder: 'Project Name',
        required: true,
        formData: 'basicInfo',
      },
      {
        type: 'text',
        label: 'RERA Reg No',
        name: 'rera_reg_no',
        placeholder: 'RERA Reg No',
        formData: 'basicInfo',
        required: false,
      },
      {
        type: 'select', // Changed from "text" to "select"
        label: 'Project Type',
        name: 'project_type',
        placeholder: 'Select Project Type',
        required: true,
        formData: 'basicInfo',
        options: PROJECT_TYPE_CHOICES, // Added options array
      },
      {
        type: 'date',
        label: 'Project Registration Date',
        name: 'project_registration_date',
        placeholder: 'Project Registration Date',
        required: false,
        formData: 'basicInfo',
      },
      {
        type: 'number',
        label: 'Proposed Period',
        name: 'proposed_period',
        placeholder: 'Proposed Period',
        required: false,
        formData: 'basicInfo',
      },
      {
        type: 'date',
        label: 'Original Start Date ',
        name: 'original_start_date',
        placeholder: 'Original Start Date ',
        required: true,
        formData: 'basicInfo',
      },
      {
        type: 'date',
        label: 'Modified Start Date',
        name: 'modified_start_date',
        placeholder: 'Modified Start Date',
        required: false,
        formData: 'basicInfo',
      },
      {
        type: 'date',
        label: 'Declared Date Of Completion',
        name: 'declared_date_of_completion',
        placeholder: 'Declared Date Of Completion',
        required: true,
        formData: 'basicInfo',
      },
      {
        type: 'text',
        label: 'Project Location',
        name: 'project_location',
        placeholder: 'Project Location',
        required: true,
        formData: 'basicInfo',
      },
      {
        type: 'text',
        label: 'Commencement Certificate',
        name: 'commencement_certificate',
        placeholder: 'Commencement Certificate',
        required: false,
        formData: 'basicInfo',
      },
    ],
  },
  {
    title: 'Promoter Details',
    template: [
      {
        type: 'text',
        label: 'Promoter Name',
        name: 'promoter_name',
        placeholder: 'Promoter Name',
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'text',
        label: 'Applicant Type',
        name: 'promoter_applicant_type',
        placeholder: 'Applicant Type',
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'number',
        label: 'Promoter Mobile',
        name: 'promoter_mobile',
        placeholder: 'Promoter Mobile',
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'email',
        label: 'Promoter Email',
        name: 'promoter_email',
        placeholder: 'Promoter Email',
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'text',
        label: "Promoter's Address",
        name: 'promoter_address',
        placeholder: "Promoter's Address",
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'text',
        label: "Chairman's Address",
        name: 'chairman_address',
        placeholder: "Chairman's Address",
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'number',
        label: 'Projects of the promoter',
        name: 'number_of_projects_of_the_promoter',
        placeholder: 'Number of the projects of the promoter',
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'number',
        label: 'Complaints against the promoter',
        name: 'total_complaints_against_the_promoter',
        placeholder: 'Total complaints against the promoter',
        required: false,
        formData: 'promoterDetails',
      },
      {
        type: 'number',
        label: 'Complaints in respect to this Project',
        name: 'total_no_of_complaints_in_respect_to_this_project',
        placeholder: 'Total no. of complaints in respect to this Project',
        required: false,
        formData: 'promoterDetails',
      },
    ],
  },
  {
    title: 'Financial Targets',
    template: [
      {
        type: 'text',
        label: 'Quarter Name',
        name: 'quarter_name',
        placeholder: 'Quarter Name',
        required: false,
        formData: 'finacialTargets',
      },
      {
        type: 'number',
        label: 'Target in Rupees',
        name: 'target_in_rupees',
        placeholder: 'Target in Rupees',
        required: false,
        formData: 'finacialTargets',
      },
      {
        type: 'number',
        label: 'Achievement',
        name: 'achievements',
        placeholder: 'Achievement',
        required: false,
        formData: 'finacialTargets',
      },
    ],
  },
  {
    title: 'Plan Details',
    template: [
      {
        type: 'text',
        label: 'Waste Disposal Plan',
        name: 'waste_disposal_plan',
        placeholder: 'Waste Disposal Plan',
        required: false,
        formData: 'plans',
      },
      {
        type: 'text',
        label: 'Water Supply Plan',
        name: 'water_supply_plan',
        placeholder: 'Water Supply Plan',
        required: false,
        formData: 'plans',
      },
      {
        type: 'text',
        label: 'Electricity Supply Plan',
        name: 'electricity_supply_plan',
        placeholder: 'Electricity Supply Plan',
        required: false,
        formData: 'plans',
      },
      {
        type: 'text',
        label: 'Development Work Plan',
        name: 'development_work_plan',
        placeholder: 'Development Work Plan',
        required: false,
        formData: 'plans',
      },
    ],
  },
  {
    title: 'CA Details',
    template: [
      {
        type: 'text',
        label: 'CA Name',
        name: 'ca_name',
        placeholder: 'CA Name',
        required: false,
        formData: 'caCertificateDetails',
      },
      {
        type: 'number',
        label: 'CA Contect Number',
        name: 'ca_contect_number',
        placeholder: 'CA Contect Number',
        required: false,
        formData: 'caCertificateDetails',
      },
      {
        type: 'email',
        label: 'CA Email',
        name: 'ca_email',
        placeholder: 'CA Email',
        required: false,
        formData: 'caCertificateDetails',
      },
      {
        type: 'text',
        label: 'CA Certificate URL',
        name: 'ca_certificate_url',
        placeholder: 'CA Certificate URL',
        required: false,
        formData: 'caCertificateDetails',
      },
      {
        type: 'number',
        label: 'CA Total Cost Estimated',
        name: 'ca_total_cost_estimated',
        placeholder: 'CA Total Cost Estimated',
        required: false,
        formData: 'caCertificateDetails',
      },
      {
        type: 'number',
        label: 'Amount Incurred till now',
        name: 'amount_incurred_till_now',
        placeholder: 'Amount Incurred till now',
        required: false,
        formData: 'caCertificateDetails',
      },
    ],
  },
  {
    title: 'Architect Details',
    template: [
      {
        type: 'text',
        label: 'Architect Name',
        name: 'architect_name',
        placeholder: 'Architect Name',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'COA Registration Number.',
        name: 'coa_registration_number',
        placeholder: 'COA Registration Number.',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Architect Certificate',
        name: 'architects_certificate',
        placeholder: 'Architect Certificate',
        required: false,
        formData: 'architect',
      },
      {
        type: 'number',
        label: 'Architect Contact Number',
        name: 'architects_contact_number',
        placeholder: 'Architect Contact Number',
        required: false,
        formData: 'architect',
      },
      {
        type: 'email',
        label: 'Architect Email',
        name: 'architects_email',
        placeholder: 'Architect Email',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Architect Address',
        name: 'architects_address',
        placeholder: 'Architect Address',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Architect Task',
        name: 'architect_task',
        placeholder: 'Architect Task',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Common Areas And Facilities Amenities',
        name: 'common_areas_and_facilities_amenities',
        placeholder: 'Common Areas And Facilities Amenities',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Proposed',
        name: 'proposed',
        placeholder: 'Proposed',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Details',
        name: 'details',
        placeholder: 'Details',
        required: false,
        formData: 'architect',
      },
      {
        type: 'text',
        label: 'Percentage Of Work Done',
        name: 'percentage_of_work_done',
        placeholder: 'Percentage Of Work Done',
        required: false,
        formData: 'architect',
      },
    ],
  },
  {
    title: 'Engineer Details',
    template: [
      {
        type: 'text',
        label: 'Engineer Name',
        name: 'engineer_name',
        placeholder: 'Engineer Name',
        required: false,
        formData: 'engineer',
      },
      {
        type: 'text',
        label: 'Engineers Certificate',
        name: 'engineers_certificate',
        placeholder: 'Engineers Certificate',
        required: false,
        formData: 'engineer',
      },
      {
        type: 'number',
        label: 'Engineers Contact Number',
        name: 'engineers_contact_number',
        placeholder: 'Engineers Contact Number',
        required: false,
        formData: 'engineer',
      },
      {
        type: 'email',
        label: 'Engineers Email',
        name: 'engineers_email',
        placeholder: 'Engineers Email',
        required: false,
        formData: 'engineer',
      },
      {
        type: 'text',
        label: 'Engineers Address',
        name: 'engineers_address',
        placeholder: 'Engineers Address',
        required: false,
        formData: 'engineer',
      },
    ],
  },
  {
    tilte: 'Allotment Details',
    template: [
      {
        type: 'text',
        label: 'Villa No',
        name: 'villa_no',
        placeholder: 'Villa No.',
        required: false,
        formData: 'allotment',
      },
      {
        type: 'text',
        label: 'Saleble Area',
        name: 'saleble_area',
        placeholder: 'Saleble Area',
        required: false,
        formData: 'allotment',
      },
      {
        type: 'text',
        label: 'Allotment Project',
        name: 'allotment_project',
        placeholder: 'Allotment Project',
        required: false,
        formData: 'allotment',
      },
      {
        type: 'text',
        label: 'Proforma of Application Form',
        name: 'proforma_of_application_form',
        placeholder: 'Proforma of Application Form',
        required: false,
        formData: 'allotment',
      },
      {
        type: 'text',
        label: 'Proforma of Allotment Letter',
        name: 'proforma_of_allotment_letter',
        placeholder: 'Proforma of Allotment Letter',
        required: false,
        formData: 'allotment',
      },
      {
        type: 'text',
        label: 'Proforma of Conveyance Deed',
        name: 'proforma_of_conveyance_deed',
        placeholder: 'Proforma of Conveyance Deed',
        required: false,
        formData: 'allotment',
      },
    ],
  },
  {
    title: 'Lawyer Details',
    template: [
      {
        type: 'text',
        label: 'Lawyer Name',
        name: 'lawyer_name',
        placeholder: 'Lawyer Name',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'text',
        label: 'Lawyer Ref No',
        name: 'lawyer_ref_no',
        placeholder: 'Lawyer Ref No',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'number',
        label: 'Lawyer Contect Number',
        name: 'lawyer_contect_number',
        placeholder: 'Lawyer Contect Number',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'email',
        label: 'Lawyer Email',
        name: 'lawyer_email',
        placeholder: 'Lawyer Email',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'text',
        label: 'Lawyer Address',
        name: 'lawyer_address',
        placeholder: 'Lawyer Address',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'text',
        label: 'Lawyer Certificate',
        name: 'lawyer_certificate',
        placeholder: 'Lawyer Certificate',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'text',
        label: 'Affidavit',
        name: 'affidavit',
        placeholder: 'Affidavit',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'text',
        label: 'Authentic copy of Approval of Project',
        name: 'authentic_copy_of_approval_of_project',
        placeholder: 'Authentic copy of Approval of Project',
        required: false,
        formData: 'lawyerReport',
      },
      {
        type: 'text',
        label: 'Legal Document of Agreement in Case of other Land',
        name: 'legal_document_of_agreement_in_case_of_other_land',
        placeholder: 'Legal Document of Agreement in Case of other Land',
        required: false,
        formData: 'lawyerReport',
      },
    ],
  },
  {
    title: 'Contact Details',
    template: [
      {
        type: 'number',
        label: 'Project Coordinator Number',
        name: 'project_coordinator_number',
        placeholder: 'Project Coordinator Number',
        required: false,
        formData: 'contactDetails',
      },
      {
        type: 'text',
        label: 'State',
        name: 'state',
        placeholder: 'State',
        required: false,
        formData: 'contactDetails',
      },
      {
        type: 'text',
        label: 'District',
        name: 'district',
        placeholder: 'District',
        required: false,
        formData: 'contactDetails',
      },
      {
        type: 'text',
        label: 'Tehsil',
        name: 'tehsil',
        placeholder: 'Tehsil',
        required: false,
        formData: 'contactDetails',
      },
    ],
  },
];
