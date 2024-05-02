import React, { useRef, useState } from "react";

import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { TbTrashX } from "react-icons/tb";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";

import { TableMenu } from "./table-menu";
import { useTableAction } from "../_hooks/use-table-action";

export const Table = ({ rows, cols }) => {
  // Custom hooks
  const {
    isOpenMenu,
    setIsOpenMenu,
    selectedItems,
    onSelectAll,
    onDeSelectAll,
    onDelete,
    onCheckBoxChange,
  } = useTableAction({ rows });

  return (
    <table className="w-full">
      <thead className="w-full">
        <tr className="border-b w-full">
          {/* Three dot menu-actions */}
          <th className={"py-2 text-left w-[10%]"}>
            <TableMenu
              isOpenMenu={isOpenMenu}
              setIsOpenMenu={setIsOpenMenu}
              selectedItems={selectedItems}
              onSelectAll={onSelectAll}
              onDeSelectAll={onDeSelectAll}
              onDelete={onDelete}
              rows={rows}
            />
          </th>

          {cols?.map((col) => (
            <th key={col.acessor} className="py-2 text-left w-[40%] text-xs">
              <span className="capitalize text-secondary-600">{col.name}</span>
            </th>
          ))}

          {/* col actions */}
          <th></th>
          {/* End col action */}
        </tr>
      </thead>

      <tbody>
        {rows &&
          rows?.map((row) => {
            const isChecked = selectedItems.includes(row.id);
            return (
              <tr
                key={row.id}
                className="border-b hover:bg-secondary-100 text-sm text-secondary-500"
              >
                <td className="py-2.5 text-left w-[10%]">
                  <Checkbox
                    onChange={(e) => onCheckBoxChange(row.id, e.target.checked)}
                    name={row.id}
                    id={row.id}
                    checked={isChecked}
                  />
                </td>

                {cols?.map((col, i) => (
                  <td
                    key={`${row.id}_${i} `}
                    className="py-2.5 text-left w-[40%]"
                  >
                    <span className="cursor-pointer">
                      {row?.[col.accessor]}
                    </span>
                  </td>
                ))}

                <td className="py-2.5 flex justify-center items-center text-secondary-500 w-[10%]">
                  <Button
                    isPadding={false}
                    className="border-none outline-none hover:bg-secondary-200 p-2 duration-300"
                    onClick={() => onEdit(row.id)}
                  >
                    <MdOutlineEdit size={21} />
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
