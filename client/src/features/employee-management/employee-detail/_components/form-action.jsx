import React from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";

export const FormAction = ({ isEditable, onEditable, isDisabled }) => {
  const {
    formState: { isDirty },
  } = useFormContext();
  return (
    <div className="flex justify-end items-center py-2 space-x-2">
      <Button
        type="button"
        disabled={isEditable || isDisabled}
        onClick={onEditable}
        className="btn-primary"
      >
        Edit
      </Button>
      <Button
        type="submit"
        className="btn-primary"
        disabled={!isDirty || isDisabled || !isEditable}
      >
        Save
      </Button>
    </div>
  );
};
