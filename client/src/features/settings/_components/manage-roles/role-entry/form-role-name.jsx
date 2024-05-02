import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export const RoleName = ({ disabled }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-[25rem]">
      <Controller
        name="name"
        control={control}
        defaultValue={""}
        render={({ field: { ref, ...props } }) => (
          <>
            <Label className="capitalize text-sm text-secondary-500 ">
              Role name
            </Label>
            <Input
              ref={ref}
              {...props}
              placeholder={"Enter role name"}
              className={
                "border rounded-md p-2 border-secondary-300 outline-none focus:border-secondary-500 duration-300 text-sm text-secondary-500"
              }
              disabled={disabled}
              error={errors?.name?.message}
            />
          </>
        )}
      />
    </div>
  );
};
