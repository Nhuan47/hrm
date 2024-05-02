import React from "react";

import { Button } from "@/shared/components/ui/button";

export const FormAction = ({ onCancel }) => {
  return (
    <div className="w-full flex justify-end items-center space-x-2 py-2">
      <Button type="button" className="btn-secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" className="btn-primary">
        Save
      </Button>
    </div>
  );
};
