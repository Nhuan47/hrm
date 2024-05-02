import { forwardRef } from "react";
import Select from "react-select";

import { cn } from "@/shared/utils";

export const ReactSelect = forwardRef((props, ref) => {
  const { id, label, labelClassName, error, className, ...selectProps } = props;

  // Style for select component
  const selectStyles = {
    control: (styles) => ({ ...styles }),
    option: (base) => ({
      ...base,
      cursor: "pointer",
    }),
    menuList: (base) => ({
      ...base,
      boxShadow: "0 0.1rem 0.2rem 0.1rem rgba(0, 0, 0, 0.082)",
    }),
  };

  return (
    <>
      <Select
        {...selectProps}
        styles={selectStyles}
        unstyled
        ref={ref}
        theme={(theme) => ({ ...theme, borderRadius: 0 })}
        classNames={{
          control: (state) =>
            cn(
              "border text-secondary-500 duration-300 text-xs",
              className,
              error ? "border-red-500" : "border-slate-300",
              state.isDisabled ? "bg-secondary-100/60 " : "cursor-pointer",
              state.isFocused && error
                ? "border-red-500"
                : state.isFocused
                ? "border-slate-500"
                : ""
            ),

          option: (state) =>
            cn(
              "p-3 text-xs z-10 duration-300",
              state.isFocused ? "bg-gray-200 " : "",
              state.isSelected ? "bg-gray-200 " : ""
            ),

          menuList: () =>
            cn(
              "text-xs text-secondary-500 duration-300 rounded-md bg-white z-10"
            ),

          placeholder: () => "text-xs text-secondary-500",

          noOptionsMessage: () => "text-xs text-secondary-500 p-3",

          multiValue: () =>
            "g-secondary-100  rounded-2xl py-[3px]  px-2.5 flex gap-2 items-center",

          multiValueRemove: () =>
            "border rounded-full bg-secondary-300 p-[2px] hover:bg-secondary-500 duration-300 w-4 h-4 text-light",

          multiValueLabel: () => "text-xs",
          clearIndicator: () => "w-4 h-4 mb-1",
          menuPortal: () => "w-42 h-42 border bg-red-500",
          indicatorSeparator: () => "",
          container: () => "",
          dropdownIndicator: () => "",
          indicatorsContainer: () => "",
          menu: () => "relative",
          input: () => "",
          valueContainer: () => "flex gap-1",
        }}
      />
    </>
  );
});
