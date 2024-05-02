import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FiPlusCircle } from "react-icons/fi";
import { FaListCheck } from "react-icons/fa6";
import { IoCalendarNumber } from "react-icons/io5";
import { FaBalanceScale } from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import { BiCalendarCheck } from "react-icons/bi";
import { MdChecklist } from "react-icons/md";

import { cn, decodeToken } from "@/shared/utils";
import { useFetch } from "@/shared/hooks/use-fetch";

import { TIME_OFF, TEAM_MANAGEMENT } from "../constanst/leave-constants";

export const LeaveSidebar = () => {
  // Decode token & get user permissions
  const tokenData = decodeToken();
  const { sub: email } = tokenData;

  const { pathname, search } = useLocation();
  const fullPathSearch = `${pathname}${search}`;

  const { isFetching, data: roles } = useFetch(
    `/leave/user-roles?email=${email}`
  );

  let isManager = roles?.find((role) => role.RoleName === "Manager");

  let sidebarItems = [
    {
      name: "My Time-Off",
      items: [
        {
          id: "my-list-view",
          name: "List View",
          path: `/leave?category=${TIME_OFF}&viewType=listView&mode=my`,
          icon: <MdChecklist />,
        },
        {
          id: "my-calendar-view",
          name: "Calendar View",
          path: `/leave?category=${TIME_OFF}&viewType=calendarView&mode=my`,
          icon: <BiCalendarCheck />,
        },
      ],
    },
    {
      name: "Current Time-Off",
      items: [
        {
          id: "current-list-view",
          name: "List View",
          path: `/leave?category=${TIME_OFF}&viewType=listView&mode=all`,
          icon: <FaListCheck />,
        },
        {
          id: "current-calendar-view",
          name: "Calendar View",
          path: `/leave?category=${TIME_OFF}&viewType=calendarView&mode=all`,
          icon: <IoCalendarNumber />,
        },
      ],
    },
  ];

  if (isManager) {
    sidebarItems.push({
      name: "Team Management",
      items: [
        {
          id: "time-off-approve",
          name: "Time-Off For My Approve",
          path: `/leave?category=${TEAM_MANAGEMENT}&name=timeOffMyApprove`,
          icon: <MdAppRegistration />,
        },
        {
          id: "time-off-balances",
          name: "Time-Off Balances",
          path: `/leave?category=${TEAM_MANAGEMENT}&name=TimeOffBalance`,
          icon: <FaBalanceScale />,
        },
      ],
    });
  }

  return (
    <section className="duration-300 basis-1/4 2xl:basis-1/6 border-r text-secondary-500">
      {/* Button add time-off */}
      <div
        className={`w-full border-b py-3 flex justify-center duration-500 opacity-100 `}
      >
        <Link
          to={import.meta.env.VITE_REQUEST_TIMEOFF_URL}
          target="_blank"
          className="btn-primary px-8 py-1.5 flex justify-center items-center gap-2 "
        >
          <FiPlusCircle size={21} />
          Add New
        </Link>
      </div>

      {/* Sidebar menus */}
      <div className="flex flex-col gap-y-2 mt-2 pr-2 duration-500 opacity-100">
        {!isFetching ? (
          sidebarItems.map((category) => (
            <div key={category.name}>
              <h2 className="text-md font-extrabold py-2 select-none">
                {category.name}
              </h2>
              <div className="flex flex-col gap-2">
                {category.items?.map((item) => (
                  <Link
                    key={item.id}
                    className={cn(
                      "flex justify-start items-center  gap-2  select-none py-2 px-5 rounded-2xl text-sm cursor-pointer duration-300 text-secondary-500",
                      fullPathSearch === item.path
                        ? "!text-light  bg-primary-500"
                        : " hover:bg-primary-100"
                    )}
                    to={item.path}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="  rounded-md max-w-sm w-full h-[20rem] ">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-5 bg-slate-200 rounded" />
                <div className="h-5 bg-slate-200 rounded" />
                <div className="h-5 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
