import React from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { featureKeys } from "@/shared/permission-key";
import { usePermissions } from "@/shared/hooks/use-permission";

export const FormAction = ({ onEditable, isEditable }) => {
  const { isUpdateable } = usePermissions(featureKeys.EMPLOYEE_SALARY);

  const {
    formState: { isDirty, dirtyFields },
  } = useFormContext();

  let isModified = Object.keys(dirtyFields)?.length > 0;
  const idEditing = useSelector((state) => state.salary.currentIdEditing);

  return (
    <div className="flex justify-end items-center py-1.5 space-x-2">
      {isUpdateable && idEditing && (
        <Button
          type="button"
          className="btn-primary"
          onClick={onEditable}
          disabled={isEditable}
        >
          Edit
        </Button>
      )}

      <Button
        type="submit"
        className="btn-primary"
        disabled={!isDirty || !isModified || (idEditing && !isEditable)}
      >
        Save
      </Button>
    </div>
  );
};
