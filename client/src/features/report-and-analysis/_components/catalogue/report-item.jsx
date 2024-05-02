import React from "react";
import { BsTrash3 } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";

import { usePermissions } from "@/shared/hooks/use-permission";
import { featureKeys } from "@/shared/permission-key";

export const ReportItem = ({ onSelect, onEdit, onDelete, report }) => {
  const { isReadable, isDeleteable, isUpdateable } = usePermissions(
    featureKeys.REPORT,
    { isCheckIdByParam: false }
  );

  if (isReadable) {
    return (
      <div
        key={report.id}
        className="group flex justify-between items-center gap-3 p-4 hover:bg-secondary-100 rounded-3xl duration-300 cursor-pointer"
      >
        {/* report title */}
        <div
          className="flex gap-2 items-center flex-1 p-1.5"
          onClick={() => onSelect(report.id)}
        >
          <HiOutlineDocumentReport />

          <span className="text-sm">{report.name}</span>
        </div>

        {/* report actions */}
        <div className="flex gap-2 items-center ">
          {/* edit */}
          {isUpdateable && (
            <span
              className=" hidden p-2 bg-secondary-200 hover:bg-secondary-300 rounded-full group-hover:block duration-300"
              onClick={() => onEdit(report.id)}
            >
              <MdModeEdit size={15} />
            </span>
          )}

          {/* delete */}
          {isDeleteable && (
            <span
              className="hidden p-2 bg-secondary-200 hover:bg-secondary-300 rounded-full group-hover:block duration-300"
              onClick={() => onDelete(report)}
            >
              <BsTrash3 size={15} />
            </span>
          )}
        </div>
      </div>
    );
  }
};
