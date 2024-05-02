import React from "react";
import { AddNewButton } from "../_components/add-new-button";
import { AssignSupervisor } from "../_components/assign-supervisor";
import { AssignSubordinate } from "../_components/assign-subordinate";
import { Organizational } from "../_components/organizational";
import { AssignAttachment } from "../_components/assign-attachment";

const EmployeeReportToPage = () => {
  return (
    <>
      <AddNewButton />

      <div className="space-y-10">
        <AssignSupervisor />
        <AssignSubordinate />
        <Organizational />
        <AssignAttachment />
      </div>
    </>
  );
};

export default EmployeeReportToPage;
