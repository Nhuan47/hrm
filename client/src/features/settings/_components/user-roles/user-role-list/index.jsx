import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Loading } from "@/shared/components/loading-overlay";

import { UserRoleModal } from "../user-role-modal";
import { useFetchUserRoles } from "../../../_hooks/user-roles/use-user-roles";
import { useFetchRoles } from "../../../_hooks/user-roles/use-fetch-roles";
import { UserRoleTable } from "./user-role-table";

const headers = [
  { id: 1, name: "Employee Name", accessor: "name" },
  { id: 2, name: "Roles", accessor: "role" },
  { id: 3, name: "Status", accessor: "status" },
];

export const UserRoleList = () => {
  const [idEditing, setIdEditing] = useState(null);

  // custom hooks
  // Call hook to fetch roles list from server
  useFetchUserRoles();
  const { isFetching, roles } = useFetchRoles();

  // Default hooks
  const userRoles = useSelector((state) => state.userRole.userRoles);
  const isLoading = useSelector((state) => state.userRole.isLoading);

  const handleEditing = (id) => {
    setIdEditing(id);
  };

  return (
    <>
      <UserRoleTable
        rows={userRoles}
        cols={headers}
        onEditing={handleEditing}
      />

      {/* Loading */}
      <Loading isOpen={isLoading || isFetching} />

      {/* Modal */}
      {idEditing && (
        <UserRoleModal
          roles={roles}
          id={idEditing}
          isOpen={idEditing}
          onClose={() => setIdEditing(null)}
        />
      )}
    </>
  );
};
