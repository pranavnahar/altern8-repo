"use client"

import BasicTable from "../../../components/global/basic-table";
import React, { useEffect, useState } from "react";
import { fetchProjectDocument } from "../../../app/(dashboard)/project/actions/fetch-project-document.actions";
import { useParams } from "next/navigation";
import columns from "./columns";
import { InputForms } from "../../../components/InputForms/InputForms";
import { Button } from "../../../components/ui/button";

const Document = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [budgetData, setBudgetData] = useState([])
  const params = useParams();
  const projectId = Number(params.id);

  useEffect(() => {
    const handleFetchDocument = async () => {
      const data: any = await fetchProjectDocument(projectId);
      setBudgetData(data.results)
    }
    handleFetchDocument()
  }, [])

  return (
    <div className="flex flex-col px-5 h-[65vh] overflow-auto">
      <Button className="self-end my-2 " onClick={() => setOpen(true)}>
        Add Documents
      </Button>
      <BasicTable data={budgetData} columns={columns} filters={[]} needFilters={false} tableName="project_details_tab_view"/>
      <InputForms
        open={open}
        onOpenChange={() => setOpen(false)}
        title={"Add New Documents"}
        data={[]}
        
      />
    </div>
  );
};

export default Document;
