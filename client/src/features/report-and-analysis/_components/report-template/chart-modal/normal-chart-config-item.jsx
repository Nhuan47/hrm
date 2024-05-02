import { Controller } from "react-hook-form";
import { IoIosClose } from "react-icons/io";

import { ReactSelect } from "@/shared/components/ui/select";
import { GROUP_KEY } from "@/shared/constants";

export const ChartConfigItem = ({
  id,
  value,
  control,
  errors,
  fields,
  watchGroupField,
  handleRemoveItemClick,
}) => {
  const fieldValue = fields.find((field) => field.value === value);

  return (
    <div className="group basis-1/3 py-3 px-3 relative" key={id}>
      <Controller
        name={`${GROUP_KEY}.${id}`}
        control={control}
        defaultValue={fieldValue || undefined}
        render={({ field: { ref, ...props } }) => {
          const fieldSelected = Object.values(watchGroupField)?.map(
            (item) => item?.value
          );
          const customField = fields.filter(
            (field) => !fieldSelected.includes(field.value)
          );

          return (
            <ReactSelect
              inputRef={ref}
              {...props}
              label={`Group by`}
              labelClassName="text-sm text-secondary-500 font-semibold"
              className="rounded-xl p-2"
              options={customField}
              error={errors[GROUP_KEY]?.[id]?.message}
            />
          );
        }}
      />

      {watchGroupField?.[id] !== undefined && (
        <span
          onClick={() => handleRemoveItemClick(id)}
          className="absolute top-1 right-3 hidden group-hover:block duration-300 bg-secondary-200 p-0.5 rounded-full text-light hover:bg-secondary-400 cursor-pointer"
        >
          <IoIosClose />
        </span>
      )}
    </div>
  );
};
