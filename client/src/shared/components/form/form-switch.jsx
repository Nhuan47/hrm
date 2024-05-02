import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { cn } from "@/shared/utils";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";

export const FormSwitch = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={0}
      render={({ field: { ref, ...fieldProps } }) => (
        <>
          <Label htmlFor={name}>{label}</Label>
          <Switch {...fieldProps} ref={ref} id={name} />
        </>
      )}
    />
  );
};
