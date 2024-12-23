import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Calendar } from '../../../../components/ui/calendar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../../components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { format } from 'date-fns';
import { createProject, fetchBorrowersUids } from '../actions';
import { useToast } from '../../../../utils/show-toasts';
import { ChevronRight } from 'lucide-react';
import FileUpload from '@/components/FileUpload/FileUpload';
import { useSearchParams } from 'next/navigation';


type Borrower = {
  uid: string;
  company_name: string;
};
type BorrowersList = Borrower[];

const formSchema = z.object({
  user: z.string().min(2, {
    message: 'Select a valid user',
  }),
  location: z.string().min(2, {
    message: 'Location Field is required',
  }),
  percentage_complete_net: z.string().min(2, {
    message: '',
  }),
  project_name: z.string().min(2, {
    message: 'Project Name Field is required',
  }),
  project_total: z.string().min(2, {
    message: 'Project Total Field is required',
  }),
  project_type: z.string().min(2, {
    message: 'Project Type Field is required',
  }),
  start_date: z.coerce.date(),
});

const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Mixed-use'];
const projectStatuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

const AddProjectSheet = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { showToast } = useToast();
  const [users, setUsers] = useState<BorrowersList>([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      project_name: '',
      project_type: '',
      location: '',
      pin_code: '',
      percentage_complete_net: '',
      rera_regd_no: '',
      start_date: null,
      current_tranche_name: '',
      current_tranche_status: '',
      current_project_status: '',
      line_of_credit: '',
      equity_commitment: '',
      debt_commitment: '',
      other_commitment: '',
      project_total: '',
      document_option: 'fetch',
      sale_deed: null,
      encumbrance_certificate: null,
      title_deed: null,
      fmb: null,
      tslr_records: null,
      patta_chitta: null,
      guideline_value: null,
      mortage_report: null,
      property_tax_receipt: null,
    },
  });


  useEffect(() => {
    const sheetIsOpen = searchParams.get('open') || 'false';
    if (sheetIsOpen === 'true') {
      setIsOpen(true);
    }
    const loadUsers = async () => {
      try {
        const data: BorrowersList = await fetchBorrowersUids();
        setUsers(data);
      } catch (error) {
        showToast({
          message: 'Failed to fetch users. Please try again.',
          type: 'error',
        });
      }
    };

    loadUsers();
  }, []);
  const onSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();
    console.log('This is from the formdata');
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Check if the value is an array of files
        if (Array.isArray(value) && value[0] instanceof File) {
          value.forEach(file => formData.append(key, file)); // Append each file
        } else {
          formData.append(key, value);
        }
      }
    });

    if (data.start_date) {
      formData.set('start_date', format(new Date(data.start_date), 'yyyy-MM-dd'));
    }

    console.log('Processed FormData to be sent:');
    // for (let pair of formData.entries()) {
    //   const key = pair[0];
    //   const value = pair[1];
    //   if (value instanceof File) {
    //     console.log(key, `File: ${value.name}, Size: ${value.size} bytes, Type: ${value.type}`);
    //   } else {
    //     console.log(key, value);
    //   }
    // }

    try {
      const response = await createProject(formData);
      console.log('createProject response', response);
      if (response.success) {
        showToast({
          message: 'Project created successfully',
          type: 'success',
        });
        setIsOpen(false);
        form.reset();
      } else {
        console.error(response.error);
        showToast({
          message: 'Failed to create project. Please try again.',
          type: 'warning',
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showToast({
        message: 'An unexpected error occurred. Please try again.',
        type: 'error',
      });
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="expandIcon"
          size="sm"
          Icon={ChevronRight}
          iconPlacement="right"
          className="text-sm"
        >
          Add Project
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto background border-none">
        <SheetHeader>
          <SheetTitle className="text-gray-300">Add New Project</SheetTitle>

          <SheetDescription className="text-white">
            Fill in the details to create a new project.
          </SheetDescription>

        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-white">User</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="bg-gray-300 rounded-lg">
                      {users.length > 0 &&
                        users.map(user => (
                          <SelectItem
                            key={user.uid}
                            value={user.uid}
                            className="cursor-pointer border"
                          >
                            {user.uid}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_type"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-white">Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="bg-gray-300 rounded-lg">
                      {projectTypes.map(type => (
                        <SelectItem key={type} value={type} className="cursor-pointer border ">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">PIN Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rera_regd_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">RERA Registration Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Start Date</FormLabel>
                  <Calendar
                    mode="single"
                    className="text-white"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    disabled={date => date > new Date() || date < new Date('1900-01-01')}
                  />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_tranche_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Current Tranche Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_tranche_status"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-white">Current Tranche Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-300 rounded-lg">
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status} className="cursor-pointer border ">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_project_status"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-white">Current Project Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-300 rounded-lg">
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status} className="cursor-pointer border ">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line_of_credit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Line of Credit</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equity_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Equity Commitment</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="debt_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Debt Commitment</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="other_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Other Commitment</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Project Total</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="percentage_complete_net"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">% Complete</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sale_deed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Sale deed</FormLabel>
                  <FormControl>
                    <FileUpload
                      onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                      className="my-4"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="encumbrance_certificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Encumbrance certificate</FormLabel>
                  <FormControl>
                    <FileUpload
                      onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                      className="my-4"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_option"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-white">Upload the documents</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fetch" className="text-blue-400" />
                        </FormControl>

                        <FormLabel className="font-normal text-gray-100">
                          Fetch all details for me
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="upload" className="text-blue-400" />
                        </FormControl>
                        <FormLabel className="font-normal text-gray-100">
                          I will upload all the documents
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {form.watch('document_option') === 'upload' && (
              <>
                <FormField
                  control={form.control}
                  name="title_deed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Title Deed</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fmb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">FMB</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tslr_records"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">TSLR Records</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patta_chitta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Patta/Chitta</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guideline_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Guideline Value</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mortage_report"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Mortage Report</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_tax_receipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Property Tax Receipt</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddProjectSheet;
