import React, { useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

import { cn } from "@/shared/utils";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";

export const TableMenu = ({
  isOpenMenu,
  setIsOpenMenu,
  selectedItems,
  onSelectAll,
  onDeSelectAll,
  onDelete,
  rows,
}) => {
  const menuRef = useRef();

  // hooks
  useOutsideClick(menuRef, () => {
    setIsOpenMenu(false);
  });

  return (
    <div ref={menuRef} className="cursor-pointer relative">
      {/* Start three dot button */}
      <div
        className={cn(
          "text-xs",
          selectedItems?.length > 0 ? "text-primary-500" : "text-secondary-500"
        )}
        onClick={() => setIsOpenMenu((prev) => !prev)}
      >
        <BsThreeDots size={20} />
      </div>
      {/* End three dot button */}

      {/* Supervisor Menu */}
      {rows && rows?.length > 0 && (
        <div
          className={cn(
            "absolute top-full bg-light border rounded-sm duration-300 w-32",
            isOpenMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Start select all option */}
          {rows.length > 0 && rows.length !== selectedItems.length && (
            <p
              className="py-4 px-5 text-xs text-secondary-500 hover:bg-secondary-100 duration-300"
              onClick={onSelectAll}
            >
              Select All
            </p>
          )}
          {/* End select all option */}

          {/* Start deselect all options */}
          {rows.length > 0 && selectedItems.length > 0 && (
            <p
              className="py-4 px-5 text-xs text-secondary-500 hover:bg-secondary-100 duration-300"
              onClick={onDeSelectAll}
            >
              Deselect All
            </p>
          )}
          {/* End deselect all options */}

          {/* Delete selected option */}
          {selectedItems.length > 0 && (
            <p
              className="py-4 px-5 text-xs text-secondary-500 hover-bg-secondary-100 duration-300"
              onClick={onDelete}
            >
              Delete Selected
            </p>
          )}
        </div>
      )}
    </div>
  );
};
