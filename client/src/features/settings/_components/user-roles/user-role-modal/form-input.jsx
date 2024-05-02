import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export const FormInput = ({ value }) => {
  const { control } = useFormContext();
  return (
    <div className="w-full">
      <Controller
        name="name"
        control={control}
        defaultValue={value}
        render={({ field: { ref, ...fieldProps } }) => (
          <>
            <Label htmlFor="name" className="text-sm">
              Employee Name:
            </Label>
            <Input
              {...fieldProps}
              value={value}
              disabled
              id="name"
              ref={ref}
              className="w-full p-2 rounded-md outline-none border border-secondary-300"
            />
          </>
        )}
      />
    </div>
  );
};
