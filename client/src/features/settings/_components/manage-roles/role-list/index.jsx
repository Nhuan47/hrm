import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loading } from "@/shared/components/loading-overlay";

import { RoleTable } from "./role-table";
import { ButtonAddNew } from "./btn-add-new";
import { useFetchRoles } from "../../../_hooks/manage-roles/use-fetch-roles";
import { useRole } from "../../../_hooks/manage-roles/use-role";

const headers = [
  { id: 1, name: "Role Name", accessor: "name" },
  { id: 2, name: "Type", accessor: "type" },
];

export const RoleList = () => {
  // custom hooks
  // Call hook to fetch roles list from server
  useFetchRoles();

  // Default hooks
  const navigate = useNavigate();
  const roles = useSelector((state) => state.role.roles);
  const isLoading = useSelector((state) => state.role.isLoading);

  const onAddRole = () => {
    navigate("/setting/add-role");
  };

  const { onDelete, onEditing } = useRole();

  return (
    <>
      <ButtonAddNew onAddNew={onAddRole} />
      <RoleTable
        rows={roles}
        cols={headers}
        onDelete={onDelete}
        onEditing={onEditing}
      />

      <Loading isOpen={isLoading} />
    </>
  );
};
