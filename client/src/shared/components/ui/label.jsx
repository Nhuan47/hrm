import React, { forwardRef } from "react";

import { cn } from "@/shared/utils";

export const Label = forwardRef(({ children, ...props }, ref) => {
  return (
    <label
      {...props}
      className={cn("text-sm text-secondary-500 capitalize", props?.className)}
    >
      {children}
    </label>
  );
});
