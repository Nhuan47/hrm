import React, { memo, useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

export const ModalInputFile = memo(({ name }) => {
  const [fileName, setFileName] = useState(name || "");

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const attachFileChanged = watch("files");
  useEffect(() => {
    if (attachFileChanged?.length > 0) {
      let names = [];
      for (let i = 0; i < attachFileChanged.length; i++) {
        let currentFile = attachFileChanged[i];
        let fileName = currentFile.name;
        names.push(fileName);
      }
      setFileName(names.join(", "));
    }
  }, [attachFileChanged]);

  return (
    <Controller
      name="files"
      control={control}
      render={({ field: { value, onChange, ...props } }) => (
        <>
          {/*Start label*/}
          <Label className="text-sm text-secondary-500 font-semibold">
            File *{" "}
            <small className="font-normal text-sm">(Accept up to 5MB)</small>
          </Label>
          {/* End label */}

          <div className="relative border border-slate-300 hover:border-slate-500 p-1 rounded-2xl mt-[-10px]">
            <input
              {...props}
              type="file"
              value={value?.file}
              onChange={(event) => {
                onChange([...event.target.files]);
              }}
              className="rounded-xl cursor-pointer border-none outline-none text-transparent file:text-sm file:font-medium file:hidden absolute top-0 left-0 w-full h-full"
            />
            <div className="flex justify-start items-center gap-5">
              <Button className="bg-secondary-200 text-secondary-500">
                Browse
              </Button>
              <span className="text-sm text-secondary-500">{fileName}</span>
            </div>
          </div>
          {errors?.files?.message && (
            <p className="text-red-500 text-xs">{errors?.files?.message}</p>
          )}
        </>
      )}
    />
  );
});
