import React from "react";
import { Button } from "@/shared/components/ui/button";

export const FormAction = ({ onCancel }) => {
  return (
    <div className="flex justify-end items-center py-2 gap-2 border-t px-3">
      <Button type="button" onClick={onCancel} className="btn-secondary">
        Cancel
      </Button>
      <Button type="submit" className="btn-primary">
        OK
      </Button>
    </div>
  );
};
