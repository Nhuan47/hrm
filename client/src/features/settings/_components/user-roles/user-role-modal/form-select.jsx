import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { ReactSelect } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

export const FormSelect = ({ roles, value }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full">
      <Controller
        name="roles"
        control={control}
        defaultValue={value || "-- Select -- "}
        render={({ field: { ref, ...props } }) => (
          <>
            <Label htmlFor="roles" className="text-sm">
              Select Roles:
            </Label>
            <ReactSelect
              {...props}
              options={roles}
              className="w-full p-2 rounded-md"
              placeholder={"-- Select -- "}
              error={errors.roles?.message}
              isMulti={false}
              isClearable
            />
          </>
        )}
      />
    </div>
  );
};
