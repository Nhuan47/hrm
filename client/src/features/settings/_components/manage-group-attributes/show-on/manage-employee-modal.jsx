import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cn } from "@/shared/utils";
import { attributesReceived } from "../../../_slices/attribute-slice";
import { Card } from "../card";

const LIST_FIELD_NOT_DELETE = [
  "email",
  "first_name",
  "last_name",
  "middle_name",
  "staff_code",
];

export const ManageEmployeeModal = () => {
  const dispatch = useDispatch();
  const attributes = useSelector((state) => state.attribute.attributes);

  const [itemSelects, setItemSelects] = useState();

  const [active, setActive] = useState(false);

  const handleDragStart = (e, attr) => {
    e.dataTransfer.setData("attrId", attr.id);
  };

  const handleDragEnd = async (e) => {
    const attrId = e.dataTransfer.getData("attrId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element?.dataset?.before || -1;

    if (before !== attrId) {
      let copy = [...attributes];

      let cardToTransfer = copy.find((c) => +c.id === +attrId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, showOnEmployeeModal: 1 };

      // Remove cardToTransfer from the the copy list
      copy = copy.filter((a) => +a.id !== cardToTransfer.id);

      // remove all elements has showOnEmployeeTable attribute equal 1
      const elWithoutShowOnEmp = copy.filter(
        (a) => +a.showOnEmployeeModal !== 1
      );

      // Get list attribute turn on showOnEmployeeTable
      let itemsTurnOn = copy.filter((a) => +a.showOnEmployeeModal === 1);

      const insertAtIndex = itemsTurnOn.findIndex((el) => +el.id === +before);
      if (insertAtIndex === undefined) return;
      // insert intem transfer to array
      itemsTurnOn.splice(insertAtIndex, 0, cardToTransfer);

      // re-order elements
      itemsTurnOn = itemsTurnOn.map((el, index) => ({
        ...el,
        showOnEmployeeModalOrder: index + 1,
      }));

      await dispatch(
        attributesReceived([...elWithoutShowOnEmp, ...itemsTurnOn])
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-group="employee-modal"]`)
    );
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    if (el && el.element) {
      el.element.style.opacity = "1";
      el.element.classList.add("bg-primary-500");
    }
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  useEffect(() => {
    if (attributes) {
      let itemFiltered = attributes.filter(
        (attribute) => attribute.showOnEmployeeModal === 1
      );

      itemFiltered = itemFiltered.sort(
        (a, b) =>
          parseInt(a.showOnEmployeeModalOrder) -
          parseInt(b.showOnEmployeeModalOrder)
      );
      //   console.log(itemFiltered);
      setItemSelects(itemFiltered);
    }
  }, [attributes]);

  const handleDelete = async (item) => {
    const itemsModified = attributes?.map((a) => {
      if (a.id === item.id) {
        return { ...a, showOnEmployeeModal: 0 };
      } else return a;
    });

    await dispatch(attributesReceived(itemsModified));
  };

  return (
    <div
      className={cn(
        "h-full flex-1 overflow-y-scroll mt-1",
        active ? "bg-secondary-100" : ""
      )}
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {itemSelects?.map((item) => (
        <Card
          key={item.id}
          item={item}
          handleDragStart={handleDragStart}
          column="employee-modal"
          onDelete={item?.canEdit ? handleDelete : null}
        />
      ))}
    </div>
  );
};
