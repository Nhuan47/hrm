import React from "react";
import { NumericFormat } from "react-number-format";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export const FormInputName = ({ item, ...props }) => {
  const { control } = useFormContext();
  return (
    <div className="flex p-2 justify-between items-center w-1/2 duration-300 hover:bg-secondary-100/50">
      {/* Label */}
      <Label
        htmlFor={item.accessor}
        className="text-secondary-600 text-sm basis-2/3"
      >
        {item?.name}
      </Label>

      {/* Input field */}
      <div className="flex-1 ">
        <Controller
          name={item?.accessor}
          control={control}
          defaultValue={""}
          render={({ field: { ref, ...fieldProps } }) => (
            <Input
              {...fieldProps}
              {...props}
              {...ref}
              id={item?.accessor}
              className="outline-none border border-slate-300 p-1.5 rounded-md w-full text-sm focus:border-slate-500 duration-300 text-secondary-500 text-right "
            />
          )}
        />
      </div>
    </div>
  );
};
