import React from "react";

export const GroupAttributeHeader = ({ title }) => {
  return (
    <div className="border-b">
      <p className="text-secondary-500 capitalize p-2 font-bold">{title}</p>
    </div>
  );
};
