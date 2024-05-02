import { useRef, useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";

import { useOutsideClick } from "@/shared/hooks/use-outside-click";

import { DisplayItem } from "./display-item";
import { DISPLAY_KEY } from "../../../_constants/definition-constant";

export const ReportDisplayStep = memo(({ title, groups }) => {
  // Create a ref to store references to submenu element
  const menuRef = useRef(null);

  // Custom hook used to close the display menu when click outside
  useOutsideClick(menuRef, () => setOpenCriteria(false));

  const availableDisplayGroups = useSelector(
    (state) => state.definition.availableDisplayGroups
  );
  const selectedDisplayFields = useSelector(
    (state) => state.definition.selectedDisplayFields
  );

  // State to track the menu open
  const [openCriteria, setOpenCriteria] = useState(false);

  const [displayGroupSelected, setDisplayGroupSelected] = useState([]);

  const { watch, setValue, unregister } = useFormContext();

  // Watch for changes in the filter
  const displayWatcher = watch();

  useEffect(() => {
    if (
      selectedDisplayFields &&
      selectedDisplayFields.length > 0 &&
      Object.keys(displayWatcher[DISPLAY_KEY]).length === 0
    ) {
      selectedDisplayFields.forEach((id) => {
        setValue(`${DISPLAY_KEY}.${id}`, true);
      });
    }
  }, []);

  //   Trigger to fill checkbox default checked
  useEffect(() => {
    // Check if the DISPLAY_KEY is present in the filterWatcher
    if (displayWatcher.hasOwnProperty(DISPLAY_KEY)) {
      // Get the field IDs of the selected display
      const listFieldIdDisplay = Object.keys(
        displayWatcher[DISPLAY_KEY]
      ).filter((fieldId) => displayWatcher[DISPLAY_KEY][fieldId]);

      //   Find group has field id checked above
      const groupSelected = Object.keys(availableDisplayGroups).flatMap(
        (accessorKey) => {
          const group = availableDisplayGroups[accessorKey];
          const hasMatchingField = group?.fields?.some((field) =>
            listFieldIdDisplay.includes(field.id.toString())
          );

          return hasMatchingField ? [group] : [];
        }
      );

      setDisplayGroupSelected(groupSelected);

      listFieldIdDisplay.forEach((fieldId) => {
        setValue(`${DISPLAY_KEY}.${fieldId}`, true);
      });
    }
  }, []);

  // Function to toggle open/close state of submenu
  const handleToggle = () => {
    setOpenCriteria((prev) => !prev);
  };

  const removeGroupDisplay = (id) => {
    const itemSelected = displayGroupSelected.filter((item) => item.id !== id);

    // remove field on form
    const currentGroup = displayGroupSelected.filter((item) => item.id === id);
    if (currentGroup) {
      currentGroup[0].fields?.forEach((field) => {
        unregister(`${DISPLAY_KEY}.${field.id}`);
      });
    }

    setDisplayGroupSelected(itemSelected);
  };

  const handleAddDisplayGroup = (criteria) => {
    setDisplayGroupSelected((prev) => [...prev, criteria]);
  };

  return (
    <div className="bg-white p-5 rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b border-slate-200 pb-5 pt-2">
        <h3 className="capitalize text-secondary-500 text-md font-bold font-nutito leading-5 space-x-4 ">
          {title}
        </h3>

        <div
          className="bg-primary-500 hover:bg-primary-400 py-2  px-8 rounded-sm cursor-pointer relative"
          onClick={handleToggle}
          ref={menuRef}
        >
          <span className="text-white uppercase text-xs">
            additional selection display
          </span>

          {/* Cretiaria menu */}
          <ul
            className={`absolute top-full left-0 right-0 border border-slate-200 bg-light z-10 overflow-auto duration-300 ${
              openCriteria ? "" : "h-0"
            }`}
          >
            {availableDisplayGroups &&
              Object.keys(availableDisplayGroups).map((groupKey, index) => {
                let selectedItems = displayGroupSelected.filter(
                  (item) => item.accessor === groupKey
                );

                if (!selectedItems.length) {
                  return (
                    <li
                      key={index}
                      className="text-secondary-500 text-xs capitalize p-4 hover:bg-secondary-200"
                      onClick={() =>
                        handleAddDisplayGroup(availableDisplayGroups[groupKey])
                      }
                    >
                      {availableDisplayGroups[groupKey].name}
                    </li>
                  );
                }
              })}
          </ul>
        </div>
      </div>

      {/* Field items */}
      {displayGroupSelected &&
        displayGroupSelected.map((criteria, index) => (
          <DisplayItem
            fieldItem={criteria}
            key={index}
            onDelete={removeGroupDisplay}
          />
        ))}
    </div>
  );
});
