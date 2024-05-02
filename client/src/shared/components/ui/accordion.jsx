import React, { useState, useRef, forwardRef, useEffect } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";

import { cn } from "@/shared/utils";
import { Checkbox } from "@/shared/components/ui/checkbox";

export const AccordionContent = forwardRef(({ children }, ref) => {
  return (
    <div className="border-t p-2 hover:bg-secondary-100 duration-300" ref={ref}>
      {children}
    </div>
  );
});

export const AccordionItem = forwardRef(
  ({ children, title, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(true);

    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
      setIsChecked(props.checked);
    }, [props.checked]);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    const handleChange = (e) => {
      props.onChange(e);
      setIsChecked(e.target.checked);
    };

    return (
      <div className={cn("border overflow-hidden ")}>
        <div
          className={cn(
            "cursor-pointer flex justify-between items-center text-secondary-500 duration-300 p-2",
            props?.className
          )}
        >
          {/* Checkbox & label */}
          <Checkbox
            label={title}
            id={props.id}
            onChange={handleChange}
            defaultValue={false}
            checked={isChecked || false}
          />

          {/* Caret down/up */}
          <div
            className={cn(" flex-1 flex justify-end  py-1.5")}
            onClick={handleToggle}
          >
            <AiOutlineCaretDown
              className={cn("duration-300", isOpen && "rotate-180 ")}
            />
          </div>
        </div>

        <div
          className={cn(
            "grid grid-rows-[0fr] duration-300 ease-out ",
            isOpen && "grid-rows-[1fr]"
          )}
          ref={ref}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }
);

export const Accordion = forwardRef(({ children, ...props }, ref) => {
  return (
    <div {...props} {...ref}>
      {children}
    </div>
  );
});
