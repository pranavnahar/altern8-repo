import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

const DeleteConfirmation: React.FC<{ onConfirm: () => Promise<void> }> = ({
  onConfirm,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button {...props} />
      </DialogTrigger>
      <DialogContent className="[background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] border-none">
        <DialogHeader>
          <DialogTitle className="mt-2 font-medium">
            Are you sure you want to delete this rule?
          </DialogTitle>
          <DialogDescription className="pt-3">
            This action cannot be undone. This will permanently delete the rule.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-5">
          <Button
            variant="outline"
            className="text-white bg-transparent border-2 hover:bg-transparent border-primary animation hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="text-white bg-primary animation hover:bg-primary/80 hover:text-white"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
