import React from "react";
import { MdModeEdit } from "react-icons/md";

import { ButtonTooltip } from "@/shared/components/ui/button-tooltip";
import { DropIndicator } from "./drop-indicator";
import { FaTrash } from "react-icons/fa";

export const Card = ({
  item,
  column,
  onEditing,
  onDelete,
  handleDragStart,
}) => {
  return (
    <>
      <DropIndicator beforeId={item?.id} column={column} />
      <div
        draggable="true"
        onDragStart={(e) => handleDragStart(e, item)}
        className="border p-2 hover:bg-secondary-100 duration-200 text-sm cursor-pointer flex justify-between text-secondary-500"
      >
        <span>{item?.name}</span>

        <div className="flex justify-center items-center gap-2">
          {onEditing && (
            <ButtonTooltip
              tooltip={{ message: "Edit", className: "w-10" }}
              onClick={() => onEditing(item)}
            >
              <MdModeEdit />
            </ButtonTooltip>
          )}

          {onDelete && (
            <ButtonTooltip
              tooltip={{ message: "Delete", className: "w-15" }}
              onClick={() => onDelete(item)}
            >
              <FaTrash size={12} />
            </ButtonTooltip>
          )}
        </div>
      </div>
    </>
  );
};
