import { useRef, useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";

import { useConfirm } from "@/lib/useConfirm";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { usePermissions } from "@/shared/hooks/use-permission";
import { featureKeys } from "@/shared/permission-key";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { Loading } from "@/shared/components/loading-overlay";

import {
  openSupervisorModal,
  setCurrentSupervisorId,
  loadSupervisors,
  deleteSupervisor,
} from "../_slices/supervisor-slice";
import * as api from "../_services/supervisor-service";
import { SupervisorModal } from "./modals/supervisor-modal";

export const AssignSupervisor = () => {
  const { isReadable, isUpdateable, isDeleteable } = usePermissions(
    featureKeys.EMPLOYEE_SUPERVISOR
  );

  if (isReadable) {
    // get employee id from url
    const { id } = useParams();

    const { ask } = useConfirm();

    // Dispatcher to redux store
    const dispatcher = useDispatch();

    const navigate = useNavigate();

    // Ref to track click outside the menu
    const menuRef = useRef();

    // State for selected supervisor items
    const [selectedItems, setSelectedItems] = useState([]);

    // State to control the menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // State to control the "Select All" checkbox
    const [isAllSelected, setIsAllSelected] = useState(false);

    // Trigger to fetch supervisors
    useEffect(() => {
      const fetchSupervisors = async () => {
        const { data } = await api.getSupervisors(id);
        dispatcher(loadSupervisors(data));
      };
      fetchSupervisors();
    }, [id]);

    const supervisors = useSelector((state) => state.supervisor.supervisors);
    const isLoading = useSelector((state) => state.supervisor.isLoading);

    // Function to deselect all supervisor items
    const handleDeselectAll = () => {
      setSelectedItems([]);
      setIsAllSelected(false);
      setIsMenuOpen(false);
    };

    // Function to select/deselect all supervisor items
    const handleSelectAll = () => {
      setIsAllSelected(!isAllSelected);
      setSelectedItems(
        isAllSelected ? [] : supervisors.map((supervisor) => supervisor.id)
      );
      setIsMenuOpen(false);
    };

    // Function to handle checkbox state changes
    const handleCheckboxChange = (id, checked) => {
      setSelectedItems((currentSelectedItems) => {
        if (checked) {
          return [...currentSelectedItems, id];
        } else {
          setIsAllSelected(false);
          return currentSelectedItems.filter((itemId) => itemId !== id);
        }
      });
    };

    // Register click outside event for the menu
    useOutsideClick(menuRef, () => {
      setIsMenuOpen(false);
    });

    // Handle delete
    const onDelete = async () => {
      let isDelete = await ask(
        "You are about to delete data permanently. Are you sure you want to continue?"
      );

      if (isDelete) {
        let dataForm = {
          employeeId: id,
          items: selectedItems,
        };
        let {
          meta: { requestStatus },
        } = await dispatcher(deleteSupervisor(dataForm));
        if (requestStatus === "fulfilled") {
          toast.success("Delete successfully");
          setSelectedItems([]);
        } else {
          toast.error("Delete failed");
        }
      }
    };

    // Funtion to handle click to button edit supervisor
    const handleClickEditSupervisor = (itemId) => {
      dispatcher(setCurrentSupervisorId(itemId));
      dispatcher(openSupervisorModal(true));
    };

    return (
      <div className="bg-white w-full p-5 py-8 rounded-3xl relative">
        {/* Start table */}
        <div className="w-full">
          <div className="flex justify-between border-b pb-5 text-sm text-secondary-500">
            <p className="font-bold">Assigned Supervisors</p>
            <p>{supervisors.length} record(s)</p>
          </div>

          <table className="w-full">
            <thead className="w-full">
              <tr className="border-b w-full">
                {isDeleteable && (
                  <th className={`py-2 text-left w-[10%]`}>
                    <div ref={menuRef} className="cursor-pointer relative">
                      {/* Start three dot button */}
                      <div
                        className={`text-xs
                      ${
                        selectedItems.length > 0
                          ? "text-primary-500"
                          : "text-secondary-500"
                      }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <BsThreeDots size={20} />
                      </div>
                      {/* End three dot button */}

                      {/* Supervisor Menu */}
                      {supervisors.length > 0 && (
                        <div
                          className={`absolute top-full bg-light border rounded-sm duration-300 w-32
                    ${
                      isMenuOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                        >
                          {/* Start select all option */}
                          {supervisors.length > 0 &&
                            supervisors.length !== selectedItems.length && (
                              <p
                                className="py-4 px-5 text-xs text-secondary-500 hover:bg-secondary-100 duration-300"
                                onClick={handleSelectAll}
                              >
                                Select All
                              </p>
                            )}
                          {/* End select all option */}

                          {/* Start deselect all options */}
                          {supervisors.length > 0 &&
                            selectedItems.length > 0 && (
                              <p
                                className="py-4 px-5 text-xs text-secondary-500 hover:bg-secondary-100 duration-300"
                                onClick={handleDeselectAll}
                              >
                                Deselect All
                              </p>
                            )}
                          {/* End deselect all options */}

                          {/* Delete selected option */}
                          {selectedItems.length > 0 && (
                            <p
                              className="py-4 px-5 text-xs text-secondary-500 hover-bg-secondary-100 duration-300"
                              onClick={onDelete}
                            >
                              Delete Selected
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                )}

                <th className={`py-2 text-left w-[40%]`}>
                  <span className={`capitalize text-xs text-secondary-600`}>
                    Name
                  </span>
                </th>
                <th className={`py-2 text-left w-[40%]`}>
                  <span className={`capitalize text-xs text-secondary-600`}>
                    Reporting Method
                  </span>
                </th>
                {/* col acction */}
                <th></th>
                {/* End col action */}
              </tr>
            </thead>

            <tbody>
              {supervisors &&
                supervisors.map((supervisor) => {
                  const isChecked = selectedItems.includes(supervisor.id);
                  return (
                    <tr
                      key={supervisor.id}
                      className="border-b hover:bg-secondary-100 text-sm text-secondary-500"
                    >
                      {/* Checkbox delete */}
                      {isDeleteable && (
                        <td className="py-2.5 text-left w-[10%]">
                          <Checkbox
                            onChange={(e) =>
                              handleCheckboxChange(
                                supervisor.id,
                                e.target.checked
                              )
                            }
                            name={supervisor.id}
                            id={supervisor.id}
                            checked={isChecked}
                          />
                        </td>
                      )}

                      <td className="py-2.5 text-left w-[40%]">
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/employee/${supervisor.employeeId}/report-to`
                            )
                          }
                        >
                          {supervisor.name}
                        </span>
                      </td>
                      <td className="py-2.5 text-left w-[40%]">
                        {supervisor.method}
                      </td>

                      {/* Button edit supervisor */}
                      <td className="py-2.5 flex  justify-center items-center text-secondary-500 w-[10%]">
                        {isUpdateable ? (
                          <Button
                            isPadding={false}
                            className="border-none outline-none hover:bg-slate-200 p-2 duration-300"
                            onClick={() =>
                              handleClickEditSupervisor(supervisor.id)
                            }
                          >
                            <MdOutlineEdit size={21} />
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* End table */}

        {/* Start Edit supervisor modal */}
        <SupervisorModal />
        {/* End edit supervisor modal */}

        <Loading isOpen={isLoading} />
      </div>
    );
  }
};
