import { createBrowserRouter } from "react-router-dom";

import axios from "@/shared/services/axios-instance";
import { typeKeys, featureKeys } from "@/shared/permission-key";
import {
  PriviteRoute,
  AdminRoute,
  PublicRoute,
  ProtectedRoute,
} from "./protected/index";

import { LoginPage } from "@/features/authentication/containers/login-page";

import {
  EmployeeManagementLayout,
  EmployeeListPage,
  EmployeeProfilePage,
  EmployeeDetailPage,
  EmployeeReportToPage,
  EmployeeSalaryPage,
} from "@/features/employee-management";
import { LeaveLayout, LeavePage } from "@/features/leave";
import { RecruitmentLayout, RecruitmentPage } from "@/features/recruitment";
import { PerformanceLayout, PerformancePage } from "@/features/performance";
import {
  ReportAnalysisLayout,
  CataloguePage,
  ReportTemplatePage,
  DefinitionPage,
} from "@/features/report-and-analysis";
import {
  AddRolePage,
  EditRolePage,
  ManageRolePage,
  SettingLayout,
  UserRolePage,
  ManageAttributePage,
} from "@/features/settings";

import { Layout } from "./layout/layout";

import { FobbidenPage } from "./features/error-handler/containers/fobbiden-page";
import { NotFoundPage } from "./features/error-handler/containers/not-found-page";

const loader = async ({ params }) => {
  if (params?.id) {
    const { data } = await axios.get(`/employee/${params.id}/info`);
    if (data.status === 200) {
      return data.data;
    }
  }
  return {};
};

export const router = createBrowserRouter([
  // Handle route not found
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/error/403",
    element: <FobbidenPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // Employee Management
      {
        path: "employee",
        exactPath: true,
        element: <EmployeeManagementLayout />,
        children: [
          {
            path: "list",
            exactPath: true,
            element: (
              <PriviteRoute
                roleAllowed={[
                  typeKeys.MASTER,
                  typeKeys.ADMIN,
                  typeKeys.SUPERVISOR,
                ]}
              >
                <EmployeeListPage />
              </PriviteRoute>
            ),
          },
          {
            path: ":id/profile",
            id: "profile",
            loader: loader,
            element: (
              <PriviteRoute roleAllowed={["admin"]}>
                <EmployeeProfilePage />
              </PriviteRoute>
            ),
          },
          {
            path: ":id/personal-details",
            id: "details",
            loader: loader,
            element: (
              <PriviteRoute roleAllowed={["admin"]}>
                <EmployeeDetailPage />
              </PriviteRoute>
            ),
          },
          {
            path: ":id/report-to",
            id: "reportTo",
            loader: loader,
            element: (
              <PriviteRoute roleAllowed={["admin"]}>
                <EmployeeReportToPage />
              </PriviteRoute>
            ),
          },
          {
            path: ":id/salary",
            id: "salary",
            loader: loader,
            element: (
              <PriviteRoute roleAllowed={["admin"]}>
                <EmployeeSalaryPage />
              </PriviteRoute>
            ),
          },
        ],
      },

      // report and analysis
      {
        path: "report-and-analytics",
        element: <ReportAnalysisLayout />,
        children: [
          {
            path: "catalogue",
            exactPath: true,
            element: (
              <PublicRoute>
                <CataloguePage />
              </PublicRoute>
            ),
          },
          {
            path: ":id/report-template",
            exactPath: true,
            element: (
              <PublicRoute>
                <ReportTemplatePage />
              </PublicRoute>
            ),
          },
          {
            path: "definition",
            exactPath: true,
            element: (
              <PublicRoute>
                <DefinitionPage />
              </PublicRoute>
            ),
          },
          {
            path: ":id/definition",
            exactPath: true,
            element: (
              <PublicRoute>
                <DefinitionPage />
              </PublicRoute>
            ),
          },
        ],
      },

      // Leave
      {
        path: "leave",
        element: <LeaveLayout />,
        children: [
          {
            path: "",
            exactPath: true,
            element: (
              <PublicRoute>
                <LeavePage />
              </PublicRoute>
            ),
          },
        ],
      },

      // Recruitment
      {
        path: "recruitment",
        element: <RecruitmentLayout />,
        children: [
          {
            path: "",
            exactPath: true,
            element: (
              <PublicRoute>
                <RecruitmentPage />
              </PublicRoute>
            ),
          },
        ],
      },
      // Recruitment
      {
        path: "performance",
        element: <PerformanceLayout />,
        children: [
          {
            path: "",
            exactPath: true,
            element: (
              <PublicRoute>
                <PerformancePage />
              </PublicRoute>
            ),
          },
        ],
      },

      //   Settings
      {
        path: "setting",
        element: <SettingLayout />,
        children: [
          {
            path: "manage-roles",
            exactPath: true,
            element: (
              <AdminRoute roleAllowed={[typeKeys.MASTER]}>
                <ManageRolePage />
              </AdminRoute>
            ),
          },
          {
            path: "add-role",
            exactPath: true,
            element: (
              <AdminRoute roleAllowed={[typeKeys.MASTER]}>
                <AddRolePage />
              </AdminRoute>
            ),
          },
          {
            path: ":id/edit-role",
            exactPath: true,
            element: (
              <AdminRoute roleAllowed={[typeKeys.MASTER]}>
                <EditRolePage />
              </AdminRoute>
            ),
          },
          {
            path: "user-roles",
            exactPath: true,
            element: (
              <AdminRoute
                roleAllowed={[typeKeys.MASTER, typeKeys.ADMIN]}
                featureKey={featureKeys.SYSTEM_USERS}
                typeAllowed={[typeKeys.READ]}
              >
                <UserRolePage />
              </AdminRoute>
            ),
          },
          {
            path: "manage-attributes",
            exactPath: true,
            element: (
              <AdminRoute roleAllowed={[typeKeys.MASTER]}>
                <ManageAttributePage />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
]);
