import React from "react";
import { useDispatch } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineUsers, HiUsers } from "react-icons/hi";

import { Button } from "@/shared/components/ui/button";
import { featureKeys } from "@/shared/permission-key";
import { Tooltip } from "@/shared/components/tooltip";
import { usePermissions } from "@/shared/hooks/use-permission";

import { openSupervisorModal } from "../_slices/supervisor-slice";
import { openSubordinateModal } from "../_slices/subordinate-slice";

export const AddNewButton = () => {
  const { isCreateable: SupIsCreateable } = usePermissions(
    featureKeys.EMPLOYEE_SUPERVISOR
  );

  const { isCreateable: subIsCreateable } = usePermissions(
    featureKeys.EMPLOYEE_SUBORDINATE
  );

  const dispatch = useDispatch();

  // Handle add new supervisor click
  const handleAddNewSupervisorClick = async () => {
    await dispatch(openSupervisorModal(true));
  };

  // Handle add new subordinate click
  const handleAddNewSubodinateClick = async () => {
    await dispatch(openSubordinateModal(true));
  };

  if (SupIsCreateable || subIsCreateable) {
    return (
      <div className="group btn-primary p-4 flex items-center justify-center fixed top-28 right-8 border w-50 h-50 z-10 rounded-full shadow-xl cursor-pointer duration-300 ">
        <AiOutlinePlus size={15} />
        <div className="absolute top-full opacity-0 duration-500 -translate-y-28  group-hover:translate-y-0 justify-center flex flex-col items-center gap-3 p-3  overflow-hidden group-hover:opacity-100 group-hover:overflow-visible">
          {SupIsCreateable && (
            <Button
              isPadding={false}
              title="Add supervisor"
              className="p-2 bg-blue-500 hover:bg-blue-600 text-light hover:scale-125  duration-300"
              onClick={handleAddNewSupervisorClick}
            >
              <HiUsers size={15} />
            </Button>
          )}

          {subIsCreateable && (
            <Button
              isPadding={false}
              title="Add subordinate"
              className="p-2 bg-yellow-400 text-light hover:bg-yellow-500 hover:scale-125 duration-300"
              onClick={handleAddNewSubodinateClick}
            >
              <HiOutlineUsers size={15} />
            </Button>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
