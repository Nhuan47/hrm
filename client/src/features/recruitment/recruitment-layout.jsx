import React from "react";
import { Outlet, useParams } from "react-router-dom";

import { Navbar } from "@/layout/_components/navbar";

const RecruitmentLayout = () => {
  return (
    <>
      <Navbar items={[]} />
      <section className="px-10 py-5 flex-1 ">
        <article className="w-full h-full p-5 rounded-3xl relative">
          <Outlet />
        </article>
      </section>
    </>
  );
};

export default RecruitmentLayout;
