import React from "react";
import { cn } from "@/shared/utils";
import { ButtonTooltip } from "@/shared/components/ui/button-tooltip";
import { MdEdit } from "react-icons/md";

export const UserRoleTable = ({ rows, cols, onDelete, onEditing }) => {
  return (
    <div className="min-h-[25rem]">
      <table className="w-full ">
        <thead className="w-full">
          <tr className="border-b w-full">
            {/* # */}
            <th className="py-5 text-left text-secondary-500 text-sm">#</th>

            {/* Col item */}
            {cols?.map((col) => (
              <th
                key={col.id}
                className="py-5 text-left text-secondary-500 text-sm"
              >
                {col.name}
              </th>
            ))}

            {/* Col actions */}
            <th className="py-5 text-left text-secondary-500 text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr
              className="border-b hover:bg-secondary-100 duration-300 text-secondary-500"
              key={`${row.id}_${index}`}
            >
              <td>
                <span className="text-sm">{index + 1}</span>
              </td>
              {cols?.map((col) => (
                <td key={`${row.id}_${col.id}`} className="py-3">
                  {col.accessor === "status" ? (
                    <span
                      className={cn(
                        "border-none select-none px-3 py-1 rounded-2xl text-sm",
                        row?.[col.accessor] === 1
                          ? "bg-green-200 text-green-500"
                          : "bg-red-200 text-red-500"
                      )}
                    >
                      {row?.[col.accessor] === 1 ? "Active" : "InActive"}
                    </span>
                  ) : (
                    <span className="text-sm">{row?.[col.accessor]}</span>
                  )}
                </td>
              ))}
              <td className="">
                <div className="flex justify-start items-center gap-2">
                  <ButtonTooltip
                    tooltip={{ message: "Edit", position: "right" }}
                    onClick={() => onEditing(row.id)}
                  >
                    <MdEdit />
                  </ButtonTooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
