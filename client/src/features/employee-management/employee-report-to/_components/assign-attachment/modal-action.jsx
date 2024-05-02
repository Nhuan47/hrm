import React from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/components/ui/button";

export const ModalAction = ({ onCancel }) => {
  const {
    reset,
    formState: { dirtyFields },
  } = useFormContext();

  const isDisable = Object.keys(dirtyFields).length === 0;

  const handleFormCancel = () => {
    reset({ _: {} });
    onCancel();
  };

  return (
    <div className="flex justify-end items-center gap-2 ">
      <Button
        type="button"
        className="btn-secondary"
        onClick={handleFormCancel}
      >
        Cancel
      </Button>

      <Button
        disabled={isDisable}
        type="submit"
        className={cn(
          "btn-primary",
          isDisable && "bg-primary-400 border-primary-400"
        )}
      >
        Save
      </Button>
    </div>
  );
};
