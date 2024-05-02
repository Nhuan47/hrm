import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { BsTrash3 } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

import { useConfirm } from "@/lib/useConfirm";
import { usePermissions } from "@/shared/hooks/use-permission";
import { featureKeys, permissionKeys } from "@/shared/permission-key";

import {
  deleteReport,
  deleteFolder,
  loadFolderUpdating,
} from "../../_slices/catalogue-slice";

export const CatalogueItem = ({ folder, reports, search }) => {
  // Decode token & get user permissions
  const tokenData = decodeToken();
  const { permissions } = tokenData;

  const { isReadable, isDeleteable, isUpdateable } = usePermissions(
    featureKeys.REPORT,
    { isCheckIdByParam: false }
  );

  const { ask } = useConfirm();

  const [items, setItems] = useState(reports || []);

  useEffect(() => {
    if (search?.length > 0) {
      let filteredItems = reports?.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setItems(filteredItems);
    } else {
      setItems(reports);
    }
  }, [search]);

  useEffect(() => {
    setItems(reports);
  }, [reports]);

  // Define navigate hook
  const navigate = useNavigate();

  // Define dispatcher event
  const dispatch = useDispatch();

  // State to manage toggle show/hide  child reports
  const [isShowReport, setIsShowReport] = useState(true);

  //   Function to handle toggle show/hide child reports
  const toggleReport = () => {
    setIsShowReport((prev) => !prev);
  };

  //   Handle delete report
  const handleDeleteFolder = async (item) => {
    const isDelete = await ask(
      "You are about to delete data permanently. Are you sure you want to  continue?"
    );

    if (isDelete) {
      const {
        meta: { requestStatus },
      } = await dispatch(deleteFolder(item));

      if (requestStatus === "fulfilled") {
        toast.success("Delete sucessfully");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  const handleEditFolderClick = async (item) => {
    await dispatch(loadFolderUpdating(item));
  };

  //   Handle delete report
  const handleDeleteReport = async (item) => {
    let isDelete = await ask(
      "You are about to delete data permanently. Are you sure you want to  continue?"
    );
    if (isDelete) {
      const {
        meta: { requestStatus },
      } = await dispatch(deleteReport(item));
      if (requestStatus === "fulfilled") {
        toast.success("Delete successfully");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  // Handle report click to redirect to the report page
  const handleReportClick = (reportId) => {
    navigate(`/report-and-analytics/report-template/${reportId}`);
  };

  //   Handle  edit report
  const handleEditReportClick = (reportId) => {
    navigate(`/report-and-analytics/definition/${reportId}`);
  };

  return (
    <>
      {/* Folder */}
      <div className="border group border-slate-100 flex justify-between items-center rounded-3xl p-5 bg-slate-100/60">
        {/* Folder name */}
        <div className="flex justify-start items-center gap-3 py-1.5">
          <PiUsersThree size={21} />
          <span className="text-sm font-semibold text-secondary-500/90 select-none">
            {folder.name}
          </span>
        </div>

        <div className="flex justify-end items-center gap-2">
          {/* button action delete/update */}
          <div className="flex justify-center items-center gap-2">
            {/* edit */}
            <span
              className=" hidden p-2 bg-secondary-200 hover:bg-secondary-300 rounded-full group-hover:block duration-300"
              onClick={() => handleEditFolderClick(folder)}
            >
              <MdModeEdit size={15} />
            </span>

            {/* Delete */}
            <span
              className=" hidden p-2 bg-secondary-200 hover:bg-secondary-300 rounded-full group-hover:block duration-300"
              onClick={() => handleDeleteFolder(folder)}
            >
              <BsTrash3 size={15} />
            </span>
          </div>

          {/* Button toogle  */}
          <span
            className="hover:bg-slate-200 rounded-full p-1 cursor-pointer"
            onClick={toggleReport}
          >
            {!isShowReport ? (
              <BiChevronDown size={21} />
            ) : (
              <BiChevronUp size={21} />
            )}
          </span>
        </div>
      </div>

      {/* reports */}
      <div
        className={`flex flex-col gap-1 py-1 overflow-hidden duration-300 ${
          isShowReport ? "" : "h-0"
        }`}
      >
        {items?.map((report) => {
          if (report.folderId === folder.id) {
            return (
              <div
                key={report.id}
                className="group flex justify-between items-center gap-3 p-4 hover:bg-secondary-100 rounded-3xl duration-300 cursor-pointer"
              >
                {/* report title */}
                <div
                  className="flex gap-2 items-center flex-1 p-1.5"
                  onClick={() => handleReportClick(report.id)}
                >
                  <HiOutlineDocumentReport />

                  <span className="text-sm">{report.name}</span>
                </div>

                {/* report actions */}
                <div className="flex gap-2 items-center ">
                  {/* edit */}
                  <span
                    className=" hidden p-2 bg-secondary-200 hover:bg-secondary-300 rounded-full group-hover:block duration-300"
                    onClick={() => handleEditReportClick(report.id)}
                  >
                    <MdModeEdit size={15} />
                  </span>

                  {/* delete */}
                  <span
                    className="hidden p-2 bg-secondary-200 hover:bg-secondary-300 rounded-full group-hover:block duration-300"
                    onClick={() => handleDeleteReport(report)}
                  >
                    <BsTrash3 size={15} />
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};
