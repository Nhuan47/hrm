import React from "react";
import { Outlet, useParams } from "react-router-dom";

import { Navbar } from "@/layout/_components/navbar";

const navItems = [
  { name: "User Roles", url: "/setting/user-roles" },
  { name: "Manage Roles", url: "/setting/manage-roles" },
  { name: "Manage Attributes", url: "/setting/manage-attributes" },
];

const SettingLayout = () => {
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

export default SettingLayout;
