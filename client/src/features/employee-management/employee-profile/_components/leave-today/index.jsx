import React from "react";

import { BsBagCheck } from "react-icons/bs";

import { LoadingReload } from "@/shared/components/loading-reload";

import { Wrapper } from "../wrapper";
import { LeaveItem } from "./leave-item";
import { LeaveEmpty } from "./leave-empty";
import { useLeaveToDay } from "../../_hooks/use-leave-today";

export const LeaveToDay = () => {
  const { isLoading, leaveItems } = useLeaveToDay();

  return (
    <Wrapper title={"Employee On Leave Today"} icon={<BsBagCheck size={21} />}>
      <div className="space-y-2 h-[17rem]  overflow-auto ">
        {isLoading ? (
          <LoadingReload />
        ) : leaveItems?.length ? (
          leaveItems?.map((action, index) => (
            <LeaveItem key={index} item={action} />
          ))
        ) : (
          <LeaveEmpty />
        )}
      </div>
    </Wrapper>
  );
};
