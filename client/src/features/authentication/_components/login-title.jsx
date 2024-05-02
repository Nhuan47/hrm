import React from "react";
import { RiUserSharedLine } from "react-icons/ri";

export const LoginTitle = () => {
  return (
    <div className="flex gap-2 justify-start items-center w-full text-secondary-500 mt-6 select-none">
      <RiUserSharedLine size={20} />
      <h2 className="capitalize text-lg font-nutito font-bold ">Login</h2>
    </div>
  );
};
