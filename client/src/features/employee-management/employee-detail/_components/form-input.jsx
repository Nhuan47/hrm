import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/shared/utils";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export const FormInput = ({ name, label, required, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...fieldProps } }) => (
        <>
          <Label className="flex gap-1">
            {label}
            {required === 1 && (
              <small className="text-red-500 font-bold text-xs">*</small>
            )}
          </Label>
          <Input
            {...ref}
            {...fieldProps}
            {...props}
            id={name}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-xs text-secondary-500 placeholder:text-xs focus:outline-none focus:border focus:border-slate-600",
              errors?.[name]?.message ? "border-red-500" : "border-gray-300",
              props?.className
            )}
          />
        </>
      )}
    />
  );
};
