import React, { useState, useEffect } from "react";
import { object, array } from "yup";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { checkSize } from "@/shared/utils";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components/ui/button";
import { TextArea } from "@/shared/components/ui/textarea";

export const AttachmentModal = ({ isOpen, onClose }) => {
  const { id } = useParams();

  let yupSchema;
  if (currentId) {
    yupSchema = object().shape({
      files: array()
        .nullable(true)
        .test("is-accept-size", "Attachment size exceeded", checkSize),
    });
  } else {
    yupSchema = object().shape({
      files: array()
        .required("File is required")
        .nullable(true)
        .test("is-accept-size", "Attachment size exceeded", checkSize),
    });
  }

  //  State manage file name
  const [name, setName] = useState("");

  //   Define useForm state
  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      files: [],
      description: "",
    },
    resolver: yupResolver(yupSchema),
  });

  // Fetch current attachment editing
  useEffect(() => {
    if (isOpenModal && currentId) {
      const fetchAttachmentEditing = async () => {
        let res = await api.getAttachmentEditing(currentId);
        if (res.status === 200) {
          const { data } = res;

          // set name for input field
          setName(data.name);

          // set description
          reset({ description: data.description });
        }
      };
      fetchAttachmentEditing();
    }
  }, [currentId]);

  const { isFetching, attachment } = getAttachmentEditing();

  // Join file name to string to display on File field
  const attachFileChanged = watch("files");
  useEffect(() => {
    if (attachFileChanged?.length > 0) {
      let names = [];
      for (let i = 0; i < attachFileChanged.length; i++) {
        let currentFile = attachFileChanged[i];
        let fileName = currentFile.name;
        names.push(fileName);
      }
      setName(names.join(", "));
    }
  }, [attachFileChanged]);

  // Flag - Watch fields dirty to enable button submit form
  const isDisableSubmit = Object.keys(dirtyFields).length === 0;

  // Function to handle form add new attachment submission
  const handleFormAddAttachmentSubmit = async (formData) => {
    let attachFiles = formData.files;

    // Create an array of promises for each file upload
    const uploadPromises = Array.from(attachFiles).map((file) => {
      const data = new FormData();
      data.append("file", file);

      // Return a promise that resolves when the file is uploaded
      return api.uploadAttachmentFile(data);
    });

    try {
      // Wait for all file uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      let attachmentInfo = [];
      for (let i = 0; i < uploadResults.length; i++) {
        let uploadresponse = uploadResults[i];
        if (uploadresponse.status === 201) {
          let uploadItemResult = uploadresponse.data;
          for (let item of attachFiles) {
            if (item.name == uploadItemResult.name) {
              attachmentInfo.push({
                name: item.name,
                size: `${(item.size / 1024).toFixed(2)} KB`,
                type: item.type,
                url: uploadItemResult.url,
              });
            }
          }
        }
      }

      let newData = {
        employeeId: id,
        description: formData.description,
        files: attachmentInfo,
      };

      await dispatcher(addAttachment(newData));
      reset({ _: {} });
      setName("");
    } catch (error) {
      // Handle any errors that occurred during file uploads
      console.error("Error uploading files:", error);
    }

    //
  };

  // Function to handle form update attachment submission
  const handleFormUpdateAttachmentSubmit = async (formData) => {
    let attachFiles = formData?.files;

    // Upload file
    let attachmentInfo = [];
    if (attachFiles?.length) {
      // Create an array of promises for each file upload
      const uploadPromises = Array.from(attachFiles).map((file) => {
        const data = new FormData();
        data.append("file", file);

        // Return a promise that resolves when the file is uploaded
        return api.uploadAttachmentFile(data);
      });

      try {
        // Wait for all file uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        for (let i = 0; i < uploadResults.length; i++) {
          let uploadresponse = uploadResults[i];
          if (uploadresponse.status === 201) {
            let uploadItemResult = uploadresponse.data;
            for (let item of attachFiles) {
              if (item.name == uploadItemResult.name) {
                attachmentInfo.push({
                  name: item.name,
                  size: `${(item.size / 1024).toFixed(2)} KB`,
                  type: item.type,
                  url: uploadItemResult.url,
                });
              }
            }
          }
        }
      } catch (error) {
        // Handle any errors that occurred during file uploads
        console.error("Error uploading files:", error);
      }
    }

    let newData = {
      employeeId: id,
      description: formData.description,
      files: attachmentInfo,
      employeeAttachmentId: currentId,
    };

    await dispatcher(updateAttachment(newData));
    reset({ _: {} });
    setName("");
  };

  // Function to handle active modal

  //   Function to handle form cancel
  const handleFormCancel = (state) => {
    dispatcher(activeModal(false));
    reset({ _: {} });
    setName("");
    dispatcher(setCurrentAttachmentId(null));
  };

  return (
    <Modal
      title={currentId ? "Edit Attachment" : "Add Attachment"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(
          currentId
            ? handleFormUpdateAttachmentSubmit
            : handleFormAddAttachmentSubmit
        )}
      >
        {/* Start form body */}
        <div className="px-5 pb-5 flex flex-col gap-3 justify-center items-stretch w-[35rem]">
          {/* Start file field */}
          <Controller
            name="files"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <>
                {/*Start label*/}
                <label className="text-sm text-secondary-500 font-semibold">
                  File *{" "}
                  <small className="font-normal text-sm">
                    (Accept up to 5MB)
                  </small>
                </label>
                {/* End label */}

                <div
                  className="relative border border-slate-300 hover:border-slate-500 
                p-1 rounded-2xl mt-[-10px]"
                >
                  <input
                    {...field}
                    type="file"
                    multiple={!currentId ? "multiple" : ""}
                    value={value?.file}
                    onChange={(event) => {
                      onChange([...event.target.files]);
                    }}
                    className="
                            rounded-xl cursor-pointer
                            border-none outline-none 
                            text-transparent
                            file:text-sm file:font-medium
                            file:hidden absolute top-0 left-0 w-full h-full"
                  />
                  <div className="flex justify-start items-center gap-5">
                    <Button className="bg-secondary-200 text-secondary-500">
                      Browse
                    </Button>
                    <span className="text-sm text-secondary-500">{name}</span>
                  </div>
                </div>
                {errors?.files?.message && (
                  <p className="text-red-500 text-xs">
                    {errors?.files?.message}
                  </p>
                )}
              </>
            )}
          />
          {/* End file field */}

          {/* Start file field */}
          <Controller
            name="description"
            control={control}
            render={({ field: { ref, ...props } }) => (
              <TextArea
                ref={ref}
                {...props}
                id="description"
                label="Description"
                labelClassName="text-sm capitalize text-secondary-500 font-semibold"
                className="border border-slate-300 focus:border-slate-500 outline-none w-full rounded-xl p-2 text-secondary-500 text-sm duration-300"
                fullWidth
              />
            )}
          />
          {/* End file field */}
        </div>
        {/* End form body */}

        {/* Start Footer Form */}
        <div className="flex justify-between items-center border-t px-5">
          {/* Is required text */}
          <p className="text-xs text-secondary-500 capitalize">* required</p>
          {/* End required text */}

          {/* Start button actions */}
          <div className="flex justify-end items-center gap-2 py-5">
            <Button
              className="border-primary-500  text-primary-600 hover:bg-primary-50"
              onClick={handleFormCancel}
            >
              Cancel
            </Button>

            <Button
              disabled={isDisableSubmit}
              type="submit"
              className={` text-light  ${
                isDisableSubmit
                  ? "bg-primary-400 border-primary-400"
                  : "bg-primary-500 hover:bg-primary-600 border-primary-500"
              }`}
            >
              Save
            </Button>
          </div>
        </div>
        {/* End Footer actions */}
      </form>
    </Modal>
  );
};
