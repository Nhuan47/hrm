import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";

import { Loading } from "@/shared/components/loading-overlay";
import { usePermissions } from "@/shared/hooks/use-permission";
import { LoadingLocal } from "@/shared/components/loading-local";
import { cn } from "@/shared/utils";
import { featureKeys } from "@/shared/permission-key";

import { AddNewButton } from "./btn-add-new";
import { numberWithCommas } from "../../utils/salary-utils";
import { useSalaryActions } from "../../hooks/use-salary-actions";
import { useFetchSalaryHistory } from "../../hooks/use-fetch-salary-history";
import { DeleteButton } from "./btn-delete";

export const SalaryTable = () => {
  const { isReadable, isUpdateable, isCreateable, isDeleteable } =
    usePermissions(featureKeys.EMPLOYEE_SALARY);

  if (isReadable) {
    // Custom hooks
    const { isLoading: isFetching } = useFetchSalaryHistory();

    const { onDelete, onSelect, isLoading } = useSalaryActions();

    // redux store
    const rows = useSelector((state) => state.salary.salaries);
    const cols = useSelector((state) => state.salary.fields);
    const idEditing = useSelector((state) => state.salary.currentIdEditing);

    if (isFetching) return <LoadingLocal onOpen={isLoading} />;

    return (
      <>
        <table border={1} className="w-full select-none">
          <thead className="border-b border-t bg-secondary-100 rounded-sm">
            <tr>
              {cols?.length ? (
                <th className="py-3 text-sm text-secondary-500 text-left min-w-[100px] ">
                  Month/Year
                </th>
              ) : null}

              {cols?.map((col) => (
                <th
                  key={col.id}
                  className="py-3 text-sm text-secondary-500 text-left px-2"
                >
                  {col.name}
                </th>
              ))}

              {isDeleteable && <th className="w-24 text-right"></th>}
            </tr>
          </thead>

          <tbody className="text-secondary-500 text-sm">
            {rows?.map((row) => (
              <tr
                className={cn(
                  "border-t hover:bg-secondary-100 duration-300",
                  isUpdateable &&
                    idEditing === row.id &&
                    "bg-secondary-100 font-bold"
                )}
                key={row.id}
              >
                <td
                  className={cn(
                    "py-3 px-1 ",
                    isUpdateable &&
                      "cursor-pointer text-primary-500 font-semibold scale-100 hover:scale-105 transform transition duration-300 "
                  )}
                >
                  <span
                    onClick={() => {
                      if (isUpdateable) {
                        onSelect(row.id);
                      }
                    }}
                  >
                    {row.salaryName}
                  </span>
                </td>

                {cols?.map((col) => (
                  <td key={`${row.id}__${col.id}`} className="py-3 px-2">
                    {col.accessor === "name"
                      ? row[col.accessor]
                      : numberWithCommas(row[col.accessor])}
                  </td>
                ))}

                {/* Button delete */}
                {isDeleteable && (
                  <td className="flex justify-center items-center py-3">
                    <DeleteButton onDelete={onDelete} row={row} />
                  </td>
                )}
              </tr>
            ))}

            {/* Button add new */}
            {isCreateable && (
              <tr className="border-t">
                <td colSpan={cols?.length + 1}></td>
                <td className="flex justify-center items-center py-2">
                  <AddNewButton onSelect={onSelect} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Loading isOpen={isLoading} />
      </>
    );
  }
};
