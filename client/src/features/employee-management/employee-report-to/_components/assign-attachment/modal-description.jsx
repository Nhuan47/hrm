import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/shared/components/ui/label";
import { TextArea } from "@/shared/components/ui/textarea";

export const ModalDescription = ({ description }) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue("description", description);
  }, [description]);

  return (
    <Controller
      name="description"
      control={control}
      render={({ field: { ref, ...props } }) => (
        <>
          <Label className="text-sm text-secondary-500 font-bold">
            Description:
          </Label>
          <TextArea
            ref={ref}
            {...props}
            id="description"
            className="border border-slate-300 focus:border-slate-500 outline-none w-full rounded-xl p-2 text-secondary-500 text-sm duration-300"
            fullWidth
          />
        </>
      )}
    />
  );
};
