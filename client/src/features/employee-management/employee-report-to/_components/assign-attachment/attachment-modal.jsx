import React, { useState, useEffect } from "react";
import { object, array } from "yup";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { checkSize } from "@/shared/utils";
import { useFetch } from "@/shared/hooks/use-fetch";
import { Modal } from "@/shared/components/modal";
import { LoadingReload } from "@/shared/components/loading-reload";

import { ModalInputFile } from "./modal-input-file";
import { ModalDescription } from "./modal-description";
import { ModalAction } from "./modal-action";

export const AttachmentModal = ({ isOpen, onClose, idEditing, onSubmit }) => {
  // State manage file name
  const { id } = useParams();

  let yupSchema;
  if (idEditing) {
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

  // Define useForm state
  const methods = useForm({
    defaultValues: {
      files: [],
      description: "",
    },
    resolver: yupResolver(yupSchema),
  });

  const { isFetching, data: attachment } = useFetch(
    `/employee/report-to/${idEditing}/attachment`,
    { dependencies: [idEditing] }
  );

  return (
    <Modal
      title={idEditing ? "Edit Attachment" : "Add Attachment"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="px-5 pb-5 flex flex-col gap-3 justify-center items-stretch w-[35rem]">
            {!isFetching ? (
              <>
                <ModalInputFile name={attachment?.name} />
                <ModalDescription description={attachment?.description} />
                <ModalAction onCancel={onClose} />
              </>
            ) : (
              <LoadingReload />
            )}
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
