import React from "react";
import { LiaSignOutAltSolid } from "react-icons/lia";

import { Button } from "@/shared/components/ui/button";

export const SignOutButton = ({ onSignOut }) => {
  return (
    <Button
      isPadding={false}
      className="bg-primary-500 hover:bg-primary-600/90 duration-300 text-light px-3 py-1"
      iconPos="left"
      icon={<LiaSignOutAltSolid size={18} />}
      onClick={onSignOut}
    >
      Log out
    </Button>
  );
};
