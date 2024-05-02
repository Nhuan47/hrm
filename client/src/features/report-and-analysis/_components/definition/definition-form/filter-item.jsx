import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { BiSolidTrashAlt } from "react-icons/bi";

import { ReactSelect } from "@/shared/components/ui/select";

import { FILTER_KEY } from "../../../_constants/definition-constant";

export const FilterItem = ({ item, onDelete }) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fieldWatch = watch(`${FILTER_KEY}.${item.id}`);

  useEffect(() => {
    if (fieldWatch) {
      setValue(`${FILTER_KEY}.${item.id}`, fieldWatch);
    } else {
      setValue(`${FILTER_KEY}.${item.id}`, []);
    }
  }, []);

  return (
    <div className="flex justify-between items-center border-b border-slate-200 py-5">
      <div className="basis-1/4 flex gap-5 justify-start items-center">
        {/* Start button remove filter items */}
        <span
          className="text-secondary-500 cursor-pointer hover:text-secondary-600"
          onClick={() => onDelete(item.id)}
        >
          <BiSolidTrashAlt size={20} />
        </span>
        {/* Start button remove filter items */}

        {/* Start item label */}
        <span className="text-secondary-500 text-sm   capitalize">
          {item.name}
        </span>
        {/* End item label */}
      </div>

      {/* Start item fields */}
      <div className="basis-3/4">
        <Controller
          name={`${FILTER_KEY}.${item.id}`}
          control={control}
          render={({ field: { ref, ...props } }) => (
            <ReactSelect
              isMulti
              {...props}
              inputRef={ref}
              error={errors[`${FILTER_KEY}.${item.id}`]?.message}
              options={item?.choices}
              className="rounded-md p-2"
            />
          )}
        />
      </div>
    </div>
  );
};
