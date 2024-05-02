import { forwardRef } from "react";

import { cn } from "@/shared/utils";

export const Input = forwardRef(({ ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type={props?.type || "text"}
      className={cn("", props.className)}
    />
  );
});
