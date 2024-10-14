/* eslint-disable camelcase */
"use client";

import { BaseHeaderProps, BaseTableData } from "../../lib/componentProps";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useState } from "react";
import DrawTable from "../CustomizedTable/CustomizedTable";
import DrawRuleModal, { rowDataprops } from "../drawRuleModal/drawRuleModal";
import { Card, CardContent, CardHeader } from "../ui/card";
import { InputForms } from "../InputForms/InputForms";
import { FormInput } from "../LedgerTypeTable/Filter";
import { useParams, useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userRole } from "../../atom/atom";

type DrawOverViewProps = {
  documentsTableData: BaseTableData[];
  rulesTableData: BaseTableData[];
};

export default function DrawOverView({
  documentsTableData,
  rulesTableData,
}: DrawOverViewProps) {
  const [viewAllDocuments, setViewAllDocuments] = useState<boolean>(false);
  const [viewAllRules, setViewAllRules] = useState<boolean>(false);
  const [openRuleModal, setOpenRuleModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [rowData, setRowData] = useState<rowDataprops | BaseTableData>({
    name: "",
    status: "",
    updated_by: "",
    updated_last: "",
  });
  const admin = useRecoilValue(userRole)
  const router = useRouter()
  const params = useParams()

  const documentsTableHeaders: BaseHeaderProps[] = [
    {
      title: "Vendor",
      classname: "w-[100px]",
      key: "vendor",
    },
    {
      title: "Type",
      classname: "",
      key: "type",
    },
    {
      title: "Status",
      classname: "",
      key: "status",
    },
    {
      title: "Approval Status",
      classname: "",
      key: "approvalStatus",
    },
    {
      title: "Next Approver",
      classname: "",
      key: "nextApprover",
    },
    {
      title: "Amount",
      classname: "",
      key: "amount",
    },
  ];

  const rulesTableHeaders: BaseHeaderProps[] = [
    {
      title: "Name",
      classname: "w-[320px]",
      key: "name",
      rowClassname: "cursor-pointer",
      onClick: (row) => {
        setOpenRuleModal(true), setRowData(row);
      },
    },
    {
      title: "Status",
      classname: "",
      key: "status",
    },
    {
      title: "Updated By",
      classname: "",
      key: "updated_by",
    },
    {
      title: "Updated Last",
      classname: "",
      key: "updated_last",
    },
  ];

  const data = [
    {
      type: "EQUITY",
      contributed: "₹ 1,590,709.00",
      total: "₹ 1,590,709.00",
    },
    {
      type: "DEBT",
      contributed: "₹ 1,590,709.00",
      total: "₹ 9,733,722.00",
    },
    {
      type: "SECONDARY DEBT",
      contributed: "₹ 8,090,709.00",
      total: "₹ 11,324,431.00",
    },
    {
      type: "TOTAL",
      contributed: "₹ 1,590,709.00",
      total: "₹ 11,324,431.00",
    },
  ];

  const fundingTabHeaders: BaseHeaderProps[] = [
    {
      title: "Type",
      classname: "",
      key: "type",
    },
    {
      title: "Contributed",
      classname: "",
      key: "contributed",
    },
    {
      title: "Total",
      classname: "",
      key: "total",
    },
  ];

  const addDocumentFields: FormInput[] = [
    {
      type: "text",
      label: "Vendor",
      name: "vendor",
      placeholder: "Enter the Vendor",
      required: false,
    },
    {
      type: "text",
      label: "Type",
      name: "type",
      placeholder: "Enter the Type",
      required: false,
    },
    {
      type: "text",
      label: "Status",
      name: "status",
      placeholder: "Enter the Status",
      required: false,
    },
    {
      type: "text",
      label: "Approval Status",
      name: "approval_status",
      placeholder: "Enter the Approval Status",
      required: false,
    },
    {
      type: "text",
      label: "Next Approver",
      name: "next_approver",
      placeholder: "Enter the Next Approver",
      required: false,
    },
    {
      type: "number",
      label: "Amount",
      name: "amount",
      placeholder: "Enter the Amount",
      required: false,
    },
  ];

  const addRulesFormFields: FormInput[] = [
    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter the name",
      required: false,
    },
    {
      type: "dropdown",
      label: "Status",
      name: "status",
      placeholder: "Select the Status",
      required: false,
      values: ["Passed", "Rejected"],
    },
  ];

  return (
    <div className="w-[90vw] overflow-auto mx-auto">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {/* Documents */}
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              <h2 className="mr-3 text-white font-bold">{`Documents ${
                viewAllDocuments ? documentsTableData.length : 5
              }/${documentsTableData.length}`}</h2>
              <p className="text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                ducimus voluptates ad reprehenderit
              </p>
            </div>

            <div className="flex items-center">
              {/* <Button
                variant="link"
                className="text-themeBlue"
                onClick={() => setOpen(true)}
              >
                Add New
              </Button> */}

              <Button
                variant="link"
                className="text-themeBlue"
                onClick={() => setViewAllDocuments(!viewAllDocuments)}
              >
                {viewAllDocuments ? "Hide" : "View All"}
              </Button>
            </div>
          </div>
          <DrawTable
            tableData={documentsTableData?.slice(
              0,
              viewAllDocuments ? documentsTableData.length : 5
            )}
            headers={documentsTableHeaders}
          />
        </div>

        {/* Rules */}
        {admin && <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              <h2 className="mr-3 text-white font-bold">{`Rules ${
                viewAllRules ? rulesTableData.length : 5
              }/${rulesTableData.length}`}</h2>
              <p className="text-white">
                Lorem ipsum dolor sit am`et consectetur adipisicing elit. Totam
                ducimus voluptates ad reprehenderit
              </p>
            </div>
            <div className="flex">
              {/* <Button
                variant="link"
                className="text-themeBlue mr-3"
                onClick={() => setRulesOpen(true)}
              >
                Add New
              </Button> */}
              {/* <Button variant="link" className="text-themeBlue mr-3">
                Edit Rules
              </Button> */}
              <Button
                variant="link"
                className="text-themeBlue"
                onClick={() => setViewAllRules(!viewAllRules)}
              >
                {viewAllRules ? "Hide" : "View All"}
              </Button>
            </div>
          </div>
          <DrawTable
            tableData={rulesTableData?.slice(
              0,
              viewAllRules ? rulesTableData.length : 5
            )}
            headers={rulesTableHeaders}
          />
        </div>}

        {/* Comments */}
        <div className="p-5">
          <div className="flex">
            <h2 className="mr-3 text-white font-bold">Comments: 0</h2>
            <p className="text-white  ">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
              quidem alias error saepe adipisci facilis.
            </p>
          </div>
          <p className="text-white mt-5 ml-5">
            No comments have been left on the Tranche.
          </p>
        </div>

        {/* Tranche Summary */}
        <div className="p-5">
          <div className="flex">
            <h2 className="mr-3 text-white font-bold">
              Tranche Summary : 75684536 INR
            </h2>
            <p className="text-white">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
              quidem alias error saepe adipisci facilis.
            </p>
          </div>
        </div>

        {/* Approvals */}
        <div className="grid grid-cols-2 gap-5 justify-between p-5 w-full">
          <Card className="[background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <h2 className="text-sm font-bold">
                  Line Items Adjustments : 0
                </h2>
                <p className="text-xs ">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                There are no line items with non-zero net adjustments on this
                Tranche.
              </p>
              <Button onClick={() => router.push(`/draw/${params.id}?current_tab=Budget`)}>Create Budget Adjustment</Button>
            </CardContent>
          </Card>

          <Card className="[background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0 text-white">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <h2 className="text-sm font-bold">Approvals</h2>
                <p className="text-xs ">0 / 0</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className=" mb-2 text-sm">
                No reviewers have been configured for the Tranche
              </p>
            </CardContent>
          </Card>

          <Card className="[background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] border-0">
            <CardHeader>
              <div className="flex gap-3 justify-between items-center text-white">
                <h2 className="text-sm font-bold">Funding Sources : 1 / 3</h2>
                <Button variant={"link"} className="text-themeBlue" onClick={() => router.replace('/project/INV001?current_tab=Project%20Settings')}>
                  Edit Funding Sources
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DrawTable tableData={data} headers={fundingTabHeaders} />
            </CardContent>
          </Card>
        </div>  
      </motion.div>
      <DrawRuleModal
        open={openRuleModal}
        onOpenChange={setOpenRuleModal}
        rowData={rowData}
      />
      <InputForms
        open={open}
        onOpenChange={() => setOpen(false)}
        data={addDocumentFields}
        title={"Add New Document"}
      />
      <InputForms
        open={rulesOpen}
        onOpenChange={() => setRulesOpen(false)}
        data={addRulesFormFields}
        title={"Add New Rules"}
      />
    </div>
  );
}
