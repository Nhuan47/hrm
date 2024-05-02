import React from "react";

export const ColumnTitle = ({ title }) => {
  return (
    <div className="border-b py-2 px-2 bg-primary-500 text-sm text-light  ">
      <h2>{title}</h2>
    </div>
  );
};
