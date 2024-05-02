import React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/shared/utils";

export const NavItem = ({
  label,
  icon: Icon,
  url = "",
  onClick = () => {},
  isActive,
}) => {
  return (
    <Link
      to={url}
      className={cn(
        "flex justify-center items-center group dashboard home py-2 px-4 rounded-xl text-xs bg-secondary-100 text-secondary-500 hover:bg-primary-100 hover:text-primary-500 duration-300",
        (isActive || url === "#") && "bg-primary-100 text-primary-500"
      )}
      onClick={onClick}
    >
      <span className="inline-block capitalize">
        {Icon}
        {label}
      </span>
    </Link>
  );
};
