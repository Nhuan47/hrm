import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useFetch } from "@/shared/hooks/use-fetch";
import { Pagination } from "@/shared/components/pagination";
import { usePagination } from "@/shared/hooks/use-pagination";

import { Table } from "../leave-table";
import { ViewTitle } from "../view-title";

import { DepartmentSelector } from "./department-selector";

const cols = [
  { name: "Requester", accessor: "RequesterName" },
  { name: "Department", accessor: "DepartmentName" },
  { name: "Type", accessor: "TypeName" },
  { name: "Start Date", accessor: "StartDateDisplayName" },
  { name: "End Date", accessor: "EndDateDisplayName" },
  { name: "Workdays", accessor: "WorkDays" },
  { name: "Status", accessor: "Status" },
];

export const ListView = ({ currentUser }) => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const [departmentIdSelected, setDepartmentIdSelected] = useState(
    currentUser?.DepartmentId
  );

  const { offset, rowPerPage, onRowPerPageChange, onPageChange, onReset } =
    usePagination();

  useEffect(() => {
    onReset();
  }, [mode]);

  const { isFetching, data } = useFetch(
    `/leave/time-off?userId=${
      currentUser.UserId
    }&departmentId=${departmentIdSelected}&mode=${mode}&offset=${
      offset * rowPerPage
    }&limit=${rowPerPage}`,
    {
      dependencies: [
        currentUser.UserId,
        mode,
        departmentIdSelected,
        offset,
        rowPerPage,
      ],
    }
  );

  const onDepartmentChange = (department) => {
    setDepartmentIdSelected(department.value);
  };

  return (
    <div className="h-full flex flex-col ">
      <ViewTitle
        title={
          mode === "all" ? "Current Time-Off Requests" : "My Time-Off Requests"
        }
      />

      {mode === "all" && (
        <DepartmentSelector
          onDepartmentChange={onDepartmentChange}
          idSelected={departmentIdSelected}
        />
      )}

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
    </div>
  );
};
