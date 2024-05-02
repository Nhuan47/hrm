import React from "react";
import {
  APPROVED_COLOR,
  HOLIDAY_COLOR,
  PENDING_COLOR,
  TODAY_COLOR,
} from "../../constanst/leave-constants";

export const colorDetails = [
  {
    name: "Weekend",
    color: "bg-secondary-200",
  },
  {
    name: "Public holiday",
    color: HOLIDAY_COLOR,
  },
  {
    name: "Today",
    color: TODAY_COLOR,
  },
  {
    name: "Approved Time-Off",
    color: APPROVED_COLOR,
  },
  {
    name: "Pending Approval Time-Off",
    color: PENDING_COLOR,
  },
];

export const ColorList = () => {
  return (
    <div className="flex justify-start items-center pb-5 gap-5 text-sm text-secondary-500">
      {colorDetails.map((item) => (
        <div key={item.name} className="flex justify-center items-center gap-2">
          <div
            className={`w-6 h-6  border border-secondary-200 shadow-md ${item.color}`}
          />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};
