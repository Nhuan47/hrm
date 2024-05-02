import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { ReactSelect } from "@/shared/components/ui/select";
import { AXIS_KEY, LEGEND_KEY, PIVOT_KEY } from "@/shared/constants";

const LIMIT_OPTION_NUMBER = 2;

export const PivotChartConfig = ({ fields }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const formWatch = watch(PIVOT_KEY);

  useEffect(() => {
    console.log("formWatch: ", formWatch);
  }, [formWatch]);

  return (
    <div className="mt-5 ">
      <div className="flex flex-wrap">
        <div className="basis-1/2 p-3">
          <Controller
            name={`${PIVOT_KEY}.${AXIS_KEY}`}
            control={control}
            render={({ field: { ref, ...props } }) => {
              // Check option exist in legend field, if option already exist in legend field then exclude to axis options
              let legendFieldSelected = formWatch?.legend
                ? Object.values(formWatch?.legend)?.map((item) => item?.value)
                : [];

              // Filter options not include in legend field
              let optionWithoutSelected = fields?.filter(
                (field) => !legendFieldSelected.includes(field?.value)
              );

              return (
                <ReactSelect
                  {...props}
                  label="Axis (Categories)"
                  labelClassName="text-xs text-slate-700"
                  className="rounded-xl mt-1 px-2 text-slate-600"
                  isMulti
                  isValidNewOption={false}
                  options={
                    props.value?.length === LIMIT_OPTION_NUMBER
                      ? []
                      : optionWithoutSelected
                  }
                  noOptionsMessage={() => {
                    return props.value?.length === LIMIT_OPTION_NUMBER
                      ? "You have reached the max options value"
                      : "No options available";
                  }}
                  error={errors.axis?.message}
                />
              );
            }}
          />
        </div>

        <div className="basis-1/2 p-3">
          <Controller
            name={`${PIVOT_KEY}.${LEGEND_KEY}`}
            control={control}
            render={({ field: { ref, ...props } }) => {
              // Check option exist in exis field, if option already exist in exis field then exclude to legend options
              let legendFieldSelected = formWatch?.axis
                ? Object.values(formWatch?.axis)?.map((item) => item?.value)
                : [];

              // Filter options not include in exis field
              let optionWithoutSelected = fields?.filter(
                (field) => !legendFieldSelected.includes(field?.value)
              );
              return (
                <ReactSelect
                  {...props}
                  label="Legend  (Series)"
                  labelClassName="text-xs text-slate-700"
                  className="rounded-xl mt-1 px-2 text-slate-600"
                  isMulti
                  options={
                    props.value?.length === LIMIT_OPTION_NUMBER
                      ? []
                      : optionWithoutSelected
                  }
                  noOptionsMessage={() => {
                    return props.value?.length === LIMIT_OPTION_NUMBER
                      ? "You have reached the max options value"
                      : "No options available";
                  }}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
