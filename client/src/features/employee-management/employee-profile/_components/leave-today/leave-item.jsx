import React from "react";
import { LeaveAvatar } from "./leave-avatar";

export const LeaveItem = ({ item }) => {
  return (
    <div className="flex space-x-4 items-center">
      <LeaveAvatar />

      <div className="text-xs text-secondary-500">
        <p className="text-secondary-600 font-semibold capitalize">
          {item?.RequesterName} - {item?.DepartmentName}
        </p>
        <p>{item?.TypeName}</p>
        <p>
          {item?.Hours}
          {item?.StartTime ? ` - Start time: ${item?.StartTime}` : ""}
        </p>
      </div>
    </div>
  );
};
