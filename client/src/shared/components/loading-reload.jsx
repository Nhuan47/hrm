import React from "react";
import { IoReload } from "react-icons/io5";

export const LoadingReload = () => {
  return (
    <div className=" h-full min-h-[10rem] flex justify-center items-center rounded-sm">
      <div className="flex flex-col items-center justify-center gap-y-2">
        <IoReload className="animate-spin text-secondary-500 " size={25} />
      </div>
    </div>
  );
};
