import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/shared/utils";

export const SidebarItem = ({ item, index, isActive }) => {
  const location = useCallback(useLocation());
  const currentURL = `/${location.pathname.split("/")[1]}`;

  return (
    <Link
      to={item.link}
      className={cn(
        "group flex items-center text-sm gap-3.5 font-medium p-3 mr-3 rounded-r-3xl",
        currentURL === item.parent || currentURL === item.link
          ? "bg-primary-500 hover:bg-primary-400 text-white"
          : "text-secondary-700 hover:bg-primary-100"
      )}
    >
      <div className={cn(isActive && "duration-500 ml-2")}>
        {React.createElement(item.icon, { size: "20" })}
      </div>
      <h2
        style={{ transitionDelay: `${index + 5}0ms` }}
        className={cn(
          "whitespace-pre duration-500 capitalize leading-5",
          !isActive && "opacity-0 translate-x-28 overflow-hidden"
        )}
      >
        {item.name}
      </h2>
      <h2
        className={cn(
          "z-50 absolute left-48 bg-white font-semibold whitespace-pre text-secondary-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit",
          isActive && "hidden"
        )}
      >
        {item.name}
      </h2>
    </Link>
  );
};
