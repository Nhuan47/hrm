import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";

export const FormStatus = ({ value }) => {
  const { control } = useFormContext();
  return (
    <div className="w-full">
      <Controller
        name="status"
        control={control}
        defaultValue={value || 0}
        render={({ field: { ref, ...fieldProps } }) => (
          <div className="flex gap-2 justify-start items-center mt-1">
            <Label htmlFor="name" className="text-sm">
              Employee Status:
            </Label>
            <Switch {...fieldProps} ref={ref} id="status" />
          </div>
        )}
      />
    </div>
  );
};
