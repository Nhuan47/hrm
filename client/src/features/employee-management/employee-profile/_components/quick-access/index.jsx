import React from "react";
import { MdBolt } from "react-icons/md";

import {
  iconAssignLeave,
  iconLeaveCalendar,
  iconLeaveList,
  iconMyLeave,
} from "@/shared/assets/images";

import { Wrapper } from "../wrapper";
import { QuickItem } from "./quick-item";

const items = [
  {
    title: "my leave",
    image: iconMyLeave,
    path: "/leave?category=timeOff&viewType=listView&mode=my",
  },

  {
    title: "leave list",
    image: iconLeaveList,
    path: "/leave?category=timeOff&viewType=listView&mode=all",
  },

  {
    title: "leave calendar",
    image: iconLeaveCalendar,
    path: "/leave?category=timeOff&viewType=calendarView&mode=all",
  },
  {
    title: "time-off Balances",
    image: iconAssignLeave,
    path: "/leave?category=teamManagement&name=TimeOffBalance",
  },
];

export const QuickAccess = () => {
  return (
    <Wrapper title={"Quick Access"} icon={<MdBolt size={21} />}>
      <div className="flex justify-between items-start flex-wrap ">
        {items?.map((item) => (
          <QuickItem key={item.title} item={item} />
        ))}
      </div>
    </Wrapper>
  );
};
