import React from "react";

import { CiSettings } from "react-icons/ci";
import { IoIosAnalytics } from "react-icons/io";
import { PiUsersThreeLight } from "react-icons/pi";
import { MdOutlineManageHistory } from "react-icons/md";
import { AiFillCarryOut, AiOutlineFieldTime } from "react-icons/ai";

import { typeKeys } from "@/shared/permission-key";
import { usePermissions } from "@/shared/hooks/use-permission";
import { decodeToken } from "@/shared/utils";
import { SidebarItem } from "./sidebar-item";
import { featureKeys } from "../../shared/permission-key";

export const SidebarMenu = ({ isActive }) => {
  const userInfo = decodeToken();

  const master = userInfo?.roles?.find(
    (role) => role.accessor === typeKeys.MASTER
  );

  let isHasRole = false;
  if (!master) {
    const admin = userInfo?.roles?.find(
      (role) => role.accessor === typeKeys.ADMIN
    );

    if (admin) {
      const { isReadable } = usePermissions(featureKeys.SYSTEM_USERS);
      if (isReadable) {
        isHasRole = true;
      }
    }
  }

  const isRoleAccessEmployeeList = userInfo?.roles?.find(
    (role) =>
      role.accessor === typeKeys.MASTER ||
      role.accessor === typeKeys.ADMIN ||
      role.accessor === typeKeys.SUPERVISOR
  );

  const sidebarMenus = [
    {
      name: "Employee Management",
      link: isRoleAccessEmployeeList
        ? "/employee/list"
        : `/employee/${userInfo?.user_id}/profile`,
      parent: "/employee",
      icon: PiUsersThreeLight,
    },
    {
      name: "Reports and Analytics",
      link: "/report-and-analytics/catalogue",
      parent: "/report-and-analytics",
      icon: IoIosAnalytics,
    },
    {
      name: "Leave",
      link: "/leave?category=timeOff&viewType=listView&mode=my",
      icon: AiFillCarryOut,
      parent: "/leave",
    },
    {
      name: "Recruitment",
      link: "/recruitment",
      parent: "/recruitment",
      icon: MdOutlineManageHistory,
    },
    {
      name: "Performance",
      link: "/performance",
      parent: "/performance",
      icon: AiOutlineFieldTime,
    },
  ];
  if (master || isHasRole) {
    sidebarMenus.push({
      name: "Setting",
      link: "/setting/user-roles",
      icon: CiSettings,
      parent: "/setting",
    });
  }
  return (
    <div className="sideBar-menu overflow-hidden pb-5">
      {sidebarMenus.map((menuItem, index) => (
        <SidebarItem
          key={menuItem.link}
          index={index}
          item={menuItem}
          isActive={isActive}
        />
      ))}
    </div>
  );
};
