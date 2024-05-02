import React, { useState } from "react";

import { usePagination } from "@/shared/hooks/use-pagination";
import { Pagination } from "@/shared/components/pagination";
import { useFetch } from "@/shared/hooks/use-fetch";

import { Table } from "../leave-table";
import { ViewTitle } from "../view-title";
import { YearSelector } from "./year-selector";

const cols = [
  { name: "Employee", accessor: "EmployeeName" },
  { name: "Time-Off Type", accessor: "TimeOffTypeName" },
  { name: "Earned This Year", accessor: "EarnedThisYear" },
  { name: "Used This Year", accessor: "UsedThisYear" },
  { name: "Previous Year", accessor: "LeftFromPreviousYear" },
  { name: "Available", accessor: "Available" },
];

export const TimeOffBalance = ({ currentUser }) => {
  const { offset, rowPerPage, onRowPerPageChange, onPageChange } =
    usePagination();

  const currentYear = new Date().getFullYear();
  const [yearSelected, setYearSelected] = useState(currentYear);

  const { isFetching, data } = useFetch(
    `/leave/time-off-amount?userId=${
      currentUser.UserId
    }&year=${yearSelected}&offset=${offset * rowPerPage}&limit=${rowPerPage}`,
    { dependencies: [currentUser.UserId, offset, rowPerPage, yearSelected] }
  );

  const onYearChange = (year) => {
    setYearSelected(year.value);
  };

  return (
    <section className="h-full flex flex-col ">
      <ViewTitle title="My Team's Time-Off Balances" />

      <YearSelector yearSelected={yearSelected} onYearChange={onYearChange} />
      <div className="flex-1">
        {/* table time off */}
        <Table
          cols={cols}
          rows={data?.results || []}
          startIndex={rowPerPage * offset}
          isLoading={isFetching}
        />
      </div>

      {/* pagination */}
      <Pagination
        offset={offset}
        totalRows={data?.__count || 0}
        rowsPerPage={rowPerPage}
        onPageChange={onPageChange}
        onRowPerPageChange={onRowPerPageChange}
      />
    </section>
  );
};
