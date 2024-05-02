import { forwardRef } from "react";

import { cn } from "@/shared/utils";

export const Checkbox = forwardRef(({ label, id, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex items-center justify-start py-1 gap-2 text-sm select-none",
        props?.disabled && "cursor-not-allowed"
      )}
    >
      <input
        className="w-4 h-4 p-2 accent-orange-600"
        type="checkbox"
        id={id}
        {...props}
        ref={ref}
      />

      {label && (
        <label htmlFor={id} className="text-secondary-600 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
});

export default Checkbox;
