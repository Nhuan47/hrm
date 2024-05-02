import React from "react";

import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { ButtonTooltip } from "@/shared/components/ui/button-tooltip";

export const RoleTable = ({ rows, cols, onDelete, onEditing }) => {
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
                  <span className="text-sm">{row?.[col.accessor]}</span>
                </td>
              ))}
              <td className="w-36">
                <div className="flex justify-start items-center gap-3">
                  {row?.canEdit ? (
                    <ButtonTooltip
                      tooltip={{
                        message: "Edit",
                        position: "left",
                        className: "w-12",
                      }}
                      onClick={() => onEditing(row.id)}
                    >
                      <MdEdit />
                    </ButtonTooltip>
                  ) : null}

                  {row?.canDelete ? (
                    <ButtonTooltip
                      tooltip={{ message: "Delete", position: "right" }}
                      onClick={() => onDelete(row.id)}
                    >
                      <FaTrash />
                    </ButtonTooltip>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
