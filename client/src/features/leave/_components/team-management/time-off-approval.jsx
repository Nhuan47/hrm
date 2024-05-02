import React, { useEffect } from "react";

import { usePagination } from "@/shared/hooks/use-pagination";
import { Pagination } from "@/shared/components/pagination";
import { useFetch } from "@/shared/hooks/use-fetch";

import { Table } from "../leave-table";
import { ViewTitle } from "../view-title";
import { useFetchTimeOffApproval } from "../../_hooks/use-fetch-time-off-approval";

const cols = [
  { name: "Requester", accessor: "RequesterName" },
  { name: "Type", accessor: "TypeName" },
  { name: "Start Date", accessor: "StartDateDisplayName" },
  { name: "End Date", accessor: "EndDateDisplayName" },
  { name: "Status", accessor: "Status" },
];

export const TimeOffApproval = ({ currentUser }) => {
  const { offset, rowPerPage, onRowPerPageChange, onPageChange } =
    usePagination();

  const { isFetching, data } = useFetch(
    `/leave/time-off-approval?userId=${currentUser.ManagerId}&offset=${
      offset * rowPerPage
    }&limit=${rowPerPage}`,
    { dependencies: [currentUser.ManagerId, offset, rowPerPage] }
  );

  return (
    <section className="h-full flex flex-col ">
      <ViewTitle title="Waiting for my approval" />
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
        totalRows={data?.__count}
        rowsPerPage={rowPerPage}
        onPageChange={onPageChange}
        onRowPerPageChange={onRowPerPageChange}
      />
    </section>
  );
};
