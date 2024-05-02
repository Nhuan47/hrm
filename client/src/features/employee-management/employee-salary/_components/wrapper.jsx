import React from "react";

import { Title } from "./title";

export const Wrapper = ({ title, children }) => {
  return (
    <div className="bg-light rounded-2xl p-5 shadow-lg border">
      <Title title={title} />

      <div className="mt-5">{children}</div>
    </div>
  );
};
