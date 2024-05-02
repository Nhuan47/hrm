import React from "react";

import { Button } from "@/shared/components/ui/button";

export const ButtonAddAttachment = ({ onClick }) => {
  return (
    <Button
      className="bg-primary-500 hover:bg-primary-600 text-light text-sm"
      onClick={onClick}
    >
      Add Attachment
    </Button>
  );
};
