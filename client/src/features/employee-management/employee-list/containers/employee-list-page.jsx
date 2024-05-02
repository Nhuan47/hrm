import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { usePermissions } from "@/shared/hooks/use-permission";
import { featureKeys } from "@/shared/permission-key";

import { useFetch } from "@/shared/hooks/use-fetch";
import { decodeToken } from "@/shared/utils";
import { Pagination } from "@/shared/components/pagination";
import { usePagination } from "@/shared/hooks/use-pagination";
import { Loading } from "@/shared/components/loading-overlay";

import { EmployeeTable } from "../_components/employee-table";
import { EmployeeModal } from "../_components/employee-modal";
import { ButtonAddEmployee } from "../_components/btn-add-employee";

const EmployeeListPage = () => {
  const { isReadable, isCreateable } = usePermissions(
    featureKeys.EMPLOYEE_LIST
  );

  // Decode token & get user permissions
  const tokenData = decodeToken();

  if (isReadable) {
    const { offset, rowPerPage, onRowPerPageChange, onPageChange, onReset } =
      usePagination();
    const [isOpenModal, setIsOpenModal] = useState(false);

    // fetch headers
    const { data: headers, isFetching: isFetchingHeader } = useFetch(
      "/employee/get-table-headers"
    );

    // fetch employee rows
    const { data, isFetching } = useFetch(
      `/employee/get-employee-list?limit=${rowPerPage}&offset=${
        offset * rowPerPage
      }`,
      { dependencies: [rowPerPage, offset * rowPerPage] }
    );

    return (
      <>
        {isCreateable ? (
          <ButtonAddEmployee onAddEmployee={() => setIsOpenModal(true)} />
        ) : null}

        {isFetching || isFetchingHeader ? (
          <Loading isOpen={isFetching || isFetchingHeader} />
        ) : (
          <>
            <EmployeeTable rows={data?.rows} cols={headers} />
            <Pagination
              offset={offset}
              totalRows={data?.totalRows}
              rowsPerPage={rowPerPage}
              onPageChange={onPageChange}
              onRowPerPageChange={onRowPerPageChange}
            />
          </>
        )}

        {isOpenModal && (
          <EmployeeModal
            isOpen={isOpenModal}
            onClose={() => setIsOpenModal(false)}
          />
        )}
      </>
    );
  } else {
    <Navigate to="/error/403" />;
  }
};

export default EmployeeListPage;
