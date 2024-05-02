import React from "react";

import { LoadingReload } from "@/shared/components/loading-reload";

import { isFloat } from "../utils/leave-utils";

export const Table = ({ cols, rows, startIndex, isLoading }) => {
  return (
    <>
      <table className="w-full text-secondary-600">
        <thead>
          <tr className="border-t border-b text-sm text-left  rounded-md">
            <th className="py-3 px-2">#</th>
            {cols.map((col) => (
              <th key={col.accessor} className="py-3 px-2 ">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!isLoading ? (
            rows?.map((row, index) => (
              <tr
                className="border-b hover:bg-secondary-200/60 duration-300 transition select-none"
                key={row.Id}
              >
                <td className="py-2 px-2 text-sm">{startIndex + index + 1}</td>
                {cols.map((col) => (
                  <td
                    key={`${index}__${col.accessor}`}
                    className="py-2 px-2 text-sm"
                  >
                    {col.accessor === "WorkDays"
                      ? isFloat(row[col.accessor])
                        ? `${parseFloat(row[col.accessor]).toFixed(2)} (${
                            row["Hours"]
                          })`
                        : `${row[col.accessor]} (${row["Hours"]})`
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="">
              <td colSpan={cols.length + 1}>
                <LoadingReload />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
