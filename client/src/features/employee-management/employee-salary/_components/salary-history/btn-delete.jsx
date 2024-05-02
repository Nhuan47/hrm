import React from "react";
import { FaTrash } from "react-icons/fa";

import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/tooltip";

export const DeleteButton = ({ onDelete, row }) => {
  return (
    <div>
      <Tooltip message="Delete" position="right">
        <Button
          className="p-1.5 border-none rounded-full hover:text-primary-500 duration-300 cursor-pointer inline-block scale-100 hover:scale-125 transform transition"
          onClick={() => onDelete(row)}
        >
          <FaTrash size={14} />
        </Button>
      </Tooltip>
    </div>
  );
};
