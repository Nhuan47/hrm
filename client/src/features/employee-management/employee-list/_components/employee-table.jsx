import React from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/shared/utils";
import { defaultPhoto } from "@/shared/assets/images";

// List accessor columns fix max-width = 15px
const colWidths = ["employee_code", "image_url"];

// Define avatar accessor
const avatarAccessor = "image_url";

// Define email/username columns
const enableClickCols = ["email", "full_name"];

export const EmployeeTable = ({ cols, rows }) => {
  const navigate = useNavigate();

  return (
    <table className="w-full">
      {/* table header */}
      <thead className="w-full">
        <tr className="border-b w-full">
          {/* Avatar column */}
          <th className="py-5 text-left">
            <span className="capitalize text-xs text-secondary-500">
              avatar
            </span>
          </th>

          {/* columns */}
          {cols?.map((col) => (
            <th
              key={col.id}
              className={cn(
                "py-5 text-left ",
                colWidths.includes(col.accessor) && "max-w-[15px]"
              )}
            >
              <span className="capitalize text-xs text-secondary-500">
                {col.name}
              </span>
            </th>
          ))}
        </tr>
      </thead>

      {/* Table body */}
      <tbody>
        {rows?.map((row) => (
          <tr
            key={row.id}
            className="border-b hover:bg-secondary-100 duration-300"
          >
            {/* Avatar */}
            <td className="py-2.5 text-left">
              <div className="w-10 h-10  bg-secondary-500 rounded-full select-none overflow-hidden">
                <img
                  src={
                    row.avatar
                      ? `${import.meta.env.VITE_API_ENDPOINT}${row.avatar}`
                      : defaultPhoto
                  }
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            </td>

            {/* Other columns */}
            {cols.map((col) => (
              <td key={`${row.id}__${col.id}`} className="py-2.5 text-left">
                {/* handle column is type images  */}
                {col.accessor === avatarAccessor ? (
                  <div className="w-10 h-10  bg-secondary-500 rounded-full select-none overflow-hidden">
                    <img
                      src={
                        row[col.accessor]
                          ? `${import.meta.env.VITE_API_ENDPOINT}${
                              row[col.accessor]
                            }`
                          : defaultPhoto
                      }
                      alt="Avatar"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  // text row
                  <span
                    className={cn(
                      "text-xs font-nutito text-secondary-500 py-2",
                      enableClickCols.includes(col.accessor) && "cursor-pointer"
                    )}
                    onClick={() => {
                      enableClickCols.includes(col.accessor)
                        ? navigate(`/employee/${row.id}/profile`)
                        : null;
                    }}
                  >
                    {row[col.accessor]}
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
