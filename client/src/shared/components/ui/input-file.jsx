import React, { forwardRef } from "react";

const InputFile = forwardRef(
  (
    {
      id,
      type = "file",
      label,
      labelDetail,
      labelClassName,
      error,
      defaultValue,
      fullWidth,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
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

        <div
          className={`border border-slate-300 p-1 rounded-xl min-w-[20rem] ${props.className}`}
        >
          <label htmlFor={id}>
            <input
              ref={ref}
              id={id}
              type={type}
              className={`w-full h-full cursor-pointer outline-none border-none text-sm text-secondary-500
            file:mr-5 file:py-2 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:font-medium
            file:bg-secondary-100 file:text-primary-500
            hover:file:cursor-pointer 
            hover:file:bg-secondary-200
            hover:file:text-primary-600
            duration-300`}
            />
          </label>
        </div>
      </div>
    );
  }
);

export { InputFile };
