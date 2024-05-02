import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/shared/utils";
import { Label } from "@/shared/components/ui/label";
import { ReactSelect } from "@/shared/components/ui/select";

export const FormSelect = forwardRef(
  ({ label, name, isRequired, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    return (
      <div className="basis-1/3 p-2">
        <Controller
          name={name}
          control={control}
          defaultValue={""}
          render={({ field: { ref: fieldRef, ...fieldProps } }) => (
            <>
              <Label htmlFor={name} className="flex gap-1">
                {label}
                {isRequired ? <span className="text-red-500">*</span> : null}
              </Label>

              <ReactSelect
                {...props}
                id={name}
                label={label}
                inputRef={fieldRef}
                {...fieldProps}
                className={cn(
                  "outline-none border border-slate-300 focus:border-slate-400 text-xs rounded-xl p-2.5",
                  errors && errors?.[name] ? "!border-red-500" : ""
                )}
              />

              {errors && errors[name] && (
                <span className="border  text-xs  text-red-500">
                  {errors[name]?.value?.message}
                </span>
              )}
            </>
          )}
        />
      </div>
    );
  }
);
