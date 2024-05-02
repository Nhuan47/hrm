import React, { forwardRef } from "react";
import { cn } from "@/shared/utils";

export const TextArea = forwardRef(
  (
    {
      id,
      label,
      labelDetail,
      labelClassName,
      error,
      rows = 4,
      fullWidth,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(fullWidth && "w-full")}>
        {label && (
          <label htmlFor={id} className={`${labelClassName}`}>
            {label} {props.required && <span className="text-red-500">*</span>}
            {labelDetail && (
              <small className="text-xs normal-case font-normal">
                {labelDetail}
              </small>
            )}
          </label>
        )}

        <div>
          <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={`${props.className}`}
          />
        </div>
      </div>
    );
  }
);
