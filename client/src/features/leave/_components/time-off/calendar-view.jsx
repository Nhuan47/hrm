import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingReload } from "@/shared/components/loading-reload";
import { useFetch } from "@/shared/hooks/use-fetch";

import { Calendar } from "./calendar";
import { ColorList } from "./color-list";
import { ViewTitle } from "../view-title";
import { DepartmentSelector } from "./department-selector";

import { formatTimeOffDate } from "../../utils/leave-utils";

export const CalendarView = ({ currentUser }) => {
  const [departmentIdSelected, setDepartmentIdSelected] = useState(
    currentUser?.DepartmentId
  );

  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const { isFetching: isFetchingHoliday, data: holidays } = useFetch(
    "/leave/public-holidays"
  );

  const { isFetching, data } = useFetch(
    `/leave/time-off?userId=${
      currentUser.UserId
    }&departmentId=${departmentIdSelected}&mode=${mode}&offset=${0}&limit=${1000}`,
    { dependencies: [currentUser.UserId, mode, departmentIdSelected] }
  );

  let timeOffItems = data?.results?.map((item) => ({
    id: item.Id,
    title: `${item.Hours} ${item.RequesterName} (${item.TypeName}) ${
      item.StartTime !== null ? "Start Time: " + item.StartTime : ""
    }`,
    description: `${item.Hours} ${item.RequesterName} (${item.TypeName})`,
    start: formatTimeOffDate(item.StartDate),
    end: formatTimeOffDate(item.EndDate, 18),
    allDay: true,
    department: item.DepartmentName,
    departmentId: item.DepartmentId,
    className: `${
      item.Status === "Pending Approval"
        ? "bg-secondary-500/90 border-secondary-500/90"
        : "bg-primary-500 border-primary-500"
    } cursor-default  `,
  }));

  const onDepartmentChange = (department) => {
    setDepartmentIdSelected(department.value);
  };

  return (
    <div>
      {/* Title */}
      <ViewTitle title={"Calendar View"} />

      {/* Department selector */}
      {mode === "all" && (
        <DepartmentSelector
          onDepartmentChange={onDepartmentChange}
          idSelected={departmentIdSelected}
        />
      )}

      {/* Color list */}
      <ColorList />

      {/* Calendar */}
      {isFetchingHoliday || isFetching ? (
        <LoadingReload />
      ) : (
        <Calendar holidays={holidays} timeOff={timeOffItems} />
      )}
    </div>
  );
};
