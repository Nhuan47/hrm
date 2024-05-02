import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { cn } from "@/shared/utils";
import { TextArea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

export const FormTextarea = ({ name, label, ...props }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({ field: { ref, ...fieldProps } }) => (
        <>
          <Label htmlFor={name}>{label}</Label>
          <TextArea
            {...fieldProps}
            {...ref}
            {...props}
            id={name}
            className={cn(
              "border rounded-md p-1.5 outline-none focus:border-slate-500 duration-300 w-full",
              props?.className
            )}
          />
        </>
      )}
    />
  );
};
