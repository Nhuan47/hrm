import React from "react";
import { Navigate, useParams } from "react-router-dom";

import Layout from "@/layout";
import { decodeToken } from "@/shared/utils";
import { useNavItems } from "@/shared/hooks/use-nav-items";

import { featureKeys, permissionKeys, typeKeys } from "@/shared/permission-key";
import { useEmployeeManagementBreadcrumb } from "@/shared/hooks/use-employee-management-breadcrumb";

import { SalaryForm } from "../_components/salary-form";
import { SalaryHistory } from "../_components/salary-history";
import { SalaryChart } from "../_components/salary-chart";
import { usePermissions } from "../../../../shared/hooks/use-permission";

const EmployeeSalaryPage = () => {
  const { isReadable } = usePermissions(featureKeys.EMPLOYEE_SALARY);

  if (isReadable) {
    const breadcrumbs = useEmployeeManagementBreadcrumb();
    const { navItems } = useNavItems();

    return (
      <div className="space-y-10">
        <SalaryForm />
        <SalaryHistory />
        <SalaryChart />
      </div>
    );
  }
  {
    return <Navigate to="/error/403" />;
  }
};

export default EmployeeSalaryPage;
