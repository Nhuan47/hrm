import React, { memo } from "react";
import { useSearchParams } from "react-router-dom";

import { TimeOffApproval } from "./time-off-approval";
import { TimeOffBalance } from "./time-off-balance";

export const TeamManagement = memo(({ currentUser }) => {
  const [searchParams] = useSearchParams();
  const sessionName = searchParams.get("name");

  return (
    <div className="px-5 w-full h-full">
      {sessionName === "timeOffMyApprove" ? (
        <TimeOffApproval currentUser={currentUser} />
      ) : (
        <TimeOffBalance currentUser={currentUser} />
      )}
    </div>
  );
});
