import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { routeKeys } from "./constants/routes";
import { PublicRoute, PriviteRoute, AdminRoute } from "./protected";
import { typeKeys } from "@/shared/permission-key";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { IdleTimer } from "@/shared/components/idle-timer";
import { ConfirmContextProvider } from "@/lib/useConfirm";

import { LoginPage } from "@/features/authentication/containers/login-page";
import {
  EmployeeListPage,
  EmployeeProfilePage,
  EmployeeDetailPage,
  EmployeeReportToPage,
  EmployeeSalaryPage,
} from "@/features/employee-management";
import { CataloguePage } from "@/features/report-and-analysis/containers/catalogue-page";
import { DefinitionPage } from "@/features/report-and-analysis/containers/definition-page";
import { ReportTemplatePage } from "@/features/report-and-analysis/containers/report-template-page";
import { ManageRolePage } from "@/features/settings/containers/manage-role-page";
import { AddRolePage } from "@/features/settings/containers/add-role-page";
import { EditRolePage } from "@/features/settings/containers/edit-role-page";
import { UserRolePage } from "@/features/settings/containers/user-role-page";
import { FobbidenPage } from "@/features/error-handler/containers/fobbiden-page";
import { LeavePage } from "@/features/leave/containers/leave-page";
import { RecruitmentPage } from "./features/recruitment/containers/recruitment-page";
import { PerformancePage } from "./features/performance/containers/performance-page";

import { featureKeys } from "./shared/permission-key";
import { Test } from "./features/test/test";
import { ManageAttributePage } from "./features/settings/containers/manage-attribute-page";

function App() {
  return (
    <ConfirmContextProvider>
      <Routes>
        <Route path={"/testing"} element={<Test />} />

        {/* Error handler */}
        <Route path={"/error/403"} element={<FobbidenPage />} />

        {/* Authentication */}
        <Route path={"/"} element={<LoginPage />} />
        <Route path={routeKeys.LOGIN} element={<LoginPage />} />

        {/* Admin route */}
        <Route
          path={routeKeys.MANAGE_ROLES}
          element={
            <AdminRoute roleAllowed={[typeKeys.MASTER]}>
              <ManageRolePage />
            </AdminRoute>
          }
        />

        <Route
          path={routeKeys.ADD_ROLE}
          element={
            <AdminRoute roleAllowed={[typeKeys.MASTER]}>
              <AddRolePage />
            </AdminRoute>
          }
        />

        <Route
          path={routeKeys.EDIT_ROLE}
          element={
            <AdminRoute roleAllowed={[typeKeys.MASTER]}>
              <EditRolePage />
            </AdminRoute>
          }
        />

        <Route
          path={routeKeys.USER_ROLES}
          element={
            <AdminRoute
              roleAllowed={[typeKeys.MASTER, typeKeys.ADMIN]}
              featureKey={featureKeys.SYSTEM_USERS}
              typeAllowed={[typeKeys.READ]}
            >
              <UserRolePage />
            </AdminRoute>
          }
        />

        <Route
          path={routeKeys.MANAGE_ATTRIBUTES}
          element={
            <AdminRoute roleAllowed={[typeKeys.MASTER]}>
              <ManageAttributePage />
            </AdminRoute>
          }
        />

        {/* Privite route */}
        <Route
          path={routeKeys.EMPLOYEES}
          element={
            <PriviteRoute roleAllowed={["admin"]}>
              <EmployeeListPage />
            </PriviteRoute>
          }
        />

        {/* public route */}
        <Route
          path={routeKeys.EMPLOYEE_PROFILE}
          element={
            <PriviteRoute>
              <EmployeeProfilePage />
            </PriviteRoute>
          }
        />

        <Route
          path={routeKeys.PERSONAL_DETAILS}
          element={
            <PublicRoute>
              <EmployeeDetailPage />
            </PublicRoute>
          }
        />

        <Route
          path={routeKeys.REPORT_TO}
          element={
            <PublicRoute>
              <EmployeeReportToPage />
            </PublicRoute>
          }
        />

        <Route
          path={routeKeys.SALARY}
          element={
            <PublicRoute>
              <EmployeeSalaryPage />
            </PublicRoute>
          }
        />

        <Route
          path={routeKeys.RECRUITMENT}
          element={
            <PublicRoute>
              <RecruitmentPage />
            </PublicRoute>
          }
        />
        <Route
          path={routeKeys.CATALOGUE}
          element={
            <PublicRoute>
              <CataloguePage />
            </PublicRoute>
          }
        />
        <Route
          path={routeKeys.REPORT_TEMPLATE}
          element={
            <PublicRoute>
              <ReportTemplatePage />
            </PublicRoute>
          }
        />

        <Route
          path={routeKeys.REPORT_DEFINITION}
          element={
            <PublicRoute>
              <DefinitionPage />
            </PublicRoute>
          }
        />

        <Route
          path={routeKeys.REPORT_DEFINITION_UPDATE}
          element={
            <PublicRoute>
              <DefinitionPage />
            </PublicRoute>
          }
        />

        <Route
          path={routeKeys.LEAVE}
          element={
            <PublicRoute>
              <LeavePage />
            </PublicRoute>
          }
        />
        <Route
          path={routeKeys.PERFORMANCE}
          element={
            <PublicRoute>
              <PerformancePage />
            </PublicRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClicl={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />

      <ConfirmDialog />

      <IdleTimer />
    </ConfirmContextProvider>
  );
}

export default App;
