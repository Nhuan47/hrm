import React from "react";

import { Navigate } from "react-router-dom";

import Layout from "@/layout";

import { usePermissions } from "@/shared/hooks/use-permission";
import { useNavItems } from "@/shared/hooks/use-nav-items";
import { featureKeys } from "@/shared/permission-key";

import { useEmployeeManagementBreadcrumb } from "@/shared/hooks/use-employee-management-breadcrumb";

import { About } from "../_components/about";
import { QuickAccess } from "../_components/quick-access";
import { LeaveToDay } from "../_components/leave-today";

const EmployeeProfilePage = () => {
  const { isReadable } = usePermissions(featureKeys.EMPLOYEE_PROFILE);

  if (isReadable) {
    return (
      <>
        <div className="flex justify-center items-center">
          <div className="w-full flex items-stretch flex-wrap gap-4 max-w-6xl ">
            <div className="basis-2/3-gap-4">
              <About />
            </div>
            <div className="basis-1/3-gap-4">
              <QuickAccess />
            </div>
            <div className="basis-1/3-gap-4">
              <LeaveToDay />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Navigate to="/error/403" />;
  }
};

export default EmployeeProfilePage;
