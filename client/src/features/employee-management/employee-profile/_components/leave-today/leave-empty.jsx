import React from "react";
import { iconItemEmpty } from "@/assets/images";

export const LeaveEmpty = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <img
          src={iconItemEmpty}
          className="w-48 h-auto object-cover"
          alt="Empty items"
        />
        <p className="text-xs">There are no employee leaves today</p>
      </div>
    </div>
  );
};
