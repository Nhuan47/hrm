import React from "react";

export const Wrapper = ({ title, icon, children }) => {
  return (
    <div className="bg-light text-secondary-500 text-sm p-3 shadow-2xl border border-slate-200 rounded-2xl w-full min-h-[25rem]">
      <div className="w-full py-2 text-secondary-600">
        <h2 className="flex items-center gap-2 font-semibold text-sm select-none">
          {icon}
          {title}
        </h2>
      </div>
      {/* content */}
      <div className="border-t pt-3 border-secondary-200">{children}</div>
    </div>
  );
};
