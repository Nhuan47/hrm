import React from "react";

import { logo } from "@/shared/assets/images";
import { cn } from "@/shared/utils";

import { Logo } from "../_components/login-logo";
import { LoginForm } from "../_components/login-form";
import { LoginTitle } from "../_components/login-title";

export const LoginPage = () => {
  return (
    <div className="bg-white w-screen h-screen flex justify-center items-center">
      <div
        className={cn(
          "p-5 shadow-[0rem_0.375rem_1.125rem_0.125rem_rgba(234,234,234,1)]",
          "border border-slate-300 rounded-xl overflow-hidden",
          "flex flex-col justify-center items-center min-w-[20rem]"
        )}
      >
        {/* Logo */}
        <Logo src={logo} />

        {/* Title */}
        <LoginTitle />

        <div className="mt-4 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
