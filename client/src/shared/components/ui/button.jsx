import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/shared/utils";

export const Button = React.forwardRef(
  (
    {
      isPadding = true,
      icon: Icon,
      iconPos = null,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "rounded-3xl flex justify-center items-center gap-2  border capitalize text-sm font-nunito hover:scale-[1.02] transition-all duration-500",
          isPadding ? "px-8 py-2" : "",
          props?.disabled && "cursor-not-allowed opacity-80",
          className
        )}
      >
        {iconPos === "left" && Icon && Icon} {children}
        {iconPos === "right" && Icon && Icon}
      </button>
    );
  }
);

// Button.displayName = "Button";

// Button.propTypes = {
//   isPadding: PropTypes.bool,
//   children: PropTypes.node,
//   className: PropTypes.string,
//   icon: PropTypes.node,
//   iconPos: PropTypes.node,
// };
