import React, { forwardRef } from "react";
import { cn } from "@/shared/utils";

export const TextArea = forwardRef(
  ({ error, rows = 4, fullWidth, ...props }, ref) => {
    return (
      <>
        <textarea
          {...props}
          ref={ref}
          rows={rows}
          className={cn(props?.className)}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </>
    );
  }
);
