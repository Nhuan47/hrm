import React from "react";
import { NumericFormat } from "react-number-format";
import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/shared/components/ui/label";

export const FormInputNumberic = ({ item, ...inputProps }) => {
  const { control } = useFormContext();

  return (
    <div className="flex p-2 justify-between items-center w-1/2 duration-300 hover:bg-secondary-100/50">
      {/* Label */}
      <Label
        htmlFor={item.accessor}
        className="text-secondary-600 text-sm basis-2/3  "
      >
        {item?.name}
      </Label>

      {/* Input field */}
      <div className="flex-1 ">
        <Controller
          name={item?.accessor}
          control={control}
          defaultValue={"0"}
          render={({ field: { ref, ...props } }) => {
            return (
              <NumericFormat
                {...inputProps}
                {...props}
                id={item?.accessor}
                type="text"
                displayType="input"
                thousandSeparator={inputProps.disabled}
                allowLeadingZeros={false}
                className="border border-slate-300 p-1.5 rounded-md outline-none text-sm text-secondary-500 text-right focus:border-slate-500 duration-300 w-full min-w-[10rem]"
                getInputRef={ref}
              />
            );
          }}
        />
      </div>
    </div>
  );
};
