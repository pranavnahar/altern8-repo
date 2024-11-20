"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Switch } from "../../../../components/ui/switch";
import { Button } from "../../../../components/ui/button";
import { adminApplyProduct } from "../actions";
import { parseCookies } from "nookies";
import { Product } from "../types";

import { useToast } from "@/utils/show-toasts";
import { initiateEmudraFlow } from "../actions";
import { getAuthToken } from "@/utils/helpers";
type AdminApplyProductModalProps = {
  projectId: string;
  productId: number;
};

const ApplyProduct = ({
  projectId,
  productId,
}: AdminApplyProductModalProps) => {
  const [approvalStatus, setApprovalStatus] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedAgreement, setSelectedAgreement] = useState<number | null>(
    null
  );
  const { showToast } = useToast();

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
  let altern8_adminaccess = parseCookies().altern8_adminaccess;

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAuthToken();
    if (!token) {
      router.push("/login");
    } else {
      altern8_adminaccess = token;
    }
  };


  const getRequiredEmudraFlowDetails = async () => {
    try {
      if (!altern8_adminaccess) {
        await ReplaceTokenOrRedirect();
      }
    } catch (error) {

    }
  }

  const getProductDetails = async () => {
    try {
      if (!altern8_adminaccess) {
        await ReplaceTokenOrRedirect();
      }

      let response = await fetch(`${apiUrl}/admin-api/products/`, {
        headers: {
          Authorization: `Bearer ${altern8_adminaccess}`,
        },
      });

      if (response.status === 401) {
        await ReplaceTokenOrRedirect();
        response = await fetch(`${apiUrl}/admin-api/products/`, {
          headers: {
            Authorization: `Bearer ${altern8_adminaccess}`,
          },
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log("the productlist that will be set is: ", responseData);
        setProductList(responseData);
      } else {
        console.error("Failed to fetch products:", response.status);
      }
    } catch (error) {
      console.log("Error during fetching products:", error);
    }
  };

  const selectAgreement = (agreementId: number) => {
    setSelectedAgreement(agreementId);
  };

  const handleSubmit = async () => {
    if (
      approvalStatus === null ||
      selectedProductId === null ||
      selectedAgreement === null
    ) {
      showToast({
        message: "Please select all the required fields.",
        type: "error",
      });
      return;
    }

    if (approvalStatus === false) {
      showToast({
        message: "You should set True to approve the user.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    const result = await adminApplyProduct(projectId, {
      approval_status: approvalStatus,
      product_id: selectedProductId,
      agreement: selectedAgreement,
    });

    setIsLoading(false);

    if (result.success) {
      setIsOpen(false);
      router.refresh();
      showToast({
        message: "Successfully approved the user",
        type: "success",
      });
      console.log("now initiating the emudra flow");

      const emudra_init_result = await initiateEmudraFlow(projectId,
        selectedAgreement,
        productList
      );

      if (emudra_init_result.success) {
        showToast({
          message: "Sent the document link for signing to the user",
          type: "success",
        });
      } else {
        console.error(
          "Failed to send the documents to the user: ",
          emudra_init_result.error
        );
        showToast({
          message: "An error occured while sending the document to user.",
          type: "error",
        });
      }
    } else {
      console.error("Failed to apply product:", result.error);
      showToast({
        message: "Please try again, the request failed..",
        type: "error",
      });
    }
  };

  useEffect(() => {
    getProductDetails();
    getRequiredEmudraFlowDetails();
  }, []);

  const agreementOptions = [
    {
      id: 1,
      name: "Debenture agreement between borrower and NBFC in case of no downsell only TSP facilitation",
    },
    { id: 2, name: "Debenture agreement between borrower and investor" },
    {
      id: 3,
      name: "Debenture agreement between borrower and NBFC in downsell",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-sm">
          Apply Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] background border-none">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Apply Product
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-0">
          <div className="flex items-center gap-4 py-1">
            <label className="text-sm text-white">Approval Status</label>
            <Switch
              checked={approvalStatus}
              onCheckedChange={setApprovalStatus}
            />
          </div>
        </div>
        <div className="grid gap-4 py-2">
          <label className="text-sm text-white">Select a product</label>
          <Select
            onValueChange={(value) => setSelectedProductId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose from this list" />
            </SelectTrigger>
            <SelectContent>
              {productList.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id?.toString() ?? ""}
                >
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 py-2">
          <label className="text-sm text-white">
            Select the agreement type
          </label>
          <div className="grid grid-cols-1 gap-4">
            {agreementOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => selectAgreement(option.id)}
                className={`
      relative p-4 rounded-lg text-white
      backdrop-blur-md
      border border-white/20
      transition-all duration-300 hover:bg-white/20
      ${selectedAgreement === option.id
                    ? "bg-white/15 shadow-lg"
                    : "bg-white/10"
                  }
    `}
              >
                {selectedAgreement === option.id && (
                  <span className="absolute top-2 right-2">
                    <Check size={18} className="text-blue-400" />
                  </span>
                )}
                <span className="block whitespace-normal text-sm text-left">
                  {" "}
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            approvalStatus === null || isLoading || selectedAgreement === null
          }
          className="mt-5"
        >
          {isLoading ? "Applying..." : "Apply"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyProduct;
