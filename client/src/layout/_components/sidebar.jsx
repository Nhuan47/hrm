import React, { useEffect, useState } from "react";

import { cn } from "@/shared/utils";
import { SIDEBAR_TOGGLE } from "@/shared/constants";

import { UserInfo } from "./user-info";
import { SidebarMenu } from "./sidebar-menu";
import { ToggleButton } from "./toggle-button";

export const Sidebar = () => {
  // variables

  // State logic
  const isActiveSidebar =
    localStorage.getItem(SIDEBAR_TOGGLE) === "yes" || false;

  const [isActive, setIsActive] = useState(isActiveSidebar);

  const onToggle = () => {
    setIsActive((prev) => {
      const activeStatus = !prev;
      localStorage.setItem(SIDEBAR_TOGGLE, activeStatus ? "yes" : "no");
      return activeStatus;
    });
  };

  return (
    <div className="bg-primary-500 bg-gradient-to-b from-primary-400 border-none rounded-br-[46px]">
      <div
        className={cn(
          "h-screen flex flex-col gap-y-10 relative  shadow-lg bg-white rounded-r-[40px]",
          isActive ? "w-64" : "w-20"
        )}
      >
        {/* Toggle button */}
        <ToggleButton isActive={isActive} onToggle={onToggle} />

        {/* User infor  */}
        <UserInfo isActive={isActive} />

        {/* sidebar menu */}
        <SidebarMenu isActive={isActive} />
      </div>
    </div>
  );
};
