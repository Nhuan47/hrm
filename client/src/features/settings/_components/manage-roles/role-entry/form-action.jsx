import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

export const FormAction = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end item-center gap-2">
      <Button
        type="button"
        className="btn-secondary"
        onClick={() => navigate("/setting/manage-roles")}
      >
        Cancel
      </Button>
      <Button type="submit" className="btn-primary">
        Save
      </Button>
    </div>
  );
};
