import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import axios from "@/shared/services/axios-instance";

import { useKey } from "@/shared/hooks/use-key";
import { Button } from "@/shared/components/ui/button";
import { Loading } from "@/shared/components/loading-overlay";

import {
  groupsReceived,
  attributesReceived,
  setLoading,
  onSaveSetting,
} from "../../_slices/attribute-slice";

import { ManageGroups } from "./groups";
import { ManageAttributes } from "./attributes";
import { ManageShowOn } from "./show-on";

export const ManageGroupAttributes = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isReset, setIsReset] = useState(false);
  const isLoading = useSelector((state) => state.attribute.isLoading);
  const groups = useSelector((state) => state.attribute.groups);
  const attributes = useSelector((state) => state.attribute.attributes);

  useEffect(() => {
    let controller = new AbortController();
    let signal = controller.signal;

    (async () => {
      try {
        await dispatch(setLoading(true));
        // // Fetching groups
        const { data: response } = await axios.get(
          "/setting/manage-attribute/groups",
          { signal }
        );
        if (response?.status === 200) {
          await dispatch(groupsReceived(response?.data));
        } else {
          setError(
            `HTTP error! Status: ${response?.status} - ${response?.message}`
          );
        }
        // // Fetching attributes
        const { data: attrResponse } = await axios.get(
          "/setting/manage-attribute/attributes",
          { signal }
        );
        if (attrResponse?.status === 200) {
          await dispatch(attributesReceived(attrResponse?.data));
        } else {
          setError(
            `HTTP error! Status: ${response?.status} - ${response?.message}`
          );
        }
      } catch (err) {
        if (!err?.code === "ERR_CANCELED") {
          setError(err);
        }
      } finally {
        await dispatch(setLoading(false));
      }
    })();

    return () => {
      // Cancel the request when the component unmounts
      controller.abort();
    };
  }, [isReset]);

  const handleSave = async () => {
    let {
      meta: { requestStatus },
    } = await dispatch(onSaveSetting({ groups, attributes }));

    if (requestStatus === "fulfilled") {
      toast.success("Save Success");
    } else {
      toast.error("Save Failed");
    }
  };

  useKey("ctrls", handleSave);

  if (error) return <span>Error acurring</span>;

  return (
    <div className="space-y-10">
      {/* Manage Groups */}
      <ManageGroups />

      {/*Manage Atributes */}
      <ManageAttributes />

      {/* Manage show on table/modal */}
      <ManageShowOn />

      <div className="flex justify-end items-center border-t py-3 gap-2">
        <Button className="btn-primary" onClick={() => setIsReset(!isReset)}>
          Reset
        </Button>
        <Button className="btn-primary" onClick={handleSave}>
          Save
        </Button>
      </div>

      <Loading isOpen={isLoading} />
    </div>
  );
};
