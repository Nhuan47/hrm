import React from "react";

export const Title = ({ title }) => {
  return (
    <div className="flex justify-start items-center pb-2 border-b">
      <h2 className="text-sm text-secondary-500 font-semibold select-none ">
        {title}
      </h2>
    </div>
  );
};
