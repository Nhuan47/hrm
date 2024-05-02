import React from "react";
import { MdTimeline } from "react-icons/md";

export const LeaveHeader = () => {
  return (
    <header className="pb-4 flex justify-between items-center">
      {/* Icon  */}
      <div className="flex justify-between items-center gap-3">
        <span>
          <MdTimeline size={21} />
        </span>
        <h1 className="text-md">Leave</h1>
      </div>
    </header>
  );
};
