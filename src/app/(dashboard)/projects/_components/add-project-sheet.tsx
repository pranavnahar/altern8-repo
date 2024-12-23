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

const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Mixed-use'];
const projectStatuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

const AddProjectSheet = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { showToast } = useToast();
  const [users, setUsers] = useState<BorrowersList>([]);
  const form = useForm({
    defaultValues: {
      user: '',
      project_name: '',
      project_type: '',
      location: '',
      pin_code: '',
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
  //it is added because of a bug (Infinite rerendering)
  useEffect(() => {
    const sheetIsOpen = searchParams.get('open') || 'false';
    if (sheetIsOpen === 'true') {
      setIsOpen(true);
    }
  }, []);
  const onSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();

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

  useEffect(() => {
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
          <SheetDescription>Fill in the details to create a new project.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.uid} value={user.uid}>
                          {user.uid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rera_regd_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RERA Registration Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Calendar
                    mode="single"
                    className="text-white"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    disabled={date => date > new Date() || date < new Date('1900-01-01')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_tranche_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Tranche Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_tranche_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Tranche Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_project_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Project Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line_of_credit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line of Credit</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equity_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equity Commitment</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="debt_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt Commitment</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="other_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Commitment</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Total</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_deed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale deed</FormLabel>
                  <FormControl>
                    <FileUpload
                      onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                      className="my-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="encumbrance_certificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encumbrance certificate</FormLabel>
                  <FormControl>
                    <FileUpload
                      onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                      className="my-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_option"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Upload the documents</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fetch" />
                        </FormControl>
                        <FormLabel className="font-normal">Fetch all details for me</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="upload" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I will upload all the documents
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
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
                      <FormLabel>Title Deed</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fmb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FMB</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tslr_records"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TSLR Records</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patta_chitta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patta/Chitta</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guideline_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guideline Value</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mortage_report"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mortage Report</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_tax_receipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Tax Receipt</FormLabel>
                      <FormControl>
                        <FileUpload
                          onDrop={acceptedFiles => field.onChange(acceptedFiles)}
                          className="my-4"
                        />
                      </FormControl>
                      <FormMessage />
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
