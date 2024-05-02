import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Checkbox } from "@/shared/components/ui/checkbox";

export const CheckboxItem = ({
  name,
  item,
  accessor,
  disabled,
  onCheckboxChange,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { ref, value, onChange, ...props } }) => (
        <Checkbox
          {...props}
          ref={ref}
          label={item.name}
          id={name}
          onChange={(e) => {
            onChange(e);
            onCheckboxChange(e);
          }}
          checked={value}
          data-accessor={accessor}
          disabled={disabled}
        />
      )}
    />
  );
};
