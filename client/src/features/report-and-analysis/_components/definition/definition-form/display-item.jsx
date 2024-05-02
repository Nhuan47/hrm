import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { BiSolidTrashAlt } from "react-icons/bi";

import { Checkbox } from "@/shared/components/ui/checkbox";

import { DISPLAY_KEY } from "../../../_constants/definition-constant";

export const DisplayItem = ({ fieldItem, onDelete }) => {
  // State to manage select all items
  const [selectAll, setSelectAll] = useState(false);

  //  Get method from form context
  const {
    watch,
    setValue,
    formState: { errors },
    control,
  } = useFormContext();

  const formWatch = watch();

  // Initialize values for display field checkboxes based on selected filters
  useEffect(() => {
    // Check if the DISPLAY_KEY is present in the formWatch
    if (formWatch.hasOwnProperty(DISPLAY_KEY)) {
      // Get the field IDs of the selected filters
      const selectedFieldIds = Object.keys(formWatch[DISPLAY_KEY]).filter(
        (fieldId) => formWatch[DISPLAY_KEY][fieldId]
      );

      // Iterate through the fields of the current display item
      fieldItem?.fields.forEach((field) => {
        // Set the checkbox value based on whether the field ID is in the selected filters
        setValue(
          `${DISPLAY_KEY}.${field.id}`,
          selectedFieldIds.includes(`${field.id}`)
        );
      });
    }
  }, []);

  // Handle changes when an individual item is checked or unchecked
  const handleItemChange = (event, currentFieldId) => {
    // Get the checked state of the current item
    const isCurrentItemChecked = event.target.checked;

    // Check if the DISPLAY_KEY is present in the formWatch
    if (formWatch.hasOwnProperty(DISPLAY_KEY)) {
      // Check if all items are checked
      const areAllItemsChecked = Object.keys(formWatch[DISPLAY_KEY]).every(
        (fieldId) => formWatch[DISPLAY_KEY][fieldId]
      );

      // Determine if "Select All" should be checked based on individual item changes
      const shouldCheckSelectAll = areAllItemsChecked && isCurrentItemChecked;

      // Update the state of "Select All"
      setSelectAll(shouldCheckSelectAll);
    }
  };

  //   Function to handle select all
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    // Set value for all checkboxes
    fieldItem?.fields.forEach((field) => {
      setValue(`${DISPLAY_KEY}.${field.id}`, isChecked);
    });
  };

  return (
    <div className="flex justify-between items-start f-full border-b border-slate-200 py-5">
      {/* Label */}
      <div className="basis-1/4 flex gap-3">
        <span
          className="text-secondary-500 cursor-pointer hover:text-secondary-600"
          onClick={() => onDelete(fieldItem.id)}
        >
          <BiSolidTrashAlt size={20} />
        </span>
        <span className="text-sm text-secondary-500 font-bold font-nutito leading-4 capitalize">
          {fieldItem.name}
        </span>
      </div>

      {/* fields */}
      <div className="w-[80%] flex justify-between flex-wrap gap-y-5">
        {/* Select All */}
        <div className="w-full flex items-center pb-5">
          <div className="w-[33%] ">
            <div className="flex gap-4 justify-start items-start cursor-pointer">
              <Checkbox
                label="Select All"
                id={`${fieldItem.name}_select_all`}
                onChange={handleSelectAll}
                checked={selectAll}
              />
            </div>
          </div>
        </div>
        {/* End Select All */}

        {/* item in props */}
        {fieldItem.fields &&
          fieldItem.fields?.map((item, index) => (
            <div className="w-[33%]" key={index}>
              <div className="flex gap-4 justify-start items-start cursor-pointer ">
                <Controller
                  name={`${DISPLAY_KEY}.${item.id}`}
                  control={control}
                  defaultValue={false}
                  render={({
                    field: { ref, value, onChange, onBlur, ...props },
                  }) => {
                    return (
                      <Checkbox
                        {...props}
                        label={item.name}
                        id={`${DISPLAY_KEY}.${item.id}`}
                        checked={value}
                        onChange={(e) => {
                          onChange(e);
                          handleItemChange(e, item.id);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
