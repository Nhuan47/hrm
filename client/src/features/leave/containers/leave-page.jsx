import React from "react";
import { useSearchParams } from "react-router-dom";

import { decodeToken } from "@/shared/utils";
import { LoadingReload } from "@/shared/components/loading-reload";

import { TimeOff } from "../_components/time-off";
import { LeaveHeader } from "../_components/leave-header";
import { LeaveSidebar } from "../_components/leave-sidebar";
import { TeamManagement } from "../_components/team-management";
import { useFetchUserInfo } from "../_hooks/use-fetch-current-user";
import { TEAM_MANAGEMENT, TIME_OFF } from "../constanst/leave-constants";

const LeavePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const tokenData = decodeToken();
  const email = tokenData?.sub;

  const { isFetching, user } = useFetchUserInfo(email);

  return (
    <>
      <section>
        <LeaveHeader />
        <main className="border-t flex items-stretch ">
          <LeaveSidebar />
          <article className="flex-1">
            {!isFetching && user ? (
              category === TIME_OFF ? (
                <TimeOff currentUser={user} />
              ) : category === TEAM_MANAGEMENT ? (
                <TeamManagement currentUser={user} />
              ) : null
            ) : (
              <LoadingReload />
            )}
          </article>
        </main>
      </section>
    </>
  );
};

export default LeavePage;
