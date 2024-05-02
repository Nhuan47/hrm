import React, { useEffect, useRef } from "react";

import { cn } from "@/shared/utils";

import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const Layout = ({ breadcrumbs, navItems, children, isBackground = true }) => {
  

  return (
    <div className="flex justify-start  h-screen bg-light bg-gradient-to-r from-secondary-100 ">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="relative flex flex-col grow gap-0  overflow-auto">
        {/* Header */}
        <Header breadcrumbs={breadcrumbs} />

        <main
          className="flex grow flex-col overflow-auto pb-10 relative"
          id="id-layout-main"
        >
          {/* Navbar */}
          <Navbar items={navItems} />

          {/* Article */}
          <section className="px-10 py-5">
            <div
              className={cn(
                " w-full h-full p-5 rounded-3xl relative ",
                isBackground && "bg-light shadow-xl"
              )}
            >
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Layout;
