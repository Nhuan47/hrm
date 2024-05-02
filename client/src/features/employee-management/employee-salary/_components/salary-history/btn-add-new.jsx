import React from "react";

import { HiOutlinePlus } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/tooltip";

export const AddNewButton = ({ onSelect }) => {
  return (
    <div className="flex justify-end ">
      <Tooltip message="Add new salary" position="bottom" className="w-28">
        <Button
          onClick={() => onSelect(null)}
          className="bg-primary-500  hover:bg-primary-600 text-light cursor-pointer border rounded-full p-2  duration-300 inline-block scale-100 hover:scale-110"
        >
          <HiOutlinePlus size={16} />
        </Button>
      </Tooltip>
    </div>
  );
};
