import React, { memo } from "react";
import { useSearchParams } from "react-router-dom";

import { ListView } from "./list-view";
import { CalendarView } from "./calendar-view";
import { LIST_VIEW, CALENDAR_VIEW } from "../../constanst/leave-constants";

export const TimeOff = memo(({ currentUser }) => {
  const [searchParams] = useSearchParams();
  const viewType = searchParams.get("viewType");

  return (
    <div className="px-5 w-full h-full">
      {viewType === LIST_VIEW ? (
        <ListView currentUser={currentUser} />
      ) : viewType === CALENDAR_VIEW ? (
        <CalendarView currentUser={currentUser} />
      ) : null}
    </div>
  );
});
