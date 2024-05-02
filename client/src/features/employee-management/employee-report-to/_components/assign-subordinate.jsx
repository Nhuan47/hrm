import { useRef, useState, memo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";

import { useConfirm } from "@/lib/useConfirm";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";

import { decodeToken } from "@/shared/utils";
import { featureKeys, permissionKeys, typeKeys } from "@/shared/permission-key";
import { usePermissions } from "@/shared/hooks/use-permission";

import {
  openSubordinateModal,
  setCurrentSubordinateId,
  loadSubordinates,
  onDeleteSubordinate,
} from "../_slices/subordinate-slice";
import { SubordinateModal } from "./modals/subordinate-modal";
import * as api from "../_services/subordinate-service";

export const AssignSubordinate = memo(() => {
  const { isReadable, isUpdateable, isDeleteable } = usePermissions(
    featureKeys.EMPLOYEE_SUBORDINATE
  );

  if (isReadable) {
    // get employee id from url
    const { id } = useParams();

    const { ask } = useConfirm();

    const navigate = useNavigate();

    // Dispatcher to redux store
    const dispatcher = useDispatch();

    const subordinates = useSelector((state) => state.subordinate.subordinates);

    // Ref to track click outside the menu
    const menuRef = useRef();

    // State for selected subordinate items
    const [selectedItems, setSelectedItems] = useState([]);

    // State to control the menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // State to control the "Select All" checkbox
    const [isAllSelected, setIsAllSelected] = useState(false);

    // Trigger to fetch subordinates
    useEffect(() => {
      const fetchSubordinates = async () => {
        const { data } = await api.getSubordinates(id);
        dispatcher(loadSubordinates(data));
      };
      fetchSubordinates();
    }, [id]);

    // Function to deselect all subordinate items
    const handleDeselectAll = () => {
      setSelectedItems([]);
      setIsAllSelected(false);
      setIsMenuOpen(false);
    };

    // Function to select/deselect all subordinate items
    const handleSelectAll = () => {
      setIsAllSelected(!isAllSelected);
      setSelectedItems(
        isAllSelected ? [] : subordinates.map((subordinate) => subordinate.id)
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

    // Funtion to handle click to button edit subordinate
    const handleClickEditSubordinate = (itemId) => {
      dispatcher(setCurrentSubordinateId(itemId));
      dispatcher(openSubordinateModal(true));
    };

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
        let { meta: requestStatus } = await dispatcher(
          onDeleteSubordinate(dataForm)
        );
        if (requestStatus === "fulfilled") {
          toast.success("Subordinate deleted");
          setSelectedItems([]);
        } else {
          toast.error("Subordinate delete failed");
        }
      }
    };

    return (
      <div className="bg-white w-full p-5 py-8 rounded-3xl relative">
        {/* Start table */}
        <div className="w-full">
          <div className="flex justify-between border-b pb-5 text-sm text-secondary-500">
            <p className="font-bold">Assigned Subordinates</p>
            <p>{subordinates.length} record(s)</p>
          </div>

          <table className="w-full">
            <thead className="w-full">
              <tr className="border-b w-full">
                {/* Start three dot button */}
                {isDeleteable && (
                  <th className={`py-2 text-left w-[10%]`}>
                    <div ref={menuRef} className="cursor-pointer relative">
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

                      {/* Subordinate Menu */}
                      {subordinates.length > 0 && (
                        <div
                          className={`absolute top-full bg-light border rounded-sm duration-300 w-32
                    ${
                      isMenuOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                        >
                          {/* Start select all option */}
                          {subordinates.length > 0 &&
                            subordinates.length !== selectedItems.length && (
                              <p
                                className="py-4 px-5 text-xs text-secondary-500 hover:bg-secondary-100 duration-300"
                                onClick={handleSelectAll}
                              >
                                Select All
                              </p>
                            )}
                          {/* End select all option */}

                          {/* Start deselect all options */}
                          {subordinates.length > 0 &&
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
                  <span
                    className={`capitalize text-xs font-nutito text-secondary-600 `}
                  >
                    Name
                  </span>
                </th>
                <th className={`py-2 text-left w-[40%]`}>
                  <span
                    className={`capitalize text-xs font-nutito text-secondary-600`}
                  >
                    Reporting Method
                  </span>
                </th>
                {/* col acction */}
                <th></th>
                {/* End col action */}
              </tr>
            </thead>

            <tbody>
              {subordinates &&
                subordinates.map((subordinate) => {
                  const isChecked = selectedItems.includes(subordinate.id);
                  return (
                    <tr
                      key={subordinate.id}
                      className="border-b hover:bg-secondary-100 text-sm text-secondary-500"
                    >
                      {/* Checkbox delete  */}
                      {isDeleteable && (
                        <td className="py-2.5 text-left w-[10%]">
                          <Checkbox
                            onChange={(e) =>
                              handleCheckboxChange(
                                subordinate.id,
                                e.target.checked
                              )
                            }
                            name={subordinate.id}
                            id={subordinate.id}
                            checked={isChecked}
                          />
                        </td>
                      )}

                      <td className="py-2.5 w-[40%] text-left ">
                        <span
                          onClick={() =>
                            navigate(
                              `/employee/${subordinate.employeeId}/report-to`
                            )
                          }
                          className="cursor-pointer"
                        >
                          {subordinate.name}
                        </span>
                      </td>
                      <td className="py-2.5 w-[40%] text-left">
                        {subordinate.method}
                      </td>

                      {/* Button edit subordinate */}
                      {isUpdateable && (
                        <td className="py-2.5  w-[10%] flex  justify-center items-center text-secondary-500">
                          <Button
                            isPadding={false}
                            className="border-none outline-none hover:bg-slate-200 p-2 duration-300"
                            onClick={() =>
                              handleClickEditSubordinate(subordinate.id)
                            }
                          >
                            <MdOutlineEdit size={21} />
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* End table */}

        {/* Start Edit subordinate modal */}
        <SubordinateModal />
        {/* End edit subordinate modal */}

        {/* End modals */}

        {/* <Loading isOpen={isLoading} /> */}
      </div>
    );
  } else {
    return null;
  }
});
