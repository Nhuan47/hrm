import React from "react";

import { cn } from "@/shared/utils";

import { Button } from "./button";
import { Tooltip } from "../tooltip";

export const ButtonTooltip = ({ children, tooltip, className, ...props }) => {
  return (
    <Tooltip {...tooltip}>
      <Button
        className={cn(
          "border-none hover:text-primary-500 hover:scale-125 duration-300 ",
          className
        )}
        {...props}
        isPadding={false}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
