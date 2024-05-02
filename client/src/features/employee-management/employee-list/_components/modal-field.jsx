import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/shared/components/ui/input";

export const ModalField = ({ id, name, label, error, ...props }) => {
  const { control } = useFormContext();
  return (
    <div key={id} className="basis-1/3 p-2">
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            id={id}
            label={label}
            {...props}
            className="outline-none border border-slate-300 focus:border-slate-400 text-xs rounded-xl p-3"
            error={error?.message}
          />
        )}
      />
    </div>
  );
};
