import React, { forwardRef, useState } from "react";
import { cn } from "@/shared/utils";

export const Switch = forwardRef(
  ({ onChange, value, id, className, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(value || false);

    const handleToggle = () => {
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);
      onChange && onChange(newCheckedState);
    };

    return (
      <div
        className={cn(
          "relative inline-block w-10 select-none rounded-2xl border",
          isChecked ? "border-primary-500" : "",
          className
        )}
      >
        <input
          {...props}
          {...ref}
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="w-full h-full cursor-pointer opacity-0"
          id={id}
        />
        <label
          htmlFor={id}
          className={cn(
            " absolute top-[3px] left-1  h-[15px] w-[15px] rounded-full duration-300 transition-all cursor-pointer",
            isChecked ? "translate-x-4 bg-primary-500" : "bg-secondary-300"
          )}
        ></label>
      </div>
    );
  }
);
