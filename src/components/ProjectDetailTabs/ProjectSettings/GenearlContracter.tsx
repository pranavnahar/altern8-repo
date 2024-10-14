import DrawTable from "../../../components/CustomizedTable/CustomizedTable";
import { BaseHeaderProps, BaseTableData } from "../../../lib/componentProps";
import React from "react";

export const GenearlContracter = () => {
  const userDetailsHeaders: BaseHeaderProps[] = [
    {
      title: "Name",
      classname: "first-name-class",
      key: "firstName",
    },
    {
      title: "Email",
      classname: "email-class",
      key: "email",
    },
    {
      title: "Phone Number",
      classname: "phone-number-class",
      key: "phoneNumber",
    },
    {
      title: "Address",
      classname: "address-class",
      key: "address",
    },
    {
      title: "Organization",
      classname: "dob-class",
      key: "organization",
    },
    {
      title: "Status",
      classname: "status-class",
      key: "status",
    },
  ];
  const userDetailsData: BaseTableData[] = [
    {
      userId: "U001",
      firstName: "John",
      email: "john.doe@example.com",
      phoneNumber: "+91 2345678901",
      address: "123 Elm Street, Springfield, IL",
      organization: "Joseph Contracting",
      registrationDate: "2024-01-15",
      status: "Active",
    },
    {
      userId: "U002",
      firstName: "Jane",
      email: "jane.smith@example.com",
      phoneNumber: "+91 2345678901",
      address: "456 Oak Avenue, Springfield, IL",
      organization: "Jane Contracting",
      registrationDate: "2024-02-20",
      status: "Inactive",
    },
    {
      userId: "U003",
      firstName: "Emily",
      email: "emily.johnson@example.com",
      phoneNumber: "+91 2345678901",
      address: "789 Pine Road, Springfield, IL",
      organization: "Emily Contracting5",
      registrationDate: "2024-03-10",
      status: "Inactive",
    },
    {
      userId: "U004",
      firstName: "Michael",
      email: "michael.williams@example.com",
      phoneNumber: "+91 2345678901",
      address: "101 Maple Lane, Springfield, IL",
      organization: "Michael Contracting5",
      registrationDate: "2024-04-25",
      status: "Inactive",
    },
    {
      userId: "U005",
      firstName: "Sarah",
      lastName: "Brown",
      email: "sarah.brown@example.com",
      phoneNumber: "+91 2345678901",
      address: "202 Birch Street, Springfield, IL",
      organization: "Sarah Contracting5",
      status: "Inactive",
    },
  ];
  
  return <DrawTable tableData={userDetailsData} headers={userDetailsHeaders} />;
};
