import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/tooltip";

export const ButtonAddEmployee = ({ onAddEmployee }) => {
  return (
    <div className="fixed top-28 right-8 ">
      <Tooltip message={"Add new employee"} className="w-32">
        <Button
          isPadding={false}
          className="flex items-center justify-center  p-4 rounded-full shadow-xl cursor-pointer
                 bg-primary-500 hover:bg-primary-400 text-light duration-300"
          onClick={onAddEmployee}
        >
          <AiOutlinePlus />
        </Button>
      </Tooltip>
    </div>
  );
};
