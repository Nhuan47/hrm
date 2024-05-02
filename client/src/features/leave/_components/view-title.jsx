import React from "react";

export const ViewTitle = ({ title }) => {
  return (
    <div className="py-4">
      <h2 className="font-semibold text-lg text-secondary-500 capitalize">
        {title}
      </h2>
    </div>
  );
};
