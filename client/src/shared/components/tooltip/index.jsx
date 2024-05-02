import React from "react";
import { cn } from "@/shared/utils";

export const Tooltip = ({
  children,
  message,
  className,
  position = "left",
}) => {
  return (
    <span className={cn("group relative flex items-center justify-center ")}>
      {children}
      <div
        className={cn(
          "absolute transition-all duration-300 scale-0 bg-secondary-500 border-secondary-500 text-white p-1.5 rounded-sm shadow-md text-center text-xs group-hover:scale-100 ",
          position === "left" &&
            " right-full mr-3 after:content-[''] after:absolute after:border-[7px] after:top-[50%] after:-translate-y-[50%] after:-right-[14px]  after:border-transparent after:border-l-inherit",
          position === "right" &&
            " left-full ml-3 after:content-[''] after:absolute after:border-[7px] after:top-[50%] after:-translate-y-[50%] after:-left-[14px]  after:border-transparent after:border-r-inherit",
          position === "top" &&
            " bottom-full mb-3 right-[50%] translate-x-[50%]  after:content-[''] after:absolute after:border-[7px] after:right-[50%] after:translate-x-[50%] after:-bottom-[14px]  after:border-transparent after:border-t-inherit",
          position === "bottom" &&
            " top-full mt-3 right-[50%] translate-x-[50%]  after:content-[''] after:absolute after:border-[7px] after:right-[50%] after:translate-x-[50%] after:-top-[14px]  after:border-transparent after:border-b-inherit",
          className
        )}
      >
        {message}
      </div>
    </span>
  );
};
