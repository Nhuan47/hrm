import { useRef, useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { BiSolidTrashAlt } from "react-icons/bi";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";

import { FILTER_KEY } from "../../../_constants/definition-constant";
import { FilterItem } from "./filter-item";

export const ReportFilterStep = memo(({ title, groups }) => {
  // Create a ref to store references to submenu element
  const menuRef = useRef(null);

  const availableFilterGroups = useSelector(
    (state) => state.definition.availableFilterGroups
  );

  const availableFilters = useSelector(
    (state) => state.definition.availableFilters
  );

  const selectedFilters = useSelector(
    (state) => state.definition.selectedFilters
  );

  // State to track the menu open
  const [openCriteria, setOpenCriteria] = useState(false);

  // Function to toggle open/close state of submenu
  const handleToggle = () => {
    setOpenCriteria((prev) => !prev);
  };

  // custom hook used to handle close menu when event click outside menu
  useOutsideClick(menuRef, () => setOpenCriteria(false));

  //   State to manage group seleted
  const [filterGroupSelected, setCriteriaOptionSelected] = useState([]);

  //   State to manage filter attributes checked
  const [filterItems, setFilterItems] = useState([]);

  const { unregister, watch, setValue } = useFormContext();

  // Watch for changes in the filter
  const filterWatcher = watch();

  //   Handle edit report - set value for field
  useEffect(() => {
    if (
      selectedFilters &&
      Object.keys(selectedFilters)?.length > 0 &&
      filterWatcher?.[FILTER_KEY] &&
      Object.keys(filterWatcher?.[FILTER_KEY]).length === 0
    ) {
      Object.keys(selectedFilters).forEach((id) => {
        setValue(`${FILTER_KEY}.${id}`, selectedFilters[id]);
      });
    }
  }, []);

  // trigger to select criteria and checked checkbox
  useEffect(() => {
    // Check if the FILTER_KEY is present in the filterWatcher
    if (filterWatcher.hasOwnProperty(FILTER_KEY)) {
      // Get the field IDs of the selected filters
      const listFilterId = Object.keys(filterWatcher[FILTER_KEY]);

      // Get filter objects based on the selected filter IDs

      const filterItems = Object.values(availableFilters)
        .map((field) => {
          if (listFilterId.includes(field.id.toString())) {
            return field;
          }
          return null;
        })
        .filter((item) => item !== null);

      // Collect group IDs selected from filter items
      const groupIds = filterItems?.map((item) => item.groupId);

      // Find filter groups selected
      const groupSelected = Object.values(availableFilterGroups)
        .map((item) => {
          if (groupIds.includes(item.id)) {
            return item;
          }
          return null;
        })
        .filter((item) => item !== null);

      // Update state with the selected criteria options and filter items
      setCriteriaOptionSelected(groupSelected);
      setFilterItems(filterItems);
    }
  }, []);

  //   Trigger remove filter field when filter group remove
  useEffect(() => {
    if (filterGroupSelected.length > 0) {
      // // Find group id of the filter group selected
      const groupIdSelected = filterGroupSelected.map((group) => group.id);

      // // Filter fields  in group selected
      const currenFieldSelected = filterItems.filter((field) =>
        groupIdSelected.includes(field.groupId)
      );

      // // Unregister in hook form
      filterItems.forEach((field) => {
        if (!groupIdSelected.includes(field.groupId)) {
          unregister(`${FILTER_KEY}.${field.id}`);
        }
      });

      // // Reset filter field

      setFilterItems(currenFieldSelected);
    }
  }, [filterGroupSelected]);

  //   Handle remove filter group
  const handleRemoveFilterGroup = (name) => {
    const newCriteria = filterGroupSelected.filter(
      (item) => item.name !== name
    );
    if (!newCriteria.length) setFilterItems([]);
    setCriteriaOptionSelected(newCriteria);
  };

  //   Function to handle add group to criteria
  const handleGroupClick = (criteria) => {
    setCriteriaOptionSelected((prev) => [...prev, criteria]);
  };

  //   Function to handle remove group in criteria
  const handleRemoveFilterField = (id) => {
    setFilterItems((prev) => prev.filter((it) => it.id !== id));

    let checkbox = document.querySelector(`input[id="${id}"]`);
    checkbox.checked = false;
    // $checkbox.checked = false;

    // unregister
    unregister(`${FILTER_KEY}.${id}`);
  };

  //   Function to handle field select/unselect -> append/remove to filter items
  const handleCheckboxChange = (event, field) => {
    if (!event.target.checked) {
      setFilterItems((prev) => prev.filter((it) => it.id !== field.id));

      //   Unregester field
      unregister(`${FILTER_KEY}.${field.id}`);
    } else {
      setFilterItems((prev) => [...prev, field]);
    }
  };

  return (
    <div className="bg-light p-5 rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b border-secondary-200 pb-5 pt-2">
        <h3 className="capitalize text-secondary-500 text-md font-bold leading-5 first-line:space-x-4">
          {title}
        </h3>

        <div
          className="bg-primary-500 hover:bg-primary-400 py-2 px-8 rounded-sm cursor-pointer relative"
          onClick={handleToggle}
          ref={menuRef}
        >
          <span className="text-white uppercase text-xs">
            additional selection Filter
          </span>

          {/* Cretiaria menu */}
          <ul
            className={`absolute top-full left-0 right-0 border border-slate-200 bg-light z-10 shadow-sm overflow-auto duration-300 ${
              openCriteria ? "" : "h-0"
            }`}
          >
            {Object.keys(availableFilterGroups).map((groupKey, index) => {
              //  get items selected and hide in the menu
              let selectedItems = filterGroupSelected.filter(
                (item) => item.accessor === groupKey
              );

              if (!selectedItems.length) {
                return (
                  <li
                    key={groupKey}
                    className="text-secondary-500 text-xs capitalize p-4 hover:bg-secondary-200"
                    onClick={() =>
                      handleGroupClick(availableFilterGroups[groupKey])
                    }
                  >
                    {availableFilterGroups[groupKey].name}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>

      {/* CheckBox Option of a criteria */}
      {filterGroupSelected &&
        filterGroupSelected.map((criteria) => {
          return (
            <div
              key={criteria.id}
              className="flex justify-between items-start f-full border-b border-slate-200 py-5"
            >
              <div className="basis-3/12 flex gap-3">
                <span
                  className="text-secondary-500 cursor-pointer hover:text-secondary-600"
                  onClick={() => handleRemoveFilterGroup(criteria.name)}
                >
                  <BiSolidTrashAlt size={20} />
                </span>

                <span className="text-sm text-secondary-500 font-bold font-nutito leading-4 capitalize">
                  {criteria.name}
                </span>
              </div>

              <div className="basis-9/12 flex justify-between flex-wrap gap-y-5">
                {Object.keys(availableFilters).map((field) => {
                  if (availableFilters[field].groupId === criteria.id) {
                    return (
                      <div
                        className="basis-1/3"
                        key={availableFilters[field].id}
                      >
                        <Checkbox
                          id={availableFilters[field].id}
                          label={availableFilters[field].name}
                          onChange={(e) =>
                            handleCheckboxChange(e, availableFilters[field])
                          }
                          defaultChecked={
                            filterItems?.filter(
                              (item) => item.id === availableFilters[field].id
                            ).length > 0
                          }
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}

      {/* Start filter item selected */}
      {filterItems &&
        filterItems.map((item) => {
          return (
            <FilterItem
              item={item}
              key={`filter_${item.id}`}
              onDelete={handleRemoveFilterField}
            />
          );
        })}
    </div>

    ///* Start filter item selected */
  );
});
