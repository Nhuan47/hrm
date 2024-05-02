import React from "react";
import { FiPlus } from "react-icons/fi";

import { ButtonTooltip } from "@/shared/components/ui/button-tooltip";

export const ButtonAddNew = ({ onClick, tooltip }) => {
  return (
    <div className="mt-1.5 rounded-sm  flex justify-end items-center ">
      <ButtonTooltip
        tooltip={{
          message: tooltip,
          className: "w-32",
          position: "left",
        }}
        className=" p-1.5 bg-secondary-200"
        onClick={onClick}
      >
        <FiPlus />
      </ButtonTooltip>
    </div>
  );
};
