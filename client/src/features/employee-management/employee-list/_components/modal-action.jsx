import React from "react";

import { Button } from "@/shared/components/ui/button";

export const ModalAction = ({ onCancel }) => {
  return (
    <div className="flex justify-end items-center space-x-2 p-5">
      <Button type="button" className="btn-secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" className="btn-primary">
        Save
      </Button>
    </div>
  );
};
