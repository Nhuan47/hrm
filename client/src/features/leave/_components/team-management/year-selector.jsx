import { memo } from "react";
import { Label } from "@/shared/components/ui/label";
import { ReactSelect } from "@/shared/components/ui/select";

import { useFetchDepartment } from "../../_hooks/use-fetch-department";
import { SELECT_ALL_ITEMS } from "../../constanst/leave-constants";
import { TbReload } from "react-icons/tb";
import { getYears } from "../../utils/leave-utils";

const listYears = getYears()?.map((year) => ({ label: year, value: year }));

export const YearSelector = memo(({ onYearChange, yearSelected }) => {
  return (
    <div className="flex justify-start items-center py-5">
      <div className="z-10 flex justify-center items-center gap-2">
        <Label className="text-sm text-secondary-500">Year:</Label>
        <ReactSelect
          options={listYears}
          onChange={onYearChange}
          defaultValue={listYears?.find((item) => item.value === yearSelected)}
          className="px-2 rounded-md min-w-[10rem]"
        />
      </div>
    </div>
  );
});
