import React from "react";
import { Button } from "../../../../components/ui/button";
import ky from "ky";
import { getAuthToken } from "@/utils/auth-actions";
import { redirect } from "next/navigation";

function DownloadButton({
  fileName,
  from,
}: {
  fileName: string;
  from: string;
}) {
  const handleAPI = async (projectID: number) => {
    const APIUrls: { [key: string]: string } = {
      budget: `${process.env.NEXT_PUBLIC_API_URL}/rablet-api/projects/${projectID}/tranches/${projectID}/budget-template/`,
      task: `${process.env.NEXT_PUBLIC_API_URL}/rablet-api/projects/${projectID}/tranches/${projectID}/tasks/export/`
    };
    try {
      const token = await getAuthToken();
      const response = await ky.get(APIUrls[from], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.blob();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          redirect('/login')
        }
        if (error.name === "TimeoutError") {
          redirect('/login')
        }
      }
      throw error;
    }
  };

  const handleDownload = async () => {
    try {
      const data = await handleAPI(1);
      console.log(data);
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <Button
      variant={"outline"}
      className=" bg-themeBlue border-0 text-white hover:bg-themeBlue hover:text-white"
      onClick={handleDownload}
    >
      Download
    </Button>
  );
}

export default DownloadButton;
