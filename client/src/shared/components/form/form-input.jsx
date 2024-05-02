import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/shared/utils";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

export const FormInput = forwardRef(
  ({ label, name, isRequired, rules, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={""}
        rules={rules}
        render={({ field }) => (
          <>
            <Label htmlFor={name} className="flex gap-1">
              {label}
              {isRequired ? <span className="text-red-500">*</span> : null}
            </Label>
            <Input
              {...field}
              id={name}
              label={label}
              {...props}
              className={cn(
                "outline-none border border-slate-300 focus:border-slate-400 text-xs rounded-xl p-3 w-full",
                errors && errors?.[name]?.message ? "border-red-500" : "",
                props?.className
              )}
            />

            {errors && errors?.[name]?.message && (
              <span className="text-xs  text-red-500">
                {errors?.[name]?.message}
              </span>
            )}
          </>
        )}
      />
    );
  }
);
