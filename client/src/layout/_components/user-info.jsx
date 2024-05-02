import React from "react";
import { Link } from "react-router-dom";

import { cn, decodeToken } from "@/shared/utils";
import { Tooltip } from "@/shared/components/tooltip";

import { defaultPhoto } from "@/shared/assets/images";
import { typeKeys } from "../../shared/permission-key";

export const UserInfo = ({ isActive }) => {
  const userInfo = decodeToken();

  let roleName;
  const superRole = userInfo?.roles?.find(
    (role) => role.accessor !== typeKeys.ESS
  );
  if (superRole) {
    roleName = superRole?.name;
  } else {
    const essRole = userInfo?.roles?.find(
      (role) => role.accessor === typeKeys.ESS
    );
    if (essRole) {
      roleName = superRole?.name;
    } else {
      roleName = "NA";
    }
  }

  return (
    <div className="sideBar-header flex justify-center mt-10">
      <div className={`flex flex-col items-center gap-3  `}>
        <div
          className={cn(
            "shadow-lg bg-light duration-500 p-2 rounded-full",
            isActive ? "w-24 h-24" : "w-10 h-10"
          )}
        >
          <div className="rounded-full w-full h-full overflow-hidden ">
            <img
              src={
                userInfo && userInfo?.avatar
                  ? `${import.meta.env.VITE_API_ENDPOINT}${userInfo?.avatar}`
                  : defaultPhoto
              }
              className="w-full h-full object-cover "
            />
          </div>
        </div>
        <div
          className={cn(
            "flex flex-col items-center gap-2 mt-3 text-clip text-secondary-500 text-sm select-none",
            isActive ? "" : "hidden"
          )}
        >
          <p className="font-bold text-[1.025rem]">{userInfo.display}</p>
          <p>{roleName}</p>
        </div>
      </div>
    </div>
  );
};
