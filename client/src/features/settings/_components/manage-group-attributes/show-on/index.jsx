import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDisplay } from "react-icons/fa6";

import { Title } from "../title";
import { AttribuiteList } from "./attribute-list";
import { ManageEmployeeTable } from "./manage-employee-table";
import { ManageEmployeeModal } from "./manage-employee-modal";
import { ColumnTitle } from "./col-title";

export const ManageShowOn = () => {
  return (
    <div>
      <Title title="Display Management" icon={<FaDisplay />} />
      <div
        className={`flex justify-start rounded-md border p-2 pb-4 h-[35rem] transition-colors`}
      >
        <div className="basis-1/3 h-full  pr-1 flex flex-col">
          <ColumnTitle title="Attributes" />
          <AttribuiteList />
        </div>

        <div className="basis-1/3 h-full  px-1   flex flex-col">
          <ColumnTitle title="Attribute shown on employee table" />
          <ManageEmployeeTable />
        </div>

        <div className="basis-1/3 h-full  pl-1  flex flex-col">
          <ColumnTitle title="Attribute shown on employee modal" />
          <ManageEmployeeModal />
        </div>
      </div>
    </div>
  );
};
