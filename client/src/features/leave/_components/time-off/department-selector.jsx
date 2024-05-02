import { memo } from "react";
import { Label } from "@/shared/components/ui/label";
import { ReactSelect } from "@/shared/components/ui/select";

import { useFetch } from "@/shared/hooks/use-fetch";
import { SELECT_ALL_ITEMS } from "../../constanst/leave-constants";
import { TbReload } from "react-icons/tb";

export const DepartmentSelector = memo(({ onDepartmentChange, idSelected }) => {
  const { isFetching, data } = useFetch("/leave/departments");

  const departments =
    data?.map((item) => ({
      label: item.Value,
      value: item.Id,
    })) || [];

  return (
    <div className="flex justify-start items-center py-5">
      <div className="z-10 flex justify-center items-center gap-2">
        <Label className="text-sm text-secondary-500">Department:</Label>
        {!isFetching ? (
          <ReactSelect
            options={[SELECT_ALL_ITEMS, ...departments]}
            onChange={onDepartmentChange}
            defaultValue={departments?.find(
              (item) => item.value === +idSelected
            )}
            className="px-2 rounded-md min-w-[10rem]"
          />
        ) : (
          <div className="border rounded-md   min-w-[10rem] py-1.5 px-2 flex justify-between items-center text-secondary-600">
            <span className="animate-pulse text-sm">Loading ...</span>
            <TbReload size={15} className="duration-200 animate-spin " />
          </div>
        )}
      </div>
    </div>
  );
});
