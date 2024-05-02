import React from "react";
import { Outlet, useParams } from "react-router-dom";

import { Navbar } from "@/layout/_components/navbar";
import { useNavItems } from "../../shared/hooks/use-nav-items";

const EmployeeManagementLayout = () => {
  const { navItems } = useNavItems();

  return (
    <>
      <Navbar items={navItems} />
      <section className="px-10 py-5 flex-1 ">
        <article className="w-full h-full p-5 rounded-3xl relative">
          <Outlet />
        </article>
      </section>
    </>
  );
};

export default EmployeeManagementLayout;
