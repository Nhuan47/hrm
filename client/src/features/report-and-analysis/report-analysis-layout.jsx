import React from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "@/layout/_components/navbar";

const ReportAnalysisLayout = () => {
  return (
    <>
      <Navbar
        items={[{ name: "report", url: `/report-and-analytics/catalogue` }]}
      />
      <section className="px-10 py-5 flex-1 ">
        <article className="w-full h-full p-5 rounded-3xl relative">
          <Outlet />
        </article>
      </section>
    </>
  );
};

export default ReportAnalysisLayout;
