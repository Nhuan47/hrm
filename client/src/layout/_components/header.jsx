import React from "react";
import { useDispatch } from "react-redux";

import { Breadcrumb } from "./breadcrumb";
import { SignOutButton } from "./sign-out-button";
import { signOut } from "@/features/authentication/_slices/auth-slice";
import { useNavigate } from "react-router-dom";

export const Header = ({ breadcrumbs }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await dispatch(signOut());
    setTimeout(() => navigate("/login"), 100);
  };

  return (
    <div className="w-full bg-primary-500 bg-gradient-to-r from-primary-400 px-10">
      <div className="py-2">
        <div className="flex justify-between items-center">
          <Breadcrumb />

          <SignOutButton onSignOut={onSignOut} />
        </div>
      </div>
    </div>
  );
};
