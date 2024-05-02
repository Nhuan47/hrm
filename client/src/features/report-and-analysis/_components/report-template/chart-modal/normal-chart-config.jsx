import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { GROUP_KEY } from "@/shared/constants";

import { ChartConfigItem } from "./normal-chart-config-item";

const PREFIX_NAME = "new_";

export const NormalChartConfig = ({ fields }) => {
  const isActiveModal = useSelector(
    (state) => state.report.chartInfo.isActiveModal
  );

  const {
    control,
    watch,
    unregister,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext();
  const formWatch = watch();

  const watchGroupField = watch(GROUP_KEY);

  const [items, setItems] = useState(() => {
    const initialGroupBy = [];

    if (Object.keys(formWatch[GROUP_KEY]).length > 0) {
      Object.keys(formWatch[GROUP_KEY])?.forEach((key, index) => {
        if (formWatch[GROUP_KEY][key]?.value) {
          initialGroupBy.push({
            id: key,
            value: formWatch[GROUP_KEY][key].value, // value is attribute id
          });
        }
      });
    }

    // console.log("initialGroupBy: ", initialGroupBy);

    return [
      ...initialGroupBy,
      { id: `${PREFIX_NAME}_${uuidv4()}`, value: null },
    ];
  });

  // Clear error when form change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      clearErrors(`${name}`);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Listen from watch  and Add new field group by
  useEffect(() => {
    // Add new field -> check group not is empty array (when add new group then value of this group is array empty)
    let groupByHasValue = Object.keys(watchGroupField).filter(
      (key) => watchGroupField[key] !== undefined
    );

    // If all field and watch has value then add new field. otherwise don't add field
    if (
      groupByHasValue.length === items.length &&
      Object.values(watchGroupField).length
    ) {
      //Generate unique id
      setItems([...items, { id: `${PREFIX_NAME}_${uuidv4()}`, value: null }]);
    }
  }, [formWatch, items, isActiveModal]);

  //  Function to handle remove group by item
  const handleRemoveItemClick = (id) => {
    unregister(`${GROUP_KEY}.${id}`);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="flex flex-wrap ">
        {items &&
          items?.map((item) => (
            <ChartConfigItem
              key={item.id}
              id={item.id}
              control={control}
              errors={errors}
              value={item.value}
              fields={fields}
              watchGroupField={watchGroupField}
              handleRemoveItemClick={handleRemoveItemClick}
            />
          ))}
      </div>
    </>
  );
};
