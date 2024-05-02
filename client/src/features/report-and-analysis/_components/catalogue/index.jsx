import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { TbDeviceAnalytics } from "react-icons/tb";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { AiOutlinePlus, AiOutlineFolderAdd } from "react-icons/ai";

import { Button } from "@/shared/components/ui/button";
import { featureKeys } from "@/shared/permission-key";
import { usePermissions } from "@/shared/hooks/use-permission";

import { Search } from "./search";
import { FolderItem } from "./folder-item";

import {
  fetchFolders,
  fetchReports,
  loadFolderUpdating,
} from "../../_slices/catalogue-slice";
import { FolderModal } from "./folder-modal";

// Menu items configuration
const menuItems = [
  { id: "1", name: "All reports", icon: <HiOutlineDocumentReport size={18} /> },
];

export const Catalogue = () => {
  const { isCreateable } = usePermissions(featureKeys.REPORT, {
    isCheckIdByParam: false,
  });

  const { isReadable: isFolderReadable, isCreateable: isFolderCreateable } =
    usePermissions(featureKeys.REPORT_FOLDER, {
      isCheckIdByParam: false,
    });

  // State to manage search query
  const [query, setQuery] = useState("");

  //   State to manage menu left
  const [menuIndex, setMenuIndex] = useState(0);
  const [showMenuBar, setShowMenuBar] = useState(true);
  //   State to manage loading
  const [loading, setLoading] = useState(false);

  // Define navigate hook
  const navigate = useNavigate();

  // Init dispatch event
  const dispatch = useDispatch();

  // Get folders list from redux state
  const folders = useSelector((state) => state.catalogue.folders);
  const reportItems = useSelector((state) => state.catalogue.reports);
  const [reports, setReports] = useState(reportItems || []);

  const currentFolderEditing = useSelector(
    (state) => state.catalogue.currentFolderEditing
  );

  // State to manage the folder modal show/hide
  const [isOpenFolderModal, setIsOpenFolderModal] = useState(false);

  useEffect(() => {
    setReports(reportItems);
  }, [reportItems]);

  // Fetch report folders and reports when component mounts
  useEffect(() => {
    const fetchData = async () => {
      // turn on loading
      setLoading(true);

      try {
        await dispatch(fetchFolders());
        await dispatch(fetchReports());
      } catch (e) {
        console.log(e);
      } finally {
        // turn off loading
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //  Trigger folder editing
  useEffect(() => {
    setIsOpenFolderModal(currentFolderEditing ? true : false);
  }, [currentFolderEditing]);

  // Function to handle search changed
  const handleSearchChanged = (querySearch) => {
    setQuery(querySearch);
  };

  //   Function to handle active menu item
  const handleMenuClick = (index) => {
    setMenuIndex(index);
  };

  // Function to handle showing folder modal
  const handleActiveFolderModal = () => {
    setIsOpenFolderModal(true);
  };

  // Function to handle add new report click
  const handleAddNewReportClick = () => {
    navigate("/report-and-analytics/definition");
  };

  const onCancelFolderModal = async () => {
    await dispatch(loadFolderUpdating(null));
    setIsOpenFolderModal(false);
  };

  return (
    <>
      <section className="bg-light rounded-3xl  text-secondary-600">
        {/* Start  Header */}
        <header className="pb-4 flex justify-between items-center">
          {/* Icon  */}
          <div className="flex justify-between items-center gap-3">
            <span>
              <TbDeviceAnalytics size={21} />
            </span>
            <span>Report</span>
          </div>

          {/* Search  */}
          <Search onSearch={handleSearchChanged} />
        </header>
        {/* End header */}

        {/* Start Content */}
        <article className="border-t flex">
          {/* Lef section */}
          <div
            className={`relative pr-4  ${
              showMenuBar ? "basis-2/12" : "basis-1/12"
            } duration-500`}
          >
            {/* Start left Header */}
            {isCreateable || isFolderCreateable ? (
              <div className="flex justify-center items-center gap-2 py-2.5">
                {/* Start Button add report  */}
                {isCreateable && (
                  <Button
                    className="btn-primary"
                    isPadding={showMenuBar}
                    onClick={handleAddNewReportClick}
                  >
                    <AiOutlinePlus size={18} className="font-bold" />
                    {showMenuBar ? "New" : ""}
                  </Button>
                )}
                {/* End Button add report  */}

                {/* Start Button add folder */}
                {isFolderReadable && (
                  <Button
                    isPadding={false}
                    className=" bg-secondary-100/80 hover:bg-secondary-200 p-2 rounded-full text-primary-500"
                    onClick={handleActiveFolderModal}
                  >
                    <AiOutlineFolderAdd size={18} />
                  </Button>
                )}
                {/* End button add folder */}
              </div>
            ) : null}
            {/* End left Header */}

            {/* Start Left content items */}
            <div className="border-t text-xs flex flex-col gap-2 py-4 text-secondary-500">
              {menuItems.map((item, index) => (
                <p
                  key={item.id}
                  className={`p-2.5 px-3 rounded-3xl border-none hover:bg-slate-200 cursor-pointer duration-300 flex gap-2 items-center ${
                    showMenuBar ? "justify-start" : "justify-center"
                  } ${index === menuIndex ? "bg-slate-200" : ""}`}
                  onClick={() => handleMenuClick(index)}
                >
                  {item.icon} {showMenuBar && <span>{item.name}</span>}
                </p>
              ))}
            </div>
            {/* End Left content items */}

            {/* Start toggle button */}
            <Button
              isPadding={false}
              className="bg-slate-100/60 hover:bg-slate-100 p-0.5 absolute top-11 right-[-10px] duration-300"
              onClick={() => setShowMenuBar((prev) => !prev)}
            >
              {showMenuBar ? (
                <BiChevronLeft size={18} />
              ) : (
                <BiChevronRight size={18} />
              )}
            </Button>
            {/* End toogle button */}
          </div>
          {/* End Lef section */}

          {/* Right section */}
          <div className="basis-11/12 border-l py-3 pl-3">
            {/* Start report items */}
            {loading && null}
            {folders &&
              folders?.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  reports={reports}
                  search={query}
                />
              ))}
          </div>

          {/* End report items */}
        </article>
        {/* End content */}
      </section>

      {isOpenFolderModal && (
        <FolderModal isOpen={isOpenFolderModal} onClose={onCancelFolderModal} />
      )}
    </>
  );
};
