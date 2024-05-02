import React from "react";
import { useSelector } from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import "react-loading-skeleton/dist/skeleton.css";

import { ReactSelect } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { useFetchTypes } from "../../../_hooks/manage-roles/use-fetch-type";

export const SelectRoleType = ({ disabled }) => {
  const { types, isFetching } = useFetchTypes();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-[25rem]">
      <Controller
        name="type"
        control={control}
        render={({ field: { ref, ...props } }) => (
          <>
            <Label className="text-sm text-secondary-500">Type</Label>
            <ReactSelect
              {...props}
              {...ref}
              options={types?.map((typeItem) => ({
                label: typeItem.name,
                value: typeItem.id,
              }))}
              className=" text-sm rounded-md px-3 py-2"
              isDisabled={disabled}
              error={errors?.type?.value?.message}
            />
          </>
        )}
      />
    </div>
  );
};
