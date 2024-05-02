import React from "react";

export const Wrapper = ({ children }) => {
  return (
    <section className="bg-light text-secondary-500 rounded-2xl p-5 shadow-lg border-slate-200 border">
      {children}
    </section>
  );
};
