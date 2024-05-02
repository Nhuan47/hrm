import React, { memo, useEffect } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { toast } from "react-toastify";

import { Modal } from "@/shared/components/modal";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

import {
  addFolder,
  updateFolder,
  loadFolderUpdating,
} from "../../../_slices/catalogue-slice";
import { FormInput } from "./form-input";

export const FolderModal = memo(({ isOpen, folder, onClose }) => {
  // Define dispatch event
  const dispatch = useDispatch();

  // get folder list from redux store
  const folders = useSelector((state) => state.catalogue.folders);
  const currentFolderEditing = useSelector(
    (state) => state.catalogue.currentFolderEditing
  );

  const schema = object().shape({
    folderName: string()
      .required("Folder name is required")
      .test("is-exist", "Already exists", (folderName) => {
        if (folderName) {
          let folder = folders.filter(
            (folder) => folder.name.trim() === folderName?.trim()
          );
          return !folder.length > 0;
        }
        return true;
      }),
  });

  // Initialize react-hook-form with useForm
  const methods = useForm({
    defaultValues: { folderName: "" },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (currentFolderEditing) {
      setValue("folderName", currentFolderEditing.name);
    }
  }, [currentFolderEditing, isOpen]);

  const handleFormClose = async () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (formData) => {
    if (currentFolderEditing) {
      const dataUpdate = { ...formData, id: currentFolderEditing?.id };
      const {
        meta: { requestStatus },
      } = await dispatch(updateFolder(dataUpdate));

      // Check dispatch status and show message notification
      if (requestStatus === "fulfilled") {
        dispatch(loadFolderUpdating(null));
        setTimeout(() => handleFormClose(), 1000);
        toast.success("Update folder successfully");
      } else {
        toast.error("Update folder failed ");
      }
    } else {
      // Dispatch action add folder to redux store
      const {
        meta: { requestStatus },
      } = await dispatch(addFolder(formData));

      // Check dispatch status and show message notification
      if (requestStatus === "fulfilled") {
        setTimeout(() => handleFormClose(), 1000);
        toast.success("Add folder successfully");
      } else {
        toast.error("Add folder failed ");
      }
    }
  };

  return (
    <Modal
      title={folder ? "Edit Folder" : "Add Folder"}
      isOpen={isOpen}
      onClose={handleFormClose}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Start Form body */}
          <div className="px-5 pb-5 flex flex-col gap-3 justify-center items-stretch min-w-[25rem]">
            {/* Field Name */}
            <FormInput
              name="folderName"
              label="Folder Name"
              className="w-full"
              placeholder="Enter folder name"
            />
          </div>
          {/* End Form body */}

          {/* Start Footer Form */}
          <div className="flex justify-between items-center border-t px-5">
            {/* Is required text */}
            <p className="text-xs text-secondary-500 capitalize">* required</p>
            {/* End required text */}

            {/* Start button actions */}
            <div className="action-btn-wrapper">
              <Button className="btn-secondary" onClick={handleFormClose}>
                Cancel
              </Button>

              <Button type="submit" className="btn-primary">
                Save
              </Button>
            </div>
            {/* End button actions */}
          </div>
          {/* End Footer form */}
        </form>
      </FormProvider>
    </Modal>
  );
});
