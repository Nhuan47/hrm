import React from "react";

import { featureKeys } from "@/shared/permission-key";
import { usePermissions } from "@/shared/hooks/use-permission";

import { Wrapper } from "../wrapper";
import { SalaryTable } from "./salary-table";

export const SalaryHistory = () => {
  const { isReadable } = usePermissions(featureKeys.EMPLOYEE_SALARY);
  if (isReadable) {
    return (
      <Wrapper title={"Salary history"}>
        <SalaryTable />
      </Wrapper>
    );
  }
};
