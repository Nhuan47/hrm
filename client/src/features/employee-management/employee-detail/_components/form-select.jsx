import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ReactSelect } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils";

export const FormSelect = ({ name, label, required, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, ...fieldProps } }) => (
        <>
          <Label className="flex gap-1">
            {label}
            {required === 1 && <small className="text-red-500">*</small>}
          </Label>
          <ReactSelect
            {...props}
            {...fieldProps}
            inputRef={ref}
            error={errors?.[name]}
            onChange={(e) => {
              onChange(e);
              props.onChange(e);
            }}
            className={cn(
              "w-full p-2 rounded-lg text-sm text-secondary-500 placeholder:text-xs focus:outline-none focus:border focus:border-slate-600",
              errors?.[name]?.message ? "border-red-500" : "border-gray-300",
              props?.className
            )}
          />
        </>
      )}
    />
  );
};
