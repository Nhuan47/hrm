import React, { useEffect, useRef, useState } from "react";

const groupItems = [
  { title: "backlog", id: "1", accessor: "backlog" },
  { title: "todo", id: "2", accessor: "todo" },
  { title: "doing", id: "3", accessor: "doing" },
  { title: "done", id: "4", accessor: "done" },
];

const attributeItems = [
  // BACKLOG
  {
    title: "1. Look into render bug in dashboard",
    id: "1",
    groupId: "1",
    order: 1,
  },
  { title: "2. SOX compliance checklist", id: "2", groupId: "1", order: 2 },
  { title: "3. [SPIKE] Migrate to Azure", id: "3", groupId: "1", order: 5 },
  {
    title: "4. Document Notifications service",
    id: "4",
    groupId: "1",
    order: 7,
  },
  // TODO
  {
    title: "5. Research DB options for new microservice",
    id: "5",
    groupId: "2",
    order: 1,
  },
  { title: "6. Postmortem for outage", id: "6", groupId: "2", order: 2 },
  {
    title: "8. Sync with product on Q3 roadmap",
    id: "7",
    groupId: "2",
    order: 4,
  },

  // DOING
  {
    title: "7. Refactor context providers to use Zustand",
    id: "8",
    groupId: "3",
    order: 1,
  },
  { title: "Add logging to daily CRON", id: "9", groupId: "3", order: 2 },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    groupId: "4",
    order: 5,
  },
];

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5  w-full opacity-0 "
    />
  );
};

const Card = ({ id, title, groupId, handleDragStart, index }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={groupId} />
      <div
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, groupId })}
        className="border p-2 hover:bg-secondary-200"
      >
        <p>{title}</p>
      </div>
    </>
  );
};

const Column = ({ column, cards, setCards }) => {
  const [active, setActive] = useState(false);
  const items = cards?.filter((card) => card.groupId === column.id);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);

    // e.target.style.transform = `translate(e{}300px, 20px)`;
    // e.target.removeChild();
  };

  const handleUpdateGroup = async (cards) => {
    console.log(cards);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    console.log(e);

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element?.dataset?.before || "-1";
    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, groupId: column.id };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);

        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      let reOrders = copy
        .filter((item) => item.groupId === column.id)
        ?.map((item, index) => ({ ...item, order: index }));

      const mapped = copy.reduce((a, t) => ((a[t.id] = t), a), {}),
        mapped2 = reOrders.reduce((a, t) => ((a[t.id] = t), a), {});
      let cardItems = Object.values({ ...mapped, ...mapped2 })?.sort(
        (a, b) => a.order - b.order
      );
      setCards(cardItems);
    }
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
    el.element.style.backgroundColor = "green";
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    console.log(e.target);

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
      document.querySelectorAll(`[data-column="${column.id}"]`)
    );
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

  return (
    <div className=" basis-1/4">
      <div className="border p-2 bg-red-200">
        {column?.title} - {items.length}
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors border ${
          active ? "bg-neutral-200/50" : ""
        }`}
      >
        {items?.map((item, index) => (
          <Card
            key={item.id}
            {...item}
            handleDragStart={handleDragStart}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export const Test = () => {
  const [columns, setColumns] = useState(groupItems);
  const items = attributeItems.sort((a, b) => a.order - b.order);
  const [cards, setCards] = useState(items);

  return (
    <div className="flex flex-wrap justify-between items-stretch ">
      {columns?.map((column) => (
        <Column
          key={column.id}
          cards={cards}
          column={column}
          setCards={setCards}
        />
      ))}
    </div>
  );
};
